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
    const enclosure =
      chunk.match(/<enclosure[^>]*url="([^"]+)"/)?.[1] ||
      chunk.match(/<media:content[^>]*url="([^"]+)"/)?.[1] ||
      "";
    const thumb =
      chunk.match(/<media:thumbnail[^>]*url="([^"]+)"/)?.[1] ||
      chunk.match(/<itunes:image[^>]*href="([^"]+)"/)?.[1] ||
      "/logo.png";
    const pubDate =
      chunk.match(/<pubDate>([^<]*)<\/pubDate>/)?.[1] ||
      chunk.match(/<published>([^<]*)<\/published>/)?.[1] ||
      "";
    const author =
      chunk.match(/<author>([^<]*)<\/author>/)?.[1] ||
      chunk.match(/<dc:creator[^>]*>([^<]*)<\/dc:creator>/)?.[1] ||
      "StreamsIndia";

    const ytId =
      link.match(/[?&]v=([\w-]{11})/)?.[1] ||
      enclosure.match(/[?&]v=([\w-]{11})/)?.[1];

    if (ytId) {
      items.push({
        id: ytId,
        title: decodeXml(titleRaw.trim()),
        link: `https://www.youtube.com/watch?v=${ytId}`,
        thumbnail: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
        pubDate,
        author: decodeXml(author),
        embedUrl: `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&fs=0&autoplay=1&mute=1`,
      });
    } else {
      const media = enclosure || link;
      if (!media) continue;
      const live =
        /\.m3u8(\?|$)/i.test(media) ||
        /isLive="true"/i.test(chunk) ||
        /application\/x-mpegURL/i.test(chunk);
      items.push({
        id: `rss-${items.length}-${decodeXml(titleRaw).slice(0, 20).replace(/\W+/g, "-")}`,
        title: decodeXml(titleRaw.trim()),
        link: link || media,
        thumbnail: thumb,
        pubDate,
        author: decodeXml(author),
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
        feedUrl = parsed.toString();
      } catch {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ status: "error", message: "Invalid feedUrl" }));
        return;
      }
    } else if (/^UC[\w-]{20,}$/.test(channelId)) {
      feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    } else {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          status: "error",
          message: "Provide channelId (UC…) or feedUrl",
        })
      );
      return;
    }

    const upstream = await fetch(feedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; StreamsIndia/1.0; +https://streamsindia.com)",
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

function youtubeRssApiPlugin(): Plugin {
  return {
    name: "streamsindia-rss-api",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/api/rss")) return next();
        void handleRssApi(req.url, res);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
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
