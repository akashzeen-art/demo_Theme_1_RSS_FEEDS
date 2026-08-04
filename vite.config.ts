import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

type RssItem = {
  id: string;
  title: string;
  link: string;
  thumbnail: string;
  pubDate: string;
  author: string;
  description?: string;
  embedUrl: string;
  provider?: string;
  isLive?: boolean;
};

function decodeXml(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function xmlTagText(chunk: string, tag: string) {
  const cdata = chunk.match(
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i")
  )?.[1];
  if (cdata != null) return decodeXml(cdata.trim());
  const plain = chunk.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, "i"))?.[1];
  return plain != null ? decodeXml(plain.trim()) : "";
}

function stripHtmlToText(html: string) {
  return decodeXml(String(html || ""))
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<img[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractDescription(chunk: string) {
  const raw =
    chunk.match(/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i)?.[1] ||
    chunk.match(/<content:encoded[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/i)?.[1] ||
    chunk.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ||
    "";
  return stripHtmlToText(raw).slice(0, 280);
}

function isImageUrl(url: string) {
  if (!url) return false;
  const clean = String(url).split("#")[0].split("?")[0];
  return /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(clean);
}

function isVideoUrl(url: string) {
  if (!url) return false;
  return (
    /\.m3u8(\?|$)/i.test(url) ||
    /\.(mp4|webm)(\?|$)/i.test(url) ||
    /youtube\.com\/(watch|embed|shorts)/i.test(url) ||
    /youtu\.be\//i.test(url)
  );
}

function extractThumb(chunk: string, enclosure: string) {
  const mediaContent =
    chunk.match(/<media:content[^>]*url="([^"]+)"[^>]*medium="image"[^>]*/i)?.[1] ||
    chunk.match(/<media:content[^>]*medium="image"[^>]*url="([^"]+)"/i)?.[1] ||
    chunk.match(/<media:content[^>]*url="([^"]+)"/i)?.[1] ||
    "";
  const mediaThumb =
    chunk.match(/<media:thumbnail[^>]*url="([^"]+)"/i)?.[1] ||
    chunk.match(/<itunes:image[^>]*href="([^"]+)"/i)?.[1] ||
    "";
  const desc =
    chunk.match(/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i)?.[1] ||
    chunk.match(/<content:encoded[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/i)?.[1] ||
    chunk.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ||
    "";
  const descImg = desc.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] || "";
  const candidates = [mediaThumb, mediaContent, enclosure, descImg]
    .map((u) => decodeXml(String(u || "").trim()))
    .filter(Boolean);
  for (const u of candidates) {
    if (isImageUrl(u)) return u;
  }
  return candidates[0] || "/logo.png";
}

function parseYoutubeAtom(xml: string, limit = 12): RssItem[] {
  const entries = xml.split("<entry>").slice(1);
  const items: RssItem[] = [];

  for (const chunk of entries) {
    const id =
      chunk.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1] ||
      chunk.match(/[?&]v=([\w-]{11})/)?.[1];
    if (!id) continue;

    const titleRaw =
      chunk.match(/<media:title[^>]*>([^<]*)<\/media:title>/)?.[1] ||
      chunk.match(/<title>([^<]*)<\/title>/)?.[1] ||
      "Untitled";
    const title = decodeXml(titleRaw.trim());
    const pubDate =
      chunk.match(/<published>([^<]*)<\/published>/)?.[1] ||
      chunk.match(/<updated>([^<]*)<\/updated>/)?.[1] ||
      "";
    const author =
      chunk.match(/<name>([^<]*)<\/name>/)?.[1] ||
      chunk.match(/<author>\s*<name>([^<]*)<\/name>/)?.[1] ||
      "";
    const thumb =
      chunk.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1] ||
      `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    items.push({
      id,
      title,
      link: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: thumb,
      pubDate,
      author: decodeXml(author),
      embedUrl: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&fs=0&autoplay=1&mute=1`,
    });

    if (items.length >= limit) break;
  }

  return items;
}

/** Generic RSS 2.0 / Atom parser for custom platform feeds */
function parseGenericRss(xml: string, limit = 12): RssItem[] {
  const yt = parseYoutubeAtom(xml, limit);
  if (yt.length) return yt;

  const items: RssItem[] = [];
  const chunks = xml.includes("<item>")
    ? xml.split("<item>").slice(1)
    : xml.split("<entry>").slice(1);

  for (const chunk of chunks) {
    const titleRaw =
      chunk.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>/s)?.[1] ||
      chunk.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ||
      "Untitled";
    const link =
      chunk.match(/<link[^>]*href="([^"]+)"/)?.[1] ||
      chunk.match(/<link>([^<]*)<\/link>/)?.[1] ||
      chunk.match(/<guid[^>]*>([^<]*)<\/guid>/)?.[1] ||
      "";
    const enclosureRaw =
      chunk.match(/<enclosure[^>]*url="([^"]+)"/)?.[1] ||
      chunk.match(
        /<media:content[^>]*(?:medium="video"|type="video\/[^"]+")[^>]*url="([^"]+)"/i
      )?.[1] ||
      chunk.match(
        /<media:content[^>]*url="([^"]+)"[^>]*(?:medium="video"|type="video\/[^"]+")/i
      )?.[1] ||
      "";
    const enclosure = decodeXml(enclosureRaw.trim());
    const articleLink = decodeXml(String(link || "").trim());
    const thumb = extractThumb(chunk, enclosure);
    const pubDate =
      chunk.match(/<pubDate>([^<]*)<\/pubDate>/)?.[1] ||
      chunk.match(/<published>([^<]*)<\/published>/)?.[1] ||
      "";
    const author =
      xmlTagText(chunk, "dc:creator") ||
      xmlTagText(chunk, "author") ||
      "ChalChitra";
    const description = extractDescription(chunk);

    const ytId =
      articleLink.match(/[?&]v=([\w-]{11})/)?.[1] ||
      enclosure.match(/[?&]v=([\w-]{11})/)?.[1];

    if (ytId) {
      items.push({
        id: ytId,
        title: decodeXml(titleRaw.trim()),
        link: `https://www.youtube.com/watch?v=${ytId}`,
        thumbnail: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
        pubDate,
        author,
        description,
        embedUrl: `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&fs=0&autoplay=1&mute=1`,
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
        id: `rss-${items.length}-${decodeXml(titleRaw).slice(0, 20).replace(/\W+/g, "-")}`,
        title: decodeXml(titleRaw.trim()),
        link: articleLink || media,
        thumbnail: thumb,
        pubDate,
        author,
        description,
        embedUrl: media,
        provider: live ? "live" : "rss",
        isLive: live,
      });
    }

    if (items.length >= limit) break;
  }

  return items;
}

async function handleRssApi(
  reqUrl: string,
  res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b: string) => void }
) {
  try {
    const u = new URL(reqUrl, "http://localhost");
    const channelId = u.searchParams.get("channelId") || "";
    const feedUrlParam = u.searchParams.get("feedUrl") || "";
    const limit = Math.min(Number(u.searchParams.get("limit") || 12), 20);

    let feedUrl = "";
    if (feedUrlParam) {
      try {
        const parsed = new URL(feedUrlParam);
        if (!/^https?:$/.test(parsed.protocol)) throw new Error("bad protocol");
        const host = parsed.hostname.replace(/^www\./, "");
        if (host !== "rss.app") {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              status: "error",
              message: "Only rss.app feed URLs are allowed",
            })
          );
          return;
        }
        feedUrl = parsed.toString();
      } catch {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ status: "error", message: "Invalid feedUrl" }));
        return;
      }
    } else {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          status: "error",
          message: "feedUrl (rss.app) is required",
        })
      );
      return;
    }

    const upstream = await fetch(feedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ChalChitra/1.0; +https://ChalChitra.com)",
        Accept: "application/atom+xml,application/rss+xml,application/xml,text/xml,*/*",
      },
    });

    if (!upstream.ok) {
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          status: "error",
          message: `Upstream RSS failed (${upstream.status})`,
        })
      );
      return;
    }

    const xml = await upstream.text();
    const items = parseGenericRss(xml, limit);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, max-age=120");
    res.end(JSON.stringify({ status: "ok", channelId, feedUrl, items }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        status: "error",
        message: err instanceof Error ? err.message : "RSS proxy error",
      })
    );
  }
}

const ARTICLE_MAX_BYTES = 1_800_000;

function isBlockedArticleHost(hostname: string) {
  const h = String(hostname || "")
    .toLowerCase()
    .replace(/^\[|\]$/g, "");
  if (!h || h === "localhost" || h.endsWith(".local") || h.endsWith(".internal")) {
    return true;
  }
  if (h === "::1" || h === "0.0.0.0") return true;
  if (/^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(h)) return true;
  if (/^169\.254\./.test(h) || /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(h)) {
    return true;
  }
  return false;
}

function rewriteArticleHtml(html: string, sourceUrl: string) {
  const origin = new URL(sourceUrl).origin;
  let out = String(html || "");
  out = out.replace(
    /<meta[^>]+http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi,
    ""
  );
  out = out.replace(
    /<meta[^>]+http-equiv=["']?X-Frame-Options["']?[^>]*>/gi,
    ""
  );
  // Soften common frame-busters
  out = out.replace(
    /if\s*\(\s*(?:top|parent|self)\s*[!=]==?\s*(?:self|top|parent|window)/gi,
    "if(false && top"
  );
  out = out.replace(
    /(?:top|parent)\.location(?:\.href)?\s*=/gi,
    "window.__chalKeepFrame="
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
            var abs = new URL(href, ${JSON.stringify(origin)} + '/');
            if (abs.protocol === 'http:' || abs.protocol === 'https:') {
              ev.preventDefault();
              window.location.href = window.location.origin + '/api/article?url=' + encodeURIComponent(abs.toString());
            }
          } catch(e) {}
        }, true);
      })();
    </script>`,
  ].join("");
  if (/<head[^>]*>/i.test(out)) {
    out = out.replace(/<head[^>]*>/i, (m) => `${m}${inject}`);
  } else {
    out = `${inject}${out}`;
  }
  return out;
}

function articleErrorHtml(message: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Article</title>
<style>body{margin:0;font-family:system-ui,sans-serif;background:#0b1728;color:#fff;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px;text-align:center}
p{opacity:.75;max-width:28rem;line-height:1.5}</style></head>
<body><div><h1 style="font-size:1.1rem;margin:0 0 8px">Unable to load article</h1><p>${message}</p></div></body></html>`;
}

async function handleArticleApi(
  reqUrl: string,
  res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b: string) => void }
) {
  try {
    const u = new URL(reqUrl, "http://localhost");
    const target = (u.searchParams.get("url") || "").trim();
    if (!target) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(articleErrorHtml("Missing url parameter"));
      return;
    }

    let parsed: URL;
    try {
      parsed = new URL(target);
    } catch {
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(articleErrorHtml("Invalid article URL"));
      return;
    }

    if (!/^https?:$/.test(parsed.protocol) || isBlockedArticleHost(parsed.hostname)) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(articleErrorHtml("That article URL is not allowed"));
      return;
    }

    const upstream = await fetch(parsed.toString(), {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; ChalChitra/1.0; +https://ChalChitra.com)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!upstream.ok) {
      res.statusCode = 502;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(articleErrorHtml(`Publisher returned ${upstream.status}`));
      return;
    }

    const ctype = (upstream.headers.get("content-type") || "").toLowerCase();
    if (ctype && !ctype.includes("text/html") && !ctype.includes("application/xhtml")) {
      res.statusCode = 415;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(articleErrorHtml("URL is not an HTML article page"));
      return;
    }

    const buf = Buffer.from(await upstream.arrayBuffer());
    if (buf.byteLength > ARTICLE_MAX_BYTES) {
      res.statusCode = 413;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(articleErrorHtml("Article HTML is too large to embed"));
      return;
    }

    const html = rewriteArticleHtml(buf.toString("utf8"), parsed.toString());
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.end(html);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(
      articleErrorHtml(err instanceof Error ? err.message : "Article proxy error")
    );
  }
}

function youtubeRssApiPlugin(): Plugin {
  return {
    name: "ChalChitra-rss-api",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/api/article")) {
          void handleArticleApi(req.url, res);
          return;
        }
        if (!req.url?.startsWith("/api/rss")) return next();
        void handleRssApi(req.url, res);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/api/article")) {
          void handleArticleApi(req.url, res);
          return;
        }
        if (!req.url?.startsWith("/api/rss")) return next();
        void handleRssApi(req.url, res);
      });
    },
  };
}

export default defineConfig({
  build: {
    outDir: "dist",
  },
  plugins: [react(), youtubeRssApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
    },
  },
  server: {
    proxy: {},
  },
});
