/**
 * Netlify — GET /.netlify/functions/article?url=https://…
 * Proxies article HTML for in-app iframe embedding.
 */

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
  out = out.replace(
    /if\s*\(\s*(?:top|parent|self)\s*[!=]==?\s*(?:self|top|parent|window)/gi,
    'if(false && top'
  );
  out = out.replace(
    /(?:top|parent)\.location(?:\.href)?\s*=/gi,
    'window.__chalKeepFrame='
  );

  const inject = [
    `<base href="${origin}/" target="_self">`,
    '<meta name="referrer" content="no-referrer">',
    `<style>
      html,body{margin:0;background:#0b1728!important;color:#e8eef7!important;scroll-behavior:smooth}
      img,video{max-width:100%!important;height:auto!important}
      a{color:#67e8f9!important}
      header,nav,[role="banner"],.site-header,.global-nav,.ad,.ads,[class*="cookie"],[id*="cookie"]{display:none!important}
      main,article,.article,.content,.post,.entry-content{max-width:48rem;margin:0 auto;padding:16px!important}
    </style>`,
    `<script>
      (function(){
        try {
          Object.defineProperty(window, 'top', { get: function(){ return window; } });
        } catch(e) {}
        document.addEventListener('click', function(ev){
          var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
          if(!a) return;
          var href = a.getAttribute('href') || '';
          if(!href || href.charAt(0)==='#' || href.indexOf('javascript:')===0) return;
          try {
            var abs = new URL(href, ${JSON.stringify(origin + '/')});
            if (abs.protocol === 'http:' || abs.protocol === 'https:') {
              ev.preventDefault();
              window.location.href = window.location.origin + '/api/article?url=' + encodeURIComponent(abs.toString());
            }
          } catch(e) {}
        }, true);
      })();
    </script>`,
  ].join('');

  if (/<head[^>]*>/i.test(out)) {
    out = out.replace(/<head[^>]*>/i, (m) => `${m}${inject}`);
  } else {
    out = `${inject}${out}`;
  }

  return out;
}

function htmlResponse(body, status = 200) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': status === 200 ? 'public, max-age=300' : 'no-store',
      'X-Frame-Options': 'SAMEORIGIN',
      'Content-Security-Policy': "frame-ancestors 'self'",
    },
    body,
  };
}

function errorPage(message, status = 400) {
  return htmlResponse(
    `<!doctype html><html><head><meta charset="utf-8"><title>Article</title>
<style>body{margin:0;font-family:system-ui,sans-serif;background:#0b1728;color:#fff;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px;text-align:center}
p{opacity:.75;max-width:28rem;line-height:1.5}</style></head>
<body><div><h1 style="font-size:1.1rem;margin:0 0 8px">Unable to load article</h1><p>${message}</p></div></body></html>`,
    status
  );
}

export async function handler(event) {
  try {
    const target = (event.queryStringParameters?.url || '').trim();
    if (!target) return errorPage('Missing url parameter');

    let parsed;
    try {
      parsed = new URL(target);
    } catch {
      return errorPage('Invalid article URL');
    }

    if (!/^https?:$/.test(parsed.protocol)) {
      return errorPage('Only http(s) article URLs are allowed');
    }
    if (isBlockedHost(parsed.hostname)) {
      return errorPage('That host is not allowed');
    }

    const upstream = await fetch(parsed.toString(), {
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; ChalChitra/1.0; +https://ChalChitra.com)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!upstream.ok) {
      return errorPage(`Publisher returned ${upstream.status}`, 502);
    }

    const ctype = (upstream.headers.get('content-type') || '').toLowerCase();
    if (ctype && !ctype.includes('text/html') && !ctype.includes('application/xhtml')) {
      return errorPage('URL is not an HTML article page', 415);
    }

    const buf = Buffer.from(await upstream.arrayBuffer());
    if (buf.byteLength > MAX_BYTES) {
      return errorPage('Article HTML is too large to embed', 413);
    }

    const html = rewriteHtml(buf.toString('utf8'), parsed.toString());
    return htmlResponse(html, 200);
  } catch (err) {
    return errorPage(err instanceof Error ? err.message : 'Article proxy error', 500);
  }
}
