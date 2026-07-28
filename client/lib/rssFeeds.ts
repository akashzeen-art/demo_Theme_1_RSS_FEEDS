/**
 * StreamsIndia RSS types + helpers.
 * Customize feeds in: client/config/platformRss.config.ts
 */

import {
  PLATFORM_RSS_CONFIG,
  type LiveStreamItem,
  type PlatformCategoryRss,
} from '@/config/platformRss.config';
import { getVideo } from '@/sections/desiVideos';

export type RssCategoryId =
  | 'reels'
  | 'live'
  | 'sports'
  | 'movies'
  | 'webseries';

export type RssProvider = 'youtube' | 'platform' | 'rss' | 'live';

export type RssVideoItem = {
  id: string;
  title: string;
  link: string;
  thumbnail: string;
  pubDate: string;
  author: string;
  /** Direct media URL or remote embed URL */
  embedUrl: string;
  provider: RssProvider;
  /** Catalog sno when provider = platform */
  platformSno?: number;
  /** True when item is a live HLS / live stream */
  isLive?: boolean;
};

export type RssFeedConfig = {
  id: RssCategoryId;
  title: string;
  subtitle: string;
  path: string;
  accent: string;
  badge: string;
  sno: number;
  enabled: boolean;
  source: PlatformCategoryRss['source'];
  channelId: string;
  channelName: string;
  rssUrl?: string;
  preferLive?: boolean;
  liveStreams: LiveStreamItem[];
  platformSnos: number[];
  platformTitles?: string[];
};

const META: Record<
  RssCategoryId,
  Pick<RssFeedConfig, 'title' | 'subtitle' | 'path' | 'accent' | 'badge' | 'sno'>
> = {
  reels: {
    title: 'Reels',
    subtitle: 'Hollywood shorts, celeb buzz and viral studio moments',
    path: '/reels',
    accent: 'from-rose-600 to-orange-500',
    badge: 'Shorts',
    sno: 71,
  },
  live: {
    title: 'Live',
    subtitle: 'Global entertainment streams, gossip formats and pop-culture live cuts',
    path: '/live',
    accent: 'from-red-600 to-rose-700',
    badge: 'On Air',
    sno: 51,
  },
  sports: {
    title: 'Sports',
    subtitle: 'International sports culture, stadium clips and crossover highlights',
    path: '/sports',
    accent: 'from-emerald-600 to-teal-500',
    badge: 'Arena',
    sno: 31,
  },
  movies: {
    title: 'Movies',
    subtitle: 'Hollywood trailers, premieres and big-screen moments',
    path: '/movies',
    accent: 'from-red-700 to-amber-600',
    badge: 'Cinema',
    sno: 1,
  },
  webseries: {
    title: 'Web Series',
    subtitle: 'Global series fandom, streaming chatter and binge-worthy drops',
    path: '/webseries',
    accent: 'from-orange-600 to-red-600',
    badge: 'Series',
    sno: 13,
  },
};

function buildCategory(id: RssCategoryId): RssFeedConfig {
  const cfg = PLATFORM_RSS_CONFIG.categories[id];
  const meta = META[id];
  return {
    id,
    ...meta,
    enabled: cfg.enabled,
    source: cfg.source,
    channelId: cfg.youtubeChannelId || `platform-${id}`,
    channelName: cfg.channelName || PLATFORM_RSS_CONFIG.brand,
    rssUrl: cfg.rssUrl,
    preferLive: Boolean(cfg.preferLive),
    liveStreams: cfg.liveStreams || [],
    platformSnos: cfg.platformSnos || [],
    platformTitles: cfg.platformTitles,
  };
}

/** Always rebuild from live config (avoids stale HMR / module cache) */
export function getAllRssCategories(): RssFeedConfig[] {
  return (Object.keys(META) as RssCategoryId[]).map(buildCategory);
}

export function getEnabledRssCategories(): RssFeedConfig[] {
  return getAllRssCategories().filter((c) => c.enabled);
}

/** @deprecated use getAllRssCategories() — kept for imports */
export const ALL_RSS_CATEGORIES: RssFeedConfig[] = getAllRssCategories();

/** @deprecated use getEnabledRssCategories() — kept for imports */
export const RSS_CATEGORIES: RssFeedConfig[] = getEnabledRssCategories();

export function getRssCategory(id: string): RssFeedConfig | undefined {
  if (!(id in META)) return undefined;
  return buildCategory(id as RssCategoryId);
}

/** Build live HLS items from config.liveStreams */
export function buildLiveStreamItems(category: RssFeedConfig): RssVideoItem[] {
  return (category.liveStreams || []).map((stream, i) => ({
    id: `live-${category.id}-${i}`,
    title: stream.title,
    link: category.path,
    thumbnail:
      stream.thumbnail ||
      `/landscape_new_desicontent/${category.sno}.png`,
    pubDate: new Date().toISOString(),
    author: category.channelName,
    embedUrl: stream.url,
    provider: 'live' as const,
    isLive: true,
  }));
}

/** Build StreamsIndia catalog items as RSS-shaped feed */
export function buildPlatformFeedItems(
  category: RssFeedConfig,
  limit = 12
): RssVideoItem[] {
  const live = buildLiveStreamItems(category);
  const remaining = Math.max(0, limit - live.length);
  const snos = category.platformSnos.slice(0, remaining);
  const catalog = snos.map((sno, i) => {
    const title =
      category.platformTitles?.[i] ||
      `${PLATFORM_RSS_CONFIG.brand} · ${category.title} #${i + 1}`;
    const video = getVideo(sno);
    return {
      id: `si-${category.id}-${sno}`,
      title,
      link: category.path,
      thumbnail: `/potrait_new_desicontent/${sno}.png`,
      pubDate: new Date().toISOString(),
      author: category.channelName,
      embedUrl: video || '',
      provider: 'platform' as const,
      platformSno: sno,
      isLive: false,
    };
  });

  return category.preferLive ? [...live, ...catalog] : [...catalog, ...live];
}

export function youtubeRssUrl(channelId: string): string {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
}

export function youtubeEmbedUrl(videoId: string, autoplay = true): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    iv_load_policy: '3',
    controls: '1',
    fs: '1',
    disablekb: '0',
    enablejsapi: '1',
    autoplay: autoplay ? '1' : '0',
    mute: autoplay ? '1' : '0',
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

export function youtubeLiveEmbedUrl(channelId: string): string {
  const params = new URLSearchParams({
    channel: channelId,
    autoplay: '1',
    mute: '1',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    iv_load_policy: '3',
    fs: '1',
  });
  return `https://www.youtube.com/embed/live_stream?${params.toString()}`;
}

export function extractYoutubeId(linkOrGuid: string): string | null {
  const guid = linkOrGuid.match(/yt:video:([\w-]{11})/);
  if (guid) return guid[1];
  const watch = linkOrGuid.match(/[?&]v=([\w-]{11})/);
  if (watch) return watch[1];
  const short = linkOrGuid.match(/youtu\.be\/([\w-]{11})/);
  if (short) return short[1];
  const embed = linkOrGuid.match(/embed\/([\w-]{11})/);
  if (embed) return embed[1];
  return null;
}

export function isYoutubeChannelId(id: string): boolean {
  return /^UC[\w-]{20,}$/.test(id);
}

export { PLATFORM_RSS_CONFIG };
