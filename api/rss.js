/**
 * Vercel Serverless Function (Node) — GET /api/rss?feedUrl=…
 * Node runtime is more reliable with Vite SPA deploys than Edge.
 */

function decodeXml(s) {
  return String(s || '')
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
  const descImg = (desc.match(/<img[^>]+src=["']([^"']+)["']/i) || [])[1] || '';
  const candidates = [mediaThumb, mediaContent, enclosure, descImg]
    .map((u) => decodeXml(String(u || '').trim()))
    .filter(Boolean);
  for (const u of candidates) {
    if (isImageUrl(u)) return u;
  }
  // Keep http(s) image-like candidates (CDN URLs often lack extensions)
  for (const u of candidates) {
    if (/^https?:\/\//i.test(u) && !isVideoUrl(u)) return u;
  }
  return '';
}

function hasRealThumb(url) {
  const u = String(url || '').trim();
  if (!u) return false;
  if (u === '/logo.png' || /\/logo\.png$/i.test(u)) return false;
  return /^https?:\/\//i.test(u) || /^data:image\//i.test(u);
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
      (chunk.match(/<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) || [])[1] ||
      (chunk.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] ||
      'Untitled';
    const link =
      (chunk.match(/<link[^>]*href="([^"]+)"/i) || [])[1] ||
      (chunk.match(/<link>([^<]*)<\/link>/i) || [])[1] ||
      (chunk.match(/<guid[^>]*>([^<]*)<\/guid>/i) || [])[1] ||
      '';
    const enclosureRaw =
      (chunk.match(/<enclosure[^>]*url="([^"]+)"/i) || [])[1] ||
      (chunk.match(/<media:content[^>]*url="([^"]+)"/i) || [])[1] ||
      '';
    const enclosure = decodeXml(enclosureRaw.trim());
    const articleLink = decodeXml(String(link || '').trim());
    const thumb = extractThumb(chunk, enclosure);
    const pubDate =
      (chunk.match(/<pubDate>([^<]*)<\/pubDate>/i) || [])[1] ||
      (chunk.match(/<published>([^<]*)<\/published>/i) || [])[1] ||
      '';
    const author =
      (chunk.match(/<author>([^<]*)<\/author>/i) || [])[1] ||
      (chunk.match(/<dc:creator[^>]*>([^<]*)<\/dc:creator>/i) || [])[1] ||
      'ChalChitra';

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
      if (!hasRealThumb(thumb)) continue;
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

  return items.filter((item) => hasRealThumb(item.thumbnail));
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
    const channelId = String(req.query?.channelId || '');
    const feedUrlParam = String(req.query?.feedUrl || '');
    const limit = Math.min(Number(req.query?.limit || 12) || 12, 20);

    let feedUrl = '';
    if (feedUrlParam) {
      let parsed;
      try {
        parsed = new URL(feedUrlParam);
      } catch {
        return res.status(400).json({ status: 'error', message: 'Invalid feedUrl' });
      }
      if (!/^https?:$/.test(parsed.protocol)) {
        return res.status(400).json({ status: 'error', message: 'Invalid feedUrl protocol' });
      }
      const host = parsed.hostname.replace(/^www\./, '');
      if (host !== 'rss.app') {
        return res.status(400).json({
          status: 'error',
          message: 'Only rss.app feed URLs are allowed',
        });
      }
      feedUrl = parsed.toString();
    } else if (/^UC[\w-]{20,}$/.test(channelId)) {
      return res.status(400).json({
        status: 'error',
        message: 'YouTube channel RSS disabled — use rss.app feedUrl only',
      });
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'feedUrl (rss.app) is required',
      });
    }

    const upstream = await fetch(feedUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'application/atom+xml,application/rss+xml,application/xml,text/xml,*/*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });

    if (!upstream.ok) {
      return res.status(502).json({
        status: 'error',
        message: `Upstream RSS failed (${upstream.status})`,
      });
    }

    const xml = await upstream.text();
    if (!xml || (!xml.includes('<item>') && !xml.includes('<entry>'))) {
      return res.status(502).json({
        status: 'error',
        message: 'Upstream returned empty or invalid RSS',
      });
    }

    const items = parseGenericRss(xml, limit);
    if (!items.length) {
      return res.status(502).json({
        status: 'error',
        message: 'No items parsed from rss.app feed',
      });
    }

    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=60');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json({ status: 'ok', channelId, feedUrl, items });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: err instanceof Error ? err.message : 'RSS proxy error',
    });
  }
}
