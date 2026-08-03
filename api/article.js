/**
 * Vercel Serverless Function (Node) — GET /api/article?url=…
 * Proxies article HTML for in-app iframe embedding.
 */

const MAX_BYTES = 1_800_000;

function isBlockedHost(hostname) {
  const h = String(hostname || '')
    .toLowerCase()
    .replace(/^\[|\]$/g, '');
  if (!h || h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal')) {
    return true;
  }
  if (h === '::1' || h === '0.0.0.0') return true;
  if (/^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(h)) return true;
  if (/^169\.254\./.test(h) || /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(h)) {
    return true;
  }
  return false;
}

function rewriteHtml(html, sourceUrl) {
  const origin = new URL(sourceUrl).origin;
  let out = String(html || '');

  out = out.replace(
    /<meta[^>]+http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi,
    ''
  );
  out = out.replace(
    /<meta[^>]+http-equiv=["']?X-Frame-Options["']?[^>]*>/gi,
    ''
  );

  const inject = [
    `<base href="${origin}/">`,
    '<meta name="referrer" content="no-referrer">',
    '<style>html,body{scroll-behavior:smooth}</style>',
  ].join('');

  if (/<head[^>]*>/i.test(out)) {
    out = out.replace(/<head[^>]*>/i, (m) => `${m}${inject}`);
  } else {
    out = `${inject}${out}`;
  }

  return out;
}

function errorPage(message) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Article</title>
<style>body{margin:0;font-family:system-ui,sans-serif;background:#0b1728;color:#fff;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px;text-align:center}
p{opacity:.75;max-width:28rem;line-height:1.5}</style></head>
<body><div><h1 style="font-size:1.1rem;margin:0 0 8px">Unable to load article</h1><p>${message}</p></div></body></html>`;
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
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(405).send(errorPage('Method not allowed'));
  }

  try {
    const target = String(req.query?.url || '').trim();
    if (!target) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(400).send(errorPage('Missing url parameter'));
    }

    let parsed;
    try {
      parsed = new URL(target);
    } catch {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(400).send(errorPage('Invalid article URL'));
    }

    if (!/^https?:$/.test(parsed.protocol) || isBlockedHost(parsed.hostname)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(400).send(errorPage('That article URL is not allowed'));
    }

    const upstream = await fetch(parsed.toString(), {
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; StreamsIndia/1.0; +https://streamsindia.com)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!upstream.ok) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(502).send(errorPage(`Publisher returned ${upstream.status}`));
    }

    const ctype = (upstream.headers.get('content-type') || '').toLowerCase();
    if (ctype && !ctype.includes('text/html') && !ctype.includes('application/xhtml')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(415).send(errorPage('URL is not an HTML article page'));
    }

    const buf = Buffer.from(await upstream.arrayBuffer());
    if (buf.byteLength > MAX_BYTES) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(413).send(errorPage('Article HTML is too large to embed'));
    }

    const html = rewriteHtml(buf.toString('utf8'), parsed.toString());
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
    return res.status(200).send(html);
  } catch (err) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res
      .status(500)
      .send(errorPage(err instanceof Error ? err.message : 'Article proxy error'));
  }
}
