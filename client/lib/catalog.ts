import { getVideo } from '@/sections/desiVideos';

export type ContentItem = {
  id: number;
  title: string;
  genre: string;
  rating: string;
  duration: string;
  img: string;
  landscape?: string;
  videoSno: number;
  badge?: string;
};

export const CATEGORIES = [
  { label: 'Home', path: '/', icon: 'home' },
  { label: 'Reels', path: '/reels', icon: 'reels' },
  { label: 'Live', path: '/live', icon: 'live' },
  { label: 'Sports', path: '/sports', icon: 'sports' },
  { label: 'Movies', path: '/movies', icon: 'movies' },
  { label: 'Web Series', path: '/webseries', icon: 'series' }
] as const;

const THUMB_NAMES = [
  'ADVENTUREKERAAZ.jpg','BEYONDSUSPICIONEP2.jpg',
  'BLACKDIARYSECRETSEP1.jpg','BLACKDIARYSECRETSEP2.jpg','BLACKSIGNAL.jpg',
  'DANGEROUSALLIANCE.jpg','DANGEROUSMINDSEP1.jpg','DANGEROUSMINDSEP2.jpg',
  'DANGEROUSMINDSEP3.jpg','DANGEROUSMINDSEP4.jpg','DANGEROUSTERRITORY.jpg',
  'DARKCITYFILES.jpg','DEADENDMISSON.jpg','ESCAPEBEYONDFEAREP2.jpg','ESCAPEFROMNOWHERE.jpg',
  'ESCAPEPLAN302.jpg','ESCAPEROUT21.jpg','FATALCONNECTIONSEP1.jpg',
  'FATALCONNECTIONSEP2.jpg','FATALCONNECTIONSEP3.jpg','FINALCOUNTDOWN.jpg',
  'FINALWITNESS.jpg','HERSTORY.jpg','KILLERINSTINCT.jpg','LASTMISSIONALIVE.jpg',
  'MIDNIGHTESCAPE.jpg','MISSSIONDARKNIGHT.jpg','MYSTERYJUNCTION.jpg',
  'OPERATIONNIGHTFALL.jpg','RAAZBEYONDFEAR.jpg','RAAZ,REVENGE&MAFIAEP1.jpg',
  'RAAZ,REVENGE&MAFIAEP2.jpg','SCILENTCHASE.jpg',
  'SCILENTTRIGGER.jpg','SECRETNIGHTS.jpg','SHADOWPROTOCOL.jpg',
  'THECRIMECIRCLE.jpg','THEDARKNETWORK.jpg','THEDIARYSECRETS.jpg',
  'THEFINALDHOKHA.jpg','THEFINALSECRET.jpg','THEFITNESSTRAP.jpg',
  'THEFORBIDDENFILES.jpg','THEHIDDENENEMY.jpg','THEHIDDENTRUTH.jpg',
  'THEMISSINGLINK.jpg','THEMISSINGWITNESS.jpg',
  'THESECRETMISSION.jpg','THESECRETORDER.jpg','THESECRETROUTEP1.jpg',
  'THESECRETROUTEP2.jpg','THESECRETSYNDICATE.jpg','THESHADOWGAMEEP1.jpg',
  'THESHADOWGAMEEP2.jpg','THESHADOWGAMEEP3.jpg','THESHADOWGAMEEP4.jpg',
  'THEUNKNOWNTARGET.jpg','UNDERGROUNDWARRIORSEP1.jpg',
  'UNDERGROUNDWARRIORSEP2.jpg','UNKNOWNENEMYEP1.jpg','UNKNOWNENEMYEP2.jpg',
  'UNKNOWNENEMYEP3.jpg','WANTEDBYDARKNESS.jpg','WANTEDFORREVENGE.jpg'
];

export function thumbName(sno: number): string {
  return THUMB_NAMES[((Math.max(1, sno) - 1) % THUMB_NAMES.length)];
}

export function portraitThumb(sno: number): string {
  return `/portrait/${thumbName(sno)}`;
}

export function landscapeThumb(sno: number): string {
  return `/landscape/${thumbName(sno)}`;
}


function item(
  id: number,
  title: string,
  genre: string,
  rating: string,
  duration: string,
  sno: number,
  badge?: string
): ContentItem {
  return {
    id,
    title,
    genre,
    rating,
    duration,
    img: portraitThumb(sno),
    landscape: landscapeThumb(sno),
    videoSno: sno,
    badge,
  };
}

export function resolveVideo(item: ContentItem): string {
  return getVideo(item.videoSno);
}

/* ── Movies ─────────────────────────────────────────── */
export const MOVIES: ContentItem[] = [
  item(1, 'Shadow Protocol', 'Action', '4.8', '2h 12m', 1, 'NEW'),
  item(2, 'Midnight Chase', 'Thriller', '4.7', '1h 58m', 2),
  item(3, 'Bloodline Code', 'Crime', '4.9', '2h 05m', 3, 'HOT'),
  item(4, 'The Silent Pact', 'Drama', '4.6', '1h 48m', 4),
  item(5, 'Iron Horizon', 'Action', '4.8', '2h 20m', 5),
  item(6, 'Velvet Trap', 'Mystery', '4.5', '1h 52m', 6),
  item(7, 'Last Witness', 'Crime', '4.9', '2h 01m', 7, 'TOP'),
  item(8, 'Neon Betrayal', 'Thriller', '4.7', '1h 55m', 8),
  item(9, 'Desert Kings', 'Action', '4.6', '2h 08m', 9),
  item(10, 'Broken Mirror', 'Drama', '4.8', '1h 44m', 10),
  item(11, 'Cold Justice', 'Crime', '4.7', '2h 15m', 11),
  item(12, 'Phantom Edge', 'Action', '4.9', '1h 59m', 12, 'NEW')
];

export const MOVIES_TRENDING = MOVIES.slice(0, 8);
export const MOVIES_ACTION = [MOVIES[0], MOVIES[4], MOVIES[8], MOVIES[11], MOVIES[1], MOVIES[2]];
export const MOVIES_CLASSICS = MOVIES.slice(4, 12);

/* ── Web Series ─────────────────────────────────────── */
export const WEBSERIES: ContentItem[] = [
  item(21, 'Fatal Connections', 'Thriller', '4.9', '8 Ep', 13, 'S1'),
  item(22, 'Black Diary Secrets', 'Crime', '4.8', '10 Ep', 19, 'S1'),
  item(23, 'The Secret Order', 'Mystery', '4.7', '6 Ep', 17),
  item(24, 'Hidden Enemy', 'Action', '4.8', '8 Ep', 14, 'HOT'),
  item(25, 'Final Dhokha', 'Drama', '4.6', '7 Ep', 18),
  item(26, 'Escape From Nowhere', 'Thriller', '4.9', '9 Ep', 15, 'NEW'),
  item(27, 'Final Witness', 'Crime', '4.8', '8 Ep', 21),
  item(28, 'Missing Link', 'Mystery', '4.5', '6 Ep', 22),
  item(29, 'Dark Corridor', 'Thriller', '4.7', '10 Ep', 23),
  item(30, 'City of Lies', 'Crime', '4.9', '8 Ep', 24, 'TOP'),
  item(31, 'Red Signal', 'Action', '4.6', '7 Ep', 25),
  item(32, 'Whisper Network', 'Drama', '4.8', '9 Ep', 26)
];

export const WEBSERIES_NEW = WEBSERIES.filter((w) => w.badge === 'NEW' || w.badge === 'HOT' || w.badge === 'S1').concat(WEBSERIES.slice(2, 6));
export const WEBSERIES_BINGE = WEBSERIES.slice(4, 12);

/* ── Sports ─────────────────────────────────────────── */
export const SPORTS: ContentItem[] = [
  item(41, 'Championship Finals', 'Cricket', '4.9', 'Live+', 31, 'LIVE'),
  item(42, 'Premier League Highlights', 'Football', '4.8', '45 min', 32),
  item(43, 'Knockout Night', 'Boxing', '4.7', '1h 20m', 33, 'HOT'),
  item(44, 'Court Kings', 'Basketball', '4.6', '55 min', 34),
  item(45, 'Speed Circuit', 'Racing', '4.8', '1h 05m', 35),
  item(46, 'Smash Open', 'Tennis', '4.5', '2h 10m', 36),
  item(47, 'Pro Kabaddi Clash', 'Kabaddi', '4.9', '50 min', 37, 'NEW'),
  item(48, 'Olympic Moments', 'Multi', '4.8', '1h 30m', 38),
  item(49, 'Street Football', 'Football', '4.7', '40 min', 39),
  item(50, 'Wicket Masterclass', 'Cricket', '4.6', '35 min', 40)
];

export const SPORTS_LIVE = SPORTS.filter((s) => s.badge === 'LIVE' || s.badge === 'HOT');
export const SPORTS_HIGHLIGHTS = SPORTS.slice(1, 10);

/* ── News ───────────────────────────────────────────── */
export const NEWS: ContentItem[] = [
  item(61, 'Evening Bulletin', 'National', '4.7', '28 min', 41, 'LIVE'),
  item(62, 'World Watch', 'World', '4.6', '22 min', 42),
  item(63, 'Market Pulse', 'Business', '4.5', '18 min', 43),
  item(64, 'Tech Today', 'Tech', '4.8', '15 min', 44, 'NEW'),
  item(65, 'Sports Desk', 'Sports', '4.7', '20 min', 45),
  item(66, 'City Briefing', 'Local', '4.4', '12 min', 46),
  item(67, 'Weather & Climate', 'Weather', '4.5', '10 min', 47),
  item(68, 'Exclusive Report', 'Investigative', '4.9', '35 min', 48, 'HOT'),
  item(69, 'Morning Digest', 'National', '4.6', '25 min', 49),
  item(70, 'Culture Hour', 'Lifestyle', '4.5', '30 min', 50)
];

/* ── Live Stream ────────────────────────────────────── */
export const LIVE_STREAMS: ContentItem[] = [
  item(81, 'Prime Stage Live', 'Concert', '4.9', 'LIVE', 51, 'LIVE'),
  item(82, 'Talk Nation', 'Talk Show', '4.7', 'LIVE', 52, 'LIVE'),
  item(83, 'Match Center', 'Sports', '4.8', 'LIVE', 53, 'LIVE'),
  item(84, 'Cooking Arena', 'Lifestyle', '4.6', 'LIVE', 54),
  item(85, 'Comedy Night', 'Entertainment', '4.8', 'LIVE', 55, 'HOT'),
  item(86, 'Newsroom Live', 'News', '4.7', 'LIVE', 56, 'LIVE'),
  item(87, 'E-Sports Arena', 'Gaming', '4.9', 'LIVE', 57, 'NEW'),
  item(88, 'Fashion Runway', 'Fashion', '4.5', 'LIVE', 58),
  item(89, 'Devotional Hour', 'Spiritual', '4.6', 'LIVE', 59),
  item(90, 'Late Night Live', 'Entertainment', '4.8', 'LIVE', 60)
];

export const LIVE_UPCOMING = LIVE_STREAMS.slice(3, 10);

/* ── Kids ───────────────────────────────────────────── */
export const KIDS: ContentItem[] = [
  item(101, 'Adventure Island', 'Animation', '4.8', '22 min', 61, 'NEW'),
  item(102, 'Space Pals', 'Cartoon', '4.7', '18 min', 62),
  item(103, 'Magic School Bus', 'Learning', '4.9', '25 min', 63),
  item(104, 'Jungle Friends', 'Animation', '4.6', '20 min', 64),
  item(105, 'Robot Heroes', 'Action Kids', '4.8', '24 min', 65, 'HOT'),
  item(106, 'Fairy Tales', 'Story', '4.7', '15 min', 66),
  item(107, 'Dino World', 'Nature', '4.5', '18 min', 67),
  item(108, 'Music Makers', 'Music', '4.6', '12 min', 68)
];

/* ── Reels (shorts) ─────────────────────────────────── */
export type ReelItem = ContentItem & { views: string; creator: string };

export const REELS: ReelItem[] = [
  { ...item(201, 'Twist Ending', 'Thriller', '4.9', '0:45', 71), views: '2.1M', creator: '@streams' },
  { ...item(202, 'Chase Scene Cut', 'Action', '4.8', '0:38', 72), views: '1.8M', creator: '@actionhub' },
  { ...item(203, 'Behind the Crime', 'Crime', '4.7', '0:52', 73), views: '980K', creator: '@desicrime' },
  { ...item(204, 'Drama Teaser', 'Drama', '4.6', '0:30', 74), views: '1.2M', creator: '@seriescut' },
  { ...item(205, 'Comedy Bit', 'Comedy', '4.8', '0:28', 75), views: '3.4M', creator: '@laughreel' },
  { ...item(206, 'Sports Slow-Mo', 'Sports', '4.9', '0:41', 76), views: '2.7M', creator: '@sportz' },
  { ...item(207, 'Plot Twist', 'Mystery', '4.7', '0:55', 77), views: '890K', creator: '@whodunit' },
  { ...item(208, 'Trailer Drop', 'Movies', '4.9', '0:48', 78), views: '4.1M', creator: '@streamsofficial' },
  { ...item(209, 'BTS Moments', 'Behind Scenes', '4.5', '0:35', 79), views: '760K', creator: '@onsets' },
  { ...item(210, 'Viral Hook', 'Entertainment', '4.8', '0:22', 80), views: '5.2M', creator: '@viralott' }
];

/* ── Home category spotlight cards ──────────────────── */
export const HOME_CATEGORIES = [
  { title: 'Reels', subtitle: 'Bite-sized shorts', path: '/reels', accent: 'from-rose-600 to-orange-500', sno: 71 },
  { title: 'Live', subtitle: 'Watch now', path: '/live', accent: 'from-red-600 to-rose-700', sno: 51 },
  { title: 'Sports', subtitle: 'Matches & highlights', path: '/sports', accent: 'from-emerald-600 to-teal-500', sno: 31 },
  { title: 'Movies', subtitle: 'Blockbusters & more', path: '/movies', accent: 'from-red-700 to-amber-600', sno: 1 },
  { title: 'Web Series', subtitle: 'Binge every episode', path: '/webseries', accent: 'from-orange-600 to-red-600', sno: 13 }
];
