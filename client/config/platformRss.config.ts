/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ChalChitra — RSS CONFIG (rss.app ONLY)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * All Live Feed sections load exclusively from rss.app XML feeds.
 * No YouTube channel RSS. No other providers.
 *
 * How to set feeds:
 * 1. Open https://rss.app and create one feed per category
 * 2. Copy the feed URL (format: https://rss.app/feeds/XXXX.xml)
 * 3. Paste it into the matching `rssUrl` below
 *
 * Example: rssUrl: 'https://rss.app/feeds/cYVBYcpUEbgXfg9v.xml'
 */

export type LiveStreamItem = {
  title: string;
  url: string;
  thumbnail?: string;
};

/** Only rss.app is supported for remote Live Feeds */
export type PlatformRssSource = 'rss';

export type PlatformCategoryRss = {
  enabled: boolean;
  source: PlatformRssSource;
  /** Display name shown in the UI (usually the rss.app feed title / brand) */
  channelName: string;
  /**
   * Required — paste your rss.app feed URL here.
   * Must look like: https://rss.app/feeds/YOUR_FEED_ID.xml
   */
  rssUrl: string;
  preferLive?: boolean;
  liveStreams?: LiveStreamItem[];
  /** Catalog fallback thumbnails only (not used as Live Feed source) */
  platformSnos: number[];
  platformTitles?: string[];
};

export type PlatformRssConfig = {
  brand: string;
  defaultLimit: number;
  /** Only allow rss.app hosts */
  allowedFeedHosts: string[];
  categories: {
    reels: PlatformCategoryRss;
    live: PlatformCategoryRss;
    sports: PlatformCategoryRss;
    movies: PlatformCategoryRss;
    webseries: PlatformCategoryRss;
  };
};

/** ▼ Paste your rss.app feed URLs into each category.rssUrl */
export const PLATFORM_RSS_CONFIG: PlatformRssConfig = {
  brand: 'ChalChitra',
  defaultLimit: 12,
  allowedFeedHosts: ['rss.app', 'www.rss.app'],

  categories: {
    reels: {
      enabled: true,
      source: 'rss',
      channelName: 'Music - Celebuzz',
      rssUrl: 'https://rss.app/feeds/vI0CmUYD495xLLcy.xml',
      preferLive: false,
      platformSnos: [71, 72, 73, 74, 75, 76],
      platformTitles: [
        'Twist Ending',
        'Chase Scene Cut',
        'Behind the Crime',
        'Drama Teaser',
        'Comedy Bit',
        'Sports Slow-Mo',
      ],
    },

    live: {
      enabled: true,
      source: 'rss',
      channelName: 'Couples News, Pictures, and Videos',
      rssUrl: 'https://rss.app/feeds/DY0mpELyWM1lzUs3.xml',
      preferLive: false,
      platformSnos: [51, 52, 53, 54, 55, 56],
      platformTitles: [
        'Prime Stage Live',
        'Talk Nation',
        'Match Center',
        'Cooking Arena',
        'Comedy Night',
        'Newsroom Live',
      ],
    },

    sports: {
      enabled: true,
      source: 'rss',
      channelName: 'Music - Celebuzz',
      rssUrl: 'https://rss.app/feeds/vI0CmUYD495xLLcy.xml',
      preferLive: false,
      platformSnos: [31, 32, 33, 34, 35, 36],
      platformTitles: [
        'Championship Finals',
        'Premier League Highlights',
        'Knockout Night',
        'Court Kings',
        'Speed Circuit',
        'Smash Open',
      ],
    },

    movies: {
      enabled: true,
      source: 'rss',
      channelName: 'Movies | Hollywood Reporter',
      rssUrl: 'https://rss.app/feeds/Kokt3XvDewq5YvZp.xml',
      preferLive: false,
      platformSnos: [1, 2, 3, 4, 5, 6],
      platformTitles: [
        'Shadow Protocol',
        'Midnight Chase',
        'Bloodline Code',
        'The Silent Pact',
        'Iron Horizon',
        'Velvet Trap',
      ],
    },

    webseries: {
      enabled: true,
      source: 'rss',
      channelName: 'Couples News, Pictures, and Videos',
      rssUrl: 'https://rss.app/feeds/DY0mpELyWM1lzUs3.xml',
      preferLive: false,
      platformSnos: [13, 14, 15, 17, 18, 19],
      platformTitles: [
        'Fatal Connections',
        'Hidden Enemy',
        'Escape From Nowhere',
        'The Secret Order',
        'Final Dhokha',
        'Black Diary Secrets',
      ],
    },
  },
};

/** True when URL is an rss.app feed */
export function isRssAppFeedUrl(url: string | undefined | null): boolean {
  if (!url || !url.trim()) return false;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, '');
    return (
      host === 'rss.app' &&
      (u.pathname.startsWith('/feeds/') || u.pathname.includes('/feeds/'))
    );
  } catch {
    return false;
  }
}
