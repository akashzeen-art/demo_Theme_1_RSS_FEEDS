/**
 * StreamsIndia feed loader — platform catalog + liveStreams + MRSS/RSS.
 * Live HLS (.m3u8) items are marked isLive and play brand-free via StreamPlayer.
 */

import {
  buildLiveStreamItems,
  buildPlatformFeedItems,
  getRssCategory,
  isRssAppFeedUrl,
  isYoutubeChannelId,
  youtubeEmbedUrl,
  youtubeRssUrl,
  type RssFeedConfig,
  type RssVideoItem,
  PLATFORM_RSS_CONFIG,
} from '@/lib/rssFeeds';

type ApiResponse = {
  status: string;
  items?: Array<Partial<RssVideoItem> & { id?: string; title?: string; embedUrl?: string }>;
  message?: string;
};

const cache = new Map<string, { at: number; items: RssVideoItem[] }>();
const CACHE_MS = 2 * 60 * 1000;
const inflight = new Map<string, Promise<RssVideoItem[]>>();

function isLiveMedia(url: string) {
  return /\.m3u8(\?|$)/i.test(url) || /islive=true/i.test(url);
}

function isImageUrl(url: string) {
  if (!url) return false;
  const clean = url.split('#')[0].split('?')[0];
  return /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(clean);
}

function isPlayableMedia(url: string) {
  if (!url || isImageUrl(url)) return false;
  return (
    isLiveMedia(url) ||
    /\.(mp4|webm)(\?|$)/i.test(url) ||
    /youtube\.com\/(watch|embed|shorts)/i.test(url) ||
    /youtu\.be\//i.test(url)
  );
}

function decodeXml(s: string) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractThumbFromChunk(chunk: string, enclosure: string) {
  const mediaContent =
    chunk.match(/<media:content[^>]*url="([^"]+)"[^>]*medium="image"[^>]*/i)?.[1] ||
    chunk.match(/<media:content[^>]*medium="image"[^>]*url="([^"]+)"/i)?.[1] ||
    chunk.match(/<media:content[^>]*url="([^"]+)"/i)?.[1] ||
    '';
  const mediaThumb =
    chunk.match(/<media:thumbnail[^>]*url="([^"]+)"/i)?.[1] ||
    chunk.match(/<itunes:image[^>]*href="([^"]+)"/i)?.[1] ||
    '';
  const desc =
    chunk.match(/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i)?.[1] ||
    chunk.match(/<content:encoded[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/i)?.[1] ||
    chunk.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ||
    '';
  const descImg = desc.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] || '';
  const candidates = [mediaThumb, mediaContent, enclosure, descImg]
    .map((u) => decodeXml(String(u || '').trim()))
    .filter(Boolean);
  for (const u of candidates) {
    if (isImageUrl(u)) return u;
  }
  return candidates[0] || '/logo.png';
}

/** Normalize any API / parsed item into RssVideoItem */
function normalizeItems(
  raw: Array<Partial<RssVideoItem> & Record<string, unknown>>,
  fallbackAuthor: string
): RssVideoItem[] {
  const items: RssVideoItem[] = [];

  for (const x of raw) {
    const title = String(x.title || 'Untitled');
    const link = decodeXml(String(x.link || '').trim());
    const enclosure = decodeXml(
      String((x as { enclosure?: string }).enclosure || x.embedUrl || '').trim()
    );
    let thumb = decodeXml(String(x.thumbnail || '').trim());
    if (isImageUrl(enclosure) && (!thumb || thumb === '/logo.png')) {
      thumb = enclosure;
    }
    if (!thumb) thumb = '/logo.png';

    const ytId =
      (typeof x.id === 'string' && /^[\w-]{11}$/.test(x.id) ? x.id : null) ||
      link.match(/[?&]v=([\w-]{11})(?:&|$)/)?.[1] ||
      enclosure.match(/(?:youtube\.com\/(?:embed|shorts)\/|youtu\.be\/)([\w-]{11})/)?.[1] ||
      null;

    if (ytId) {
      items.push({
        id: ytId,
        title,
        link: link || `https://www.youtube.com/watch?v=${ytId}`,
        thumbnail:
          (thumb && thumb !== '/logo.png' ? thumb : '') ||
          `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
        pubDate: String(x.pubDate || ''),
        author: String(x.author || fallbackAuthor),
        embedUrl: youtubeEmbedUrl(ytId, true),
        provider: 'youtube',
        isLive: false,
      });
      continue;
    }

    const playable = isPlayableMedia(enclosure);
    const media = playable ? enclosure : link || enclosure;
    if (!media && !x.id) continue;

    const live = Boolean(x.isLive) || isLiveMedia(media);
    items.push({
      id: String(
        x.id ||
          `rss-${items.length}-${title.slice(0, 24).replace(/\W+/g, '-')}`
      ),
      title,
      link: link || media,
      thumbnail: thumb,
      pubDate: String(x.pubDate || ''),
      author: String(x.author || fallbackAuthor),
      embedUrl: media,
      provider: live ? 'live' : 'rss',
      isLive: live,
    });
  }

  return items;
}

/** Parse MRSS / RSS / Atom XML in the browser (same-origin feeds) */
export function parseRssXml(
  xml: string,
  limit = 12,
  fallbackAuthor = PLATFORM_RSS_CONFIG.brand
): RssVideoItem[] {
  const chunks = xml.includes('<item>')
    ? xml.split('<item>').slice(1)
    : xml.split('<entry>').slice(1);

  const raw: Array<Partial<RssVideoItem> & Record<string, unknown>> = [];

  for (const chunk of chunks) {
    const titleRaw =
      chunk.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>/s)?.[1] ||
      chunk.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ||
      'Untitled';
    const link =
      chunk.match(/<link[^>]*href="([^"]+)"/)?.[1] ||
      chunk.match(/<link>([^<]*)<\/link>/)?.[1] ||
      chunk.match(/<guid[^>]*>([^<]*)<\/guid>/)?.[1] ||
      '';
    const enclosureRaw =
      chunk.match(/<enclosure[^>]*url="([^"]+)"/)?.[1] ||
      chunk.match(/<media:content[^>]*url="([^"]+)"/)?.[1] ||
      '';
    const enclosure = decodeXml(enclosureRaw.trim());
    const articleLink = decodeXml(link.trim());
    const thumb = extractThumbFromChunk(chunk, enclosure);
    const pubDate =
      chunk.match(/<pubDate>([^<]*)<\/pubDate>/)?.[1] ||
      chunk.match(/<published>([^<]*)<\/published>/)?.[1] ||
      '';
    const author =
      chunk.match(/<author>([^<]*)<\/author>/)?.[1] ||
      chunk.match(/<dc:creator[^>]*>([^<]*)<\/dc:creator>/)?.[1] ||
      fallbackAuthor;
    const guid =
      chunk.match(/<guid[^>]*>([^<]*)<\/guid>/)?.[1] ||
      chunk.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1] ||
      '';
    const playable = isPlayableMedia(enclosure);
    const mediaLive =
      /isLive="true"/i.test(chunk) ||
      /type="application\/x-mpegURL"/i.test(chunk) ||
      isLiveMedia(enclosure);

    raw.push({
      id: guid || undefined,
      title: decodeXml(titleRaw.trim()),
      link: articleLink,
      embedUrl: playable ? enclosure : articleLink || enclosure,
      thumbnail: thumb,
      pubDate,
      author: decodeXml(author),
      isLive: mediaLive,
    });

    if (raw.length >= limit) break;
  }

  return normalizeItems(raw, fallbackAuthor).slice(0, limit);
}

async function fetchSameOriginXml(feedPath: string, limit: number, author: string) {
  const res = await fetch(feedPath, {
    headers: { Accept: 'application/rss+xml,application/xml,text/xml,*/*' },
  });
  if (!res.ok) throw new Error(`Local feed failed (${res.status})`);
  const xml = await res.text();
  const items = parseRssXml(xml, limit, author);
  if (!items.length) throw new Error('Empty local RSS feed');
  return items;
}

async function fetchViaLocalApi(params: {
  channelId?: string;
  feedUrl?: string;
  limit: number;
  author: string;
}): Promise<RssVideoItem[]> {
  const q = new URLSearchParams({ limit: String(params.limit) });
  if (params.channelId) q.set('channelId', params.channelId);
  if (params.feedUrl) q.set('feedUrl', params.feedUrl);

  const res = await fetch(`/api/rss?${q.toString()}`);
  if (!res.ok) throw new Error(`Local RSS API failed (${res.status})`);
  const data = (await res.json()) as ApiResponse;
  if (data.status !== 'ok' || !Array.isArray(data.items) || !data.items.length) {
    throw new Error(data.message || 'Empty RSS response');
  }
  return normalizeItems(data.items as Array<Partial<RssVideoItem> & Record<string, unknown>>, params.author).slice(
    0,
    params.limit
  );
}

async function fetchViaRss2Json(feedUrl: string, limit: number, author: string) {
  const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&count=${Math.max(limit, 10)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`rss2json failed (${res.status})`);
  const data = await res.json();
  if (data.status !== 'ok' || !Array.isArray(data.items)) {
    throw new Error(data.message || 'Invalid rss2json response');
  }

  const raw = data.items.map((item: Record<string, unknown>) => ({
    id: String(item.guid || ''),
    title: String(item.title || 'Untitled'),
    link: String(item.link || ''),
    embedUrl: String(
      (item.enclosure as { link?: string } | undefined)?.link ||
        (item.enclosure as { url?: string } | undefined)?.url ||
        ''
    ),
    thumbnail: String(
      item.thumbnail ||
        (item.enclosure as { thumbnail?: string } | undefined)?.thumbnail ||
        '/logo.png'
    ),
    pubDate: String(item.pubDate || ''),
    author: String(item.author || author),
  }));

  const items = normalizeItems(raw, author);
  if (!items.length) throw new Error('No videos parsed from feed');
  return items.slice(0, limit);
}

async function loadRemoteFeed(
  cacheKey: string,
  opts: { channelId?: string; feedUrl?: string; author: string },
  limit: number
): Promise<RssVideoItem[]> {
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_MS && cached.items.length) {
    return cached.items.slice(0, limit);
  }

  const existing = inflight.get(cacheKey);
  if (existing) return existing.then((items) => items.slice(0, limit));

  const job = (async () => {
    const errors: string[] = [];
    const feedUrl = opts.feedUrl || '';

    // Same-origin MRSS (e.g. /feeds/live.xml)
    if (feedUrl.startsWith('/')) {
      try {
        const items = await fetchSameOriginXml(feedUrl, limit, opts.author);
        cache.set(cacheKey, { at: Date.now(), items });
        return items;
      } catch (e) {
        errors.push(e instanceof Error ? e.message : 'local xml failed');
      }
    }

    // Absolute remote via Vite/Netlify proxy
    if (feedUrl.startsWith('http') || opts.channelId) {
      try {
        const items = await fetchViaLocalApi({
          channelId: opts.channelId,
          feedUrl: feedUrl.startsWith('http') ? feedUrl : undefined,
          limit,
          author: opts.author,
        });
        cache.set(cacheKey, { at: Date.now(), items });
        return items;
      } catch (e) {
        errors.push(e instanceof Error ? e.message : 'local api failed');
      }
    }

    const absolute =
      feedUrl.startsWith('http')
        ? feedUrl
        : opts.channelId && isYoutubeChannelId(opts.channelId)
          ? youtubeRssUrl(opts.channelId)
          : '';

    if (absolute) {
      try {
        const items = await fetchViaRss2Json(absolute, limit, opts.author);
        cache.set(cacheKey, { at: Date.now(), items });
        return items;
      } catch (e) {
        errors.push(e instanceof Error ? e.message : 'rss2json failed');
      }
    }

    throw new Error(errors.join(' · ') || 'RSS feed unavailable');
  })();

  inflight.set(cacheKey, job);
  try {
    return (await job).slice(0, limit);
  } finally {
    inflight.delete(cacheKey);
  }
}

function dedupeByEmbed(items: RssVideoItem[]): RssVideoItem[] {
  const seen = new Set<string>();
  const out: RssVideoItem[] = [];
  for (const item of items) {
    const key = item.embedUrl || item.id;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function mergeCategoryFeed(
  category: RssFeedConfig,
  remote: RssVideoItem[],
  limit: number
): RssVideoItem[] {
  const configuredLive = buildLiveStreamItems(category);
  const catalog = buildPlatformFeedItems(
    { ...category, liveStreams: [], preferLive: false },
    limit
  );

  // Prefer actual remote RSS when available
  if (remote.length) {
    const ordered = category.preferLive
      ? [...configuredLive, ...remote, ...catalog]
      : [...remote, ...configuredLive, ...catalog];
    return dedupeByEmbed(ordered).slice(0, limit);
  }

  const ordered = category.preferLive
    ? [...configuredLive, ...catalog]
    : [...catalog, ...configuredLive];

  return dedupeByEmbed(ordered).slice(0, limit);
}

/** @deprecated Prefer fetchCategoryRss(categoryId) */
export async function fetchChannelRss(
  channelId: string,
  limit = 12
): Promise<RssVideoItem[]> {
  if (!isYoutubeChannelId(channelId)) return [];
  try {
    return await loadRemoteFeed(
      `yt:${channelId}`,
      { channelId, author: PLATFORM_RSS_CONFIG.brand },
      limit
    );
  } catch {
    return [];
  }
}

/**
 * Primary loader — rss.app feeds ONLY.
 */
export async function fetchCategoryRss(
  categoryId: string,
  limit = PLATFORM_RSS_CONFIG.defaultLimit
): Promise<RssVideoItem[]> {
  const category = getRssCategory(categoryId);
  if (!category || !category.enabled) {
    throw new Error('Category feed disabled or missing');
  }

  if (!isRssAppFeedUrl(category.rssUrl)) {
    throw new Error(
      `Paste a valid rss.app feed URL for “${category.title}” in platformRss.config.ts (https://rss.app/feeds/….xml)`
    );
  }

  let remote: RssVideoItem[] = [];
  let remoteError: string | null = null;

  try {
    remote = await loadRemoteFeed(
      `rssapp:${category.rssUrl}`,
      { feedUrl: category.rssUrl!, author: category.channelName },
      limit
    );
  } catch (e) {
    remoteError = e instanceof Error ? e.message : 'rss.app feed failed';
    remote = [];
  }

  // Live Feed panels show rss.app items only (no YouTube channel / catalog fill)
  if (remote.length) {
    return dedupeByEmbed(remote).slice(0, limit);
  }

  throw new Error(
    remoteError ||
      `${category.title} rss.app feed unavailable — check the feed URL in platformRss.config.ts`
  );
}

export type { RssFeedConfig };
