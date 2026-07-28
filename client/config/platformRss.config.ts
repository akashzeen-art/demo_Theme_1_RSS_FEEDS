/**
 * ═══════════════════════════════════════════════════════════════════════════
 * StreamsIndia — RSS CONFIG (EDIT THIS FILE)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * source:
 *   "youtube"  → live remote channel RSS (working now)
 *   "rss"      → any MRSS/XML URL (rssUrl) — e.g. /feeds/movies.xml or licensed feed
 *   "platform" → catalog only
 */

export type LiveStreamItem = {
  title: string;
  url: string;
  thumbnail?: string;
};

export type PlatformRssSource = 'platform' | 'rss' | 'youtube';

export type PlatformCategoryRss = {
  enabled: boolean;
  source: PlatformRssSource;
  channelName: string;
  /** Remote channel id (UC…) when source = "youtube" */
  youtubeChannelId?: string;
  rssUrl?: string;
  preferLive?: boolean;
  liveStreams?: LiveStreamItem[];
  platformSnos: number[];
  platformTitles?: string[];
};

export type PlatformRssConfig = {
  brand: string;
  defaultLimit: number;
  categories: {
    reels: PlatformCategoryRss;
    live: PlatformCategoryRss;
    sports: PlatformCategoryRss;
    movies: PlatformCategoryRss;
    webseries: PlatformCategoryRss;
  };
};

/** ▼ Remote RSS active for every category */
export const PLATFORM_RSS_CONFIG: PlatformRssConfig = {
  brand: 'StreamsIndia',
  defaultLimit: 12,

  categories: {
    reels: {
      enabled: true,
      source: 'youtube',
      channelName: 'Rotten Tomatoes Trailers',
      youtubeChannelId: 'UCi8e0iOVk1fEOogdfu4YgfA',
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
      source: 'youtube',
      channelName: 'Collider Interviews',
      youtubeChannelId: 'UC5KD40UCDRUbR-od7sp9cuA',
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
      source: 'youtube',
      channelName: 'Screen Rant',
      youtubeChannelId: 'UC2iUwfYi_1FCGGqhOUNx-iA',
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
      source: 'youtube',
      channelName: 'FilmSelect Trailer',
      youtubeChannelId: 'UCT0hbLDa-unWsnZ6Rjzkfug',
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
      source: 'youtube',
      channelName: 'TV Promos',
      youtubeChannelId: 'UCDR8cvjALazMm2j9hOar8_g',
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
