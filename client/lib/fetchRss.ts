/**
 * ChalChitra feed loader — platform catalog + liveStreams + MRSS/RSS.
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

/** True only when feed provided a usable remote image (not site logo fallback) */
function hasRealThumbnail(url: string | undefined | null) {
  const u = String(url || '').trim();
  if (!u) return false;
  if (u === '/logo.png' || /\/logo\.png$/i.test(u)) return false;
  if (/^\/?(logo|placeholder|default)(\.|$)/i.test(u)) return false;
  if (/^data:image\//i.test(u)) return true;
  return /^https?:\/\//i.test(u);
}

function withThumbnailsOnly(items: RssVideoItem[]) {
  return items.filter((item) => hasRealThumbnail(item.thumbnail));
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

/** Read tag value whether plain text or CDATA */
function xmlTagText(chunk: string, tag: string) {
  const cdata = chunk.match(
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i')
  )?.[1];
  if (cdata != null) return decodeXml(cdata.trim());
  const plain = chunk.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, 'i'))?.[1];
  return plain != null ? decodeXml(plain.trim()) : '';
}

function stripHtmlToText(html: string) {
  return decodeXml(String(html || ''))
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<img[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractDescription(chunk: string) {
  const raw =
    chunk.match(/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i)?.[1] ||
    chunk.match(/<content:encoded[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/i)?.[1] ||
    chunk.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ||
    chunk.match(/<summary[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/summary>/i)?.[1] ||
    chunk.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)?.[1] ||
    '';
  return stripHtmlToText(raw).slice(0, 280);
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
    if (isImageUrl(u) || /^https?:\/\//i.test(u)) {
      // Prefer clear image URLs; skip obvious non-image enclosures
      if (isImageUrl(u) || !isPlayableMedia(u)) return u;
    }
  }
  return '';
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
    if (isImageUrl(enclosure) && !hasRealThumbnail(thumb)) {
      thumb = enclosure;
    }

    const ytId =
      (typeof x.id === 'string' && /^[\w-]{11}$/.test(x.id) ? x.id : null) ||
      link.match(/[?&]v=([\w-]{11})(?:&|$)/)?.[1] ||
      enclosure.match(/(?:youtube\.com\/(?:embed|shorts)\/|youtu\.be\/)([\w-]{11})/)?.[1] ||
      null;

    if (ytId) {
      const ytThumb =
        (hasRealThumbnail(thumb) ? thumb : '') ||
        `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
      items.push({
        id: ytId,
        title,
        link: link || `https://www.youtube.com/watch?v=${ytId}`,
        thumbnail: ytThumb,
        pubDate: String(x.pubDate || ''),
        author: String(x.author || fallbackAuthor),
        description: String(x.description || '').trim() || undefined,
        embedUrl: youtubeEmbedUrl(ytId, true),
        provider: 'youtube',
        isLive: false,
      });
      continue;
    }

    // Skip articles with no usable thumbnail
    if (!hasRealThumbnail(thumb)) continue;

    const playable = isPlayableMedia(enclosure);
    // Prefer article link for news items; never treat an image URL as embed
    const media = playable
      ? enclosure
      : link || (isImageUrl(enclosure) ? '' : enclosure);
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
      description: String(x.description || '').trim() || undefined,
      embedUrl: media,
      provider: live ? 'live' : 'rss',
      isLive: live,
    });
  }

  return withThumbnailsOnly(items);
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
    // Prefer true media enclosures; media:content images are handled as thumbs
    const enclosureRaw =
      chunk.match(/<enclosure[^>]*url="([^"]+)"/)?.[1] ||
      chunk.match(
        /<media:content[^>]*(?:medium="video"|type="video\/[^"]+")[^>]*url="([^"]+)"/i
      )?.[1] ||
      chunk.match(
        /<media:content[^>]*url="([^"]+)"[^>]*(?:medium="video"|type="video\/[^"]+")/i
      )?.[1] ||
      '';
    const enclosure = decodeXml(enclosureRaw.trim());
    const articleLink = decodeXml(link.trim());
    const thumb = extractThumbFromChunk(chunk, enclosure);
    const pubDate =
      chunk.match(/<pubDate>([^<]*)<\/pubDate>/)?.[1] ||
      chunk.match(/<published>([^<]*)<\/published>/)?.[1] ||
      '';
    const author =
      xmlTagText(chunk, 'dc:creator') ||
      xmlTagText(chunk, 'author') ||
      xmlTagText(chunk, 'name') ||
      fallbackAuthor;
    const description = extractDescription(chunk);
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
      author,
      description,
      isLive: mediaLive,
    });

    if (raw.length >= limit * 2) break;
  }

  return withThumbnailsOnly(normalizeItems(raw, fallbackAuthor)).slice(0, limit);
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

  const res = await fetch(`/api/rss?${q.toString()}`, {
    headers: { Accept: 'application/json' },
  });
  const ctype = (res.headers.get('content-type') || '').toLowerCase();
  // SPA fallback often returns index.html with 200 — treat as API miss
  if (!res.ok || ctype.includes('text/html')) {
    throw new Error(
      `Local RSS API failed (${res.status}${ctype.includes('text/html') ? ', got HTML' : ''})`
    );
  }
  const data = (await res.json()) as ApiResponse;
  if (data.status !== 'ok' || !Array.isArray(data.items) || !data.items.length) {
    throw new Error(data.message || 'Empty RSS response');
  }
  return normalizeItems(
    data.items as Array<Partial<RssVideoItem> & Record<string, unknown>>,
    params.author
  ).slice(0, params.limit);
}

async function fetchViaRss2Json(feedUrl: string, limit: number, author: string) {
  // Do NOT pass `count` — rss2json free tier rejects it without an API key
  const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`rss2json failed (${res.status})`);
  const data = await res.json();
  if (data.status !== 'ok' || !Array.isArray(data.items)) {
    throw new Error(data.message || 'Invalid rss2json response');
  }

  const raw = data.items.map((item: Record<string, unknown>) => {
    const desc = String(item.description || '');
    const descImg = desc.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] || '';
    return {
      id: String(item.guid || item.link || ''),
      title: String(item.title || 'Untitled'),
      link: String(item.link || ''),
      embedUrl: String(
        (item.enclosure as { link?: string } | undefined)?.link ||
          (item.enclosure as { url?: string } | undefined)?.url ||
          item.link ||
          ''
      ),
      thumbnail: String(
        item.thumbnail ||
          (item.enclosure as { thumbnail?: string } | undefined)?.thumbnail ||
          descImg ||
          ''
      ),
      pubDate: String(item.pubDate || ''),
      author: String(item.author || author),
      description: stripHtmlToText(desc).slice(0, 280) || undefined,
    };
  });

  const items = normalizeItems(raw, author);
  if (!items.length) throw new Error('No videos parsed from feed');
  return items.slice(0, limit);
}

async function fetchViaCorsXml(feedUrl: string, limit: number, author: string) {
  const proxies = [
    `https://corsproxy.io/?${encodeURIComponent(feedUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`,
  ];
  let lastError = 'CORS XML proxy failed';
  for (const proxy of proxies) {
    try {
      const res = await fetch(proxy);
      if (!res.ok) {
        lastError = `proxy ${res.status}`;
        continue;
      }
      const xml = await res.text();
      if (!xml.includes('<item>') && !xml.includes('<entry>')) {
        lastError = 'proxy returned non-RSS';
        continue;
      }
      const items = parseRssXml(xml, limit, author);
      if (items.length) return items;
      lastError = 'empty parse';
    } catch (e) {
      lastError = e instanceof Error ? e.message : 'proxy error';
    }
  }
  throw new Error(lastError);
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

      try {
        const items = await fetchViaCorsXml(absolute, limit, opts.author);
        cache.set(cacheKey, { at: Date.now(), items });
        return items;
      } catch (e) {
        errors.push(e instanceof Error ? e.message : 'cors xml failed');
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
 * Merges category.rssUrls (or rssUrl) into one item list.
 */
export async function fetchCategoryRss(
  categoryId: string,
  limit = PLATFORM_RSS_CONFIG.defaultLimit
): Promise<RssVideoItem[]> {
  const category = getRssCategory(categoryId);
  if (!category || !category.enabled) {
    throw new Error('Category feed disabled or missing');
  }

  const feedUrls = Array.from(
    new Set(
      (category.rssUrls?.length ? category.rssUrls : [category.rssUrl || ''])
        .map((u) => u.trim())
        .filter((u) => isRssAppFeedUrl(u))
    )
  );

  if (!feedUrls.length) {
    throw new Error(
      `Paste a valid rss.app feed URL for “${category.title}” in platformRss.config.ts (https://rss.app/feeds/….xml)`
    );
  }

  // Over-fetch so filtering out missing thumbs still fills the panel
  const perFeed = Math.max(limit * 2, Math.ceil((limit * 2) / feedUrls.length) + 6);
  const results = await Promise.allSettled(
    feedUrls.map((feedUrl) =>
      loadRemoteFeed(
        `rssapp:${feedUrl}`,
        { feedUrl, author: category.channelName },
        perFeed
      )
    )
  );

  const merged: RssVideoItem[] = [];
  const errors: string[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value.length) {
      merged.push(...r.value);
    } else if (r.status === 'rejected') {
      errors.push(r.reason instanceof Error ? r.reason.message : 'feed failed');
    }
  }

  // Newest first when dates exist
  merged.sort((a, b) => {
    const da = Date.parse(a.pubDate || '') || 0;
    const db = Date.parse(b.pubDate || '') || 0;
    return db - da;
  });

  const unique = withThumbnailsOnly(dedupeByEmbed(merged)).slice(0, limit);
  if (unique.length) return unique;

  throw new Error(
    errors[0] ||
      `${category.title} rss.app feed unavailable — check the feed URL in platformRss.config.ts`
  );
}

export type { RssFeedConfig };
