/**
 * ChalChitra RSS types + helpers.
 * Customize feeds in: client/config/platformRss.config.ts
 */

import {
  PLATFORM_RSS_CONFIG,
  isRssAppFeedUrl,
  type LiveStreamItem,
  type PlatformCategoryRss,
} from '@/config/platformRss.config';
import { getVideo } from '@/sections/desiVideos';
import { landscapeThumb, portraitThumb } from '@/lib/catalog';

export { isRssAppFeedUrl };

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
  /** Short plain-text blurb from the RSS description */
  description?: string;
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
  /** Extra rss.app URLs merged into this panel */
  rssUrls?: string[];
  preferLive?: boolean;
  liveStreams: LiveStreamItem[];
  platformSnos: number[];
  platformTitles?: string[];
};

const META: Record<
  RssCategoryId,
  Pick<RssFeedConfig, 'title' | 'subtitle' | 'path' | 'accent' | 'badge' | 'sno'>
> = {
  live: {
    title: 'Bhojpuri',
    subtitle: 'Bhojpuri news, culture & entertainment',
    path: '/live',
    accent: 'from-red-600 to-rose-700',
    badge: 'Bhojpuri',
    sno: 51,
  },
  sports: {
    title: 'Sports',
    subtitle: 'Sports feed',
    path: '/sports',
    accent: 'from-amber-600 to-orange-500',
    badge: 'Sports',
    sno: 31,
  },
  movies: {
    title: 'TV | Hollywood Reporter',
    subtitle: 'TV & Hollywood industry news',
    path: '/movies',
    accent: 'from-red-700 to-amber-600',
    badge: 'TV',
    sno: 1,
  },
  reels: {
    title: 'Entertainment',
    subtitle: 'Celebuzz entertainment feed',
    path: '/reels',
    accent: 'from-rose-600 to-orange-500',
    badge: 'Celebuzz',
    sno: 71,
  },
  webseries: {
    title: 'Web Series',
    subtitle: 'Series feed',
    path: '/webseries',
    accent: 'from-orange-600 to-red-600',
    badge: 'Series',
    sno: 13,
  },
};

/** Home / nav order — single Bhojpuri section first, then the rest */
export const RSS_CATEGORY_ORDER: RssCategoryId[] = [
  'live',
  'movies',
  'reels',
  'sports',
  'webseries',
];

function buildCategory(id: RssCategoryId): RssFeedConfig {
  const cfg = PLATFORM_RSS_CONFIG.categories[id];
  const meta = META[id];
  const extra = (cfg.rssUrls || []).filter(Boolean);
  const urls = Array.from(
    new Set([cfg.rssUrl, ...extra].map((u) => u.trim()).filter(Boolean))
  );
  return {
    id,
    ...meta,
    enabled: cfg.enabled,
    source: 'rss',
    channelId: `rssapp-${id}`,
    channelName: cfg.channelName || PLATFORM_RSS_CONFIG.brand,
    rssUrl: urls[0] || cfg.rssUrl,
    rssUrls: urls,
    preferLive: Boolean(cfg.preferLive),
    liveStreams: cfg.liveStreams || [],
    platformSnos: cfg.platformSnos || [],
    platformTitles: cfg.platformTitles,
  };
}

/** Always rebuild from live config (avoids stale HMR / module cache) */
export function getAllRssCategories(): RssFeedConfig[] {
  return RSS_CATEGORY_ORDER.map(buildCategory);
}

export function getEnabledRssCategories(): RssFeedConfig[] {
  const seen = new Set<string>();
  return getAllRssCategories().filter((c) => {
    if (!c.enabled) return false;
    // Avoid showing the same rss.app URL twice on home
    const key = (c.rssUrl || '').trim().toLowerCase();
    if (key && seen.has(key)) return false;
    if (key) seen.add(key);
    return true;
  });
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
      landscapeThumb(category.sno),
    pubDate: new Date().toISOString(),
    author: category.channelName,
    embedUrl: stream.url,
    provider: 'live' as const,
    isLive: true,
  }));
}

/** Build ChalChitra catalog items as RSS-shaped feed */
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
      thumbnail: portraitThumb(sno),
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
