/**
 * Vercel Edge — GET /api/article?url=https://…
 * Proxies article HTML so it can load in an in-app iframe
 * (bypasses frame-ancestors / X-Frame-Options on publisher sites).
 */

export const config = {
  runtime: 'edge',
};

const MAX_BYTES = 1_800_000;

function isBlockedHost(hostname) {
  const h = String(hostname || '').toLowerCase().replace(/^\[|\]$/g, '');
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

function errorHtml(message, status = 400) {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><title>Article</title>
<style>body{margin:0;font-family:system-ui,sans-serif;background:#0b1728;color:#fff;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px;text-align:center}
p{opacity:.75;max-width:28rem;line-height:1.5}</style></head>
<body><div><h1 style="font-size:1.1rem;margin:0 0 8px">Unable to load article</h1><p>${message}</p></div></body></html>`,
    {
      status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    }
  );
}

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });
  }

  if (request.method !== 'GET') {
    return errorHtml('Method not allowed', 405);
  }

  try {
    const { searchParams } = new URL(request.url);
    const target = (searchParams.get('url') || '').trim();
    if (!target) return errorHtml('Missing url parameter');

    let parsed;
    try {
      parsed = new URL(target);
    } catch {
      return errorHtml('Invalid article URL');
    }

    if (!/^https?:$/.test(parsed.protocol)) {
      return errorHtml('Only http(s) article URLs are allowed');
    }
    if (isBlockedHost(parsed.hostname)) {
      return errorHtml('That host is not allowed');
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
      return errorHtml(`Publisher returned ${upstream.status}`, 502);
    }

    const ctype = (upstream.headers.get('content-type') || '').toLowerCase();
    if (ctype && !ctype.includes('text/html') && !ctype.includes('application/xhtml')) {
      return errorHtml('URL is not an HTML article page', 415);
    }

    const buf = await upstream.arrayBuffer();
    if (buf.byteLength > MAX_BYTES) {
      return errorHtml('Article HTML is too large to embed', 413);
    }

    const html = rewriteHtml(new TextDecoder('utf-8').decode(buf), parsed.toString());

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        'X-Frame-Options': 'SAMEORIGIN',
        'Content-Security-Policy': "frame-ancestors 'self'",
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return errorHtml(
      err instanceof Error ? err.message : 'Article proxy error',
      500
    );
  }
}
