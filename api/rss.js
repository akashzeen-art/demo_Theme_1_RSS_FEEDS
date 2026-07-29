/**
 * Vercel Edge Function — GET /api/rss?channelId=UC… | feedUrl=…
 * Fixes RSS on Vercel (Netlify functions are not used there).
 */

export const config = {
  runtime: 'edge',
};

function decodeXml(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function isImageUrl(url) {
  if (!url) return false;
  const clean = String(url).split('#')[0].split('?')[0];
  return /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(clean);
}

function isVideoUrl(url) {
  if (!url) return false;
  return (
    /\.m3u8(\?|$)/i.test(url) ||
    /\.(mp4|webm)(\?|$)/i.test(url) ||
    /youtube\.com\/(watch|embed|shorts)/i.test(url) ||
    /youtu\.be\//i.test(url)
  );
}

function extractThumb(chunk, enclosure) {
  const mediaContent =
    (chunk.match(/<media:content[^>]*url="([^"]+)"[^>]*medium="image"[^>]*/i) || [])[1] ||
    (chunk.match(/<media:content[^>]*medium="image"[^>]*url="([^"]+)"/i) || [])[1] ||
    (chunk.match(/<media:content[^>]*url="([^"]+)"/i) || [])[1] ||
    '';
  const mediaThumb =
    (chunk.match(/<media:thumbnail[^>]*url="([^"]+)"/i) || [])[1] ||
    (chunk.match(/<itunes:image[^>]*href="([^"]+)"/i) || [])[1] ||
    '';
  const desc =
    (chunk.match(/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) || [])[1] ||
    (chunk.match(/<content:encoded[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/i) || [])[1] ||
    (chunk.match(/<description[^>]*>([\s\S]*?)<\/description>/i) || [])[1] ||
    '';
  const descImg =
    (desc.match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] ||
    '';
  const candidates = [mediaThumb, mediaContent, enclosure, descImg]
    .map((u) => decodeXml(String(u || '').trim()))
    .filter(Boolean);
  for (const u of candidates) {
    if (isImageUrl(u)) return u;
  }
  return candidates[0] || '/logo.png';
}

function parseYoutubeAtom(xml, limit = 12) {
  const entries = xml.split('<entry>').slice(1);
  const items = [];

  for (const chunk of entries) {
    const id =
      (chunk.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/) || [])[1] ||
      (chunk.match(/[?&]v=([\w-]{11})/) || [])[1];
    if (!id) continue;

    const titleRaw =
      (chunk.match(/<media:title[^>]*>([^<]*)<\/media:title>/) || [])[1] ||
      (chunk.match(/<title>([^<]*)<\/title>/) || [])[1] ||
      'Untitled';

    const pubDate =
      (chunk.match(/<published>([^<]*)<\/published>/) || [])[1] ||
      (chunk.match(/<updated>([^<]*)<\/updated>/) || [])[1] ||
      '';
    const author = (chunk.match(/<name>([^<]*)<\/name>/) || [])[1] || '';
    const thumb =
      (chunk.match(/<media:thumbnail[^>]*url="([^"]+)"/) || [])[1] ||
      `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    items.push({
      id,
      title: decodeXml(titleRaw.trim()),
      link: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: thumb,
      pubDate,
      author: decodeXml(author),
      embedUrl: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&fs=1&autoplay=1&mute=1`,
    });

    if (items.length >= limit) break;
  }

  return items;
}

function parseGenericRss(xml, limit = 12) {
  const yt = parseYoutubeAtom(xml, limit);
  if (yt.length) return yt;

  const items = [];
  const chunks = xml.includes('<item>')
    ? xml.split('<item>').slice(1)
    : xml.split('<entry>').slice(1);

  for (const chunk of chunks) {
    const titleRaw =
      (chunk.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>/s) || [])[1] ||
      (chunk.match(/<title[^>]*>([^<]*)<\/title>/) || [])[1] ||
      'Untitled';
    const link =
      (chunk.match(/<link[^>]*href="([^"]+)"/) || [])[1] ||
      (chunk.match(/<link>([^<]*)<\/link>/) || [])[1] ||
      (chunk.match(/<guid[^>]*>([^<]*)<\/guid>/) || [])[1] ||
      '';
    const enclosureRaw =
      (chunk.match(/<enclosure[^>]*url="([^"]+)"/) || [])[1] ||
      (chunk.match(/<media:content[^>]*url="([^"]+)"/) || [])[1] ||
      '';
    const enclosure = decodeXml(enclosureRaw.trim());
    const articleLink = decodeXml(String(link || '').trim());
    const thumb = extractThumb(chunk, enclosure);
    const pubDate =
      (chunk.match(/<pubDate>([^<]*)<\/pubDate>/) || [])[1] ||
      (chunk.match(/<published>([^<]*)<\/published>/) || [])[1] ||
      '';
    const author =
      (chunk.match(/<author>([^<]*)<\/author>/) || [])[1] ||
      (chunk.match(/<dc:creator[^>]*>([^<]*)<\/dc:creator>/) || [])[1] ||
      'StreamsIndia';

    const ytId =
      (articleLink.match(/[?&]v=([\w-]{11})/) || [])[1] ||
      (enclosure.match(/[?&]v=([\w-]{11})/) || [])[1];

    if (ytId) {
      items.push({
        id: ytId,
        title: decodeXml(titleRaw.trim()),
        link: `https://www.youtube.com/watch?v=${ytId}`,
        thumbnail: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
        pubDate,
        author: decodeXml(author),
        embedUrl: `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&fs=1&autoplay=1&mute=1`,
      });
    } else {
      if (!articleLink && !enclosure) continue;
      const playable = isVideoUrl(enclosure) && !isImageUrl(enclosure);
      const media = playable ? enclosure : articleLink || enclosure;
      if (!media) continue;
      const live =
        /\.m3u8(\?|$)/i.test(media) ||
        /isLive="true"/i.test(chunk) ||
        /application\/x-mpegURL/i.test(chunk);
      items.push({
        id: `rss-${items.length}-${decodeXml(titleRaw).slice(0, 20).replace(/\W+/g, '-')}`,
        title: decodeXml(titleRaw.trim()),
        link: articleLink || media,
        thumbnail: thumb,
        pubDate,
        author: decodeXml(author),
        embedUrl: media,
        provider: live ? 'live' : 'rss',
        isLive: live,
      });
    }

    if (items.length >= limit) break;
  }

  return items;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=60',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'GET') {
    return json({ status: 'error', message: 'Method not allowed' }, 405);
  }

  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId') || '';
    const feedUrlParam = searchParams.get('feedUrl') || '';
    const limit = Math.min(Number(searchParams.get('limit') || 12), 20);

    let feedUrl = '';
    if (feedUrlParam) {
      try {
        const parsed = new URL(feedUrlParam);
        if (!/^https?:$/.test(parsed.protocol)) throw new Error('bad protocol');
        const host = parsed.hostname.replace(/^www\./, '');
        // Live Feeds are rss.app only
        if (host !== 'rss.app') {
          return json(
            { status: 'error', message: 'Only rss.app feed URLs are allowed' },
            400
          );
        }
        feedUrl = parsed.toString();
      } catch (e) {
        if (e && e.message === 'Only rss.app feed URLs are allowed') throw e;
        return json({ status: 'error', message: 'Invalid feedUrl' }, 400);
      }
    } else if (/^UC[\w-]{20,}$/.test(channelId)) {
      return json(
        { status: 'error', message: 'YouTube channel RSS disabled — use rss.app feedUrl only' },
        400
      );
    } else {
      return json({ status: 'error', message: 'feedUrl (rss.app) is required' }, 400);
    }

    const upstream = await fetch(feedUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; StreamsIndia/1.0; +https://streamsindia.com)',
        Accept:
          'application/atom+xml,application/rss+xml,application/xml,text/xml,*/*',
      },
    });

    if (!upstream.ok) {
      return json(
        {
          status: 'error',
          message: `Upstream RSS failed (${upstream.status})`,
        },
        502
      );
    }

    const xml = await upstream.text();
    const items = parseGenericRss(xml, limit);

    return json({ status: 'ok', channelId, feedUrl, items });
  } catch (err) {
    return json(
      {
        status: 'error',
        message: err instanceof Error ? err.message : 'RSS proxy error',
      },
      500
    );
  }
}
