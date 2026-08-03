// SubscriptionFlow — Mobile → Plan → Netflix-style detail preview
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  Plus,
  Check,
  ThumbsUp,
  ChevronDown,
} from 'lucide-react';
import { LATEST_VIDEOS, type DesiVideoEntry } from '@/sections/desiVideos';
import { WatchVideoPlayer } from '@/components/WatchVideoPlayer';

interface SubscriptionFlowProps {
  videoUrl: string | null;
  title?: string;
  thumbnail?: string;
  genre?: string;
  duration?: string;
  rating?: string;
  description?: string;
  onClose: () => void;
}

type Step = 'mobile' | 'plan' | 'video';

type PreviewItem = {
  url: string;
  title: string;
  thumb: string;
  genre: string;
  duration: string;
  rating: string;
  description: string;
  year: string;
};

const PLANS = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: '₹159',
    original: '₹318',
    discount: '50% OFF',
    desc: 'Unlimited Videos & Web Series',
  },
  {
    id: 'quarterly',
    label: 'Quarterly',
    price: '₹199',
    original: '₹398',
    discount: '50% OFF',
    desc: 'Unlimited Videos & Web Series',
  },
];

const LS_MOBILE = 'StreamsIndia_mobile';
const LS_PLAN = 'StreamsIndia_plan';

const GENRE_POOL = [
  'Thriller',
  'Crime',
  'Action',
  'Drama',
  'Mystery',
  'Suspense',
  'Romance',
];

const TAG_MOODS = ['Emotional', 'Suspenseful', 'Intense', 'Romantic', 'Dark'];

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function buildSynopsis(title: string, genre: string) {
  const hooks = [
    `When secrets surface in ${title}, alliances fracture and every choice raises the stakes.`,
    `${title} follows a high-stakes chase through betrayal, ambition, and buried truth.`,
    `In ${title}, one wrong move turns a quiet plan into a dangerous game of survival.`,
    `A gripping ${genre.toLowerCase()} story — ${title} pulls you into a world where trust is the first casualty.`,
  ];
  return hooks[hashStr(title) % hooks.length];
}

function estimateDuration(title: string) {
  const mins = 95 + (hashStr(title) % 70);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function toPreview(
  entry: { url: string; title: string; thumb: string },
  overrides?: Partial<PreviewItem>
): PreviewItem {
  const genre = overrides?.genre || GENRE_POOL[hashStr(entry.title) % GENRE_POOL.length];
  return {
    url: entry.url,
    title: entry.title,
    thumb: entry.thumb,
    genre,
    duration: overrides?.duration || estimateDuration(entry.title),
    rating: overrides?.rating || (4.5 + (hashStr(entry.title) % 5) * 0.1).toFixed(1),
    description: overrides?.description || buildSynopsis(entry.title, genre),
    year: overrides?.year || String(2022 + (hashStr(entry.title) % 5)),
  };
}

function relatedFor(title: string, limit = 12): DesiVideoEntry[] {
  const n = title.trim().toLowerCase();
  return LATEST_VIDEOS.filter((v) => v.title.toLowerCase() !== n).slice(0, limit);
}

/** Prefer landscape art for Netflix-style preview cards; encode spaces in paths. */
function mediaSrc(path: string | undefined | null, preferLandscape = false) {
  if (!path) return '/logo.png';
  let src = path.trim();
  if (preferLandscape) {
    src = src
      .replace('/Potrait-New_desi/', '/Landscape-New-Desi/')
      .replace('/potrait_new_desicontent/', '/landscape_new_desicontent/')
      .replace('/Eatme Portrait/', '/Eatme Landscape/')
      .replace('/Yoga Portrait/', '/Yoga landscape/');
  }
  try {
    // Keep absolute http(s) URLs as-is; encode local paths with spaces
    if (/^https?:\/\//i.test(src)) return src;
    return encodeURI(src);
  } catch {
    return src;
  }
}

function ThumbImage({
  src,
  alt,
  className = '',
  landscape = false,
}: {
  src: string;
  alt: string;
  className?: string;
  landscape?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const resolved = failed ? '/logo.png' : mediaSrc(src, landscape);

  return (
    <img
      src={resolved}
      alt={alt}
      className={className}
      loading="eager"
      decoding="async"
      onError={() => {
        if (!failed) setFailed(true);
      }}
    />
  );
}

function readSavedAuth(): { mobile: string; plan: string } | null {
  if (typeof window === 'undefined') return null;
  const savedMobile = localStorage.getItem(LS_MOBILE);
  const savedPlan = localStorage.getItem(LS_PLAN);
  if (savedMobile && savedPlan) return { mobile: savedMobile, plan: savedPlan };
  return null;
}

export function SubscriptionFlow({
  videoUrl,
  title,
  thumbnail,
  genre,
  duration,
  rating,
  description,
  onClose,
}: SubscriptionFlowProps) {
  const saved = readSavedAuth();
  const [step, setStep] = useState<Step>(saved ? 'video' : 'mobile');
  const [mobile, setMobile] = useState(saved?.mobile || '');
  const [plan, setPlan] = useState(saved?.plan || 'monthly');
  const [mobileError, setMobileError] = useState('');
  const [current, setCurrent] = useState<PreviewItem | null>(null);
  const [inMyList, setInMyList] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showAllRelated, setShowAllRelated] = useState(false);
  const [watching, setWatching] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!videoUrl) {
      setCurrent(null);
      return;
    }
    const auth = readSavedAuth();
    if (auth) {
      setMobile(auth.mobile);
      setPlan(auth.plan);
      setStep('video');
    } else {
      setStep('mobile');
    }
    setCurrent(
      toPreview(
        {
          url: videoUrl,
          title: title || 'Now Playing',
          thumb: thumbnail || '/logo.png',
        },
        { genre, duration, rating, description }
      )
    );
    setInMyList(false);
    setLiked(false);
    setShowAllRelated(false);
    setWatching(false);
  }, [videoUrl, title, thumbnail, genre, duration, rating, description]);

  useEffect(() => {
    if (!videoUrl) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [videoUrl]);

  const preview =
    current ??
    (videoUrl
      ? toPreview(
          {
            url: videoUrl,
            title: title || 'Now Playing',
            thumb: thumbnail || '/logo.png',
          },
          { genre, duration, rating, description }
        )
      : null);

  const related = useMemo(
    () => (preview ? relatedFor(preview.title, showAllRelated ? 18 : 6) : []),
    [preview, showAllRelated]
  );

  const moods = useMemo(() => {
    if (!preview) return [];
    const h = hashStr(preview.title);
    return [TAG_MOODS[h % TAG_MOODS.length], TAG_MOODS[(h + 2) % TAG_MOODS.length]];
  }, [preview]);

  const handleClose = () => {
    setMobileError('');
    setWatching(false);
    onClose();
  };

  const playRelated = (item: DesiVideoEntry) => {
    setCurrent(toPreview(item));
    setShowAllRelated(false);
    setWatching(false);
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobile)) {
      setMobileError('Please enter a valid 10-digit mobile number');
      return;
    }
    setMobileError('');
    setStep('plan');
  };

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(LS_MOBILE, mobile);
    localStorage.setItem(LS_PLAN, plan);
    setStep('video');
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {videoUrl && watching && preview ? (
        <WatchVideoPlayer
          key={`watch-${preview.url}`}
          src={preview.url}
          title={preview.title}
          poster={mediaSrc(preview.thumb, true)}
          onBack={() => setWatching(false)}
        />
      ) : null}

      {videoUrl && !watching && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-6"
          style={{
            paddingTop: 'env(safe-area-inset-top, 0px)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/85"
            onClick={handleClose}
            aria-hidden
          />

          <AnimatePresence mode="wait">
            {step === 'mobile' && (
              <motion.div
                key="mobile"
                className="relative glass-panel rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md mx-0 sm:mx-auto z-10 max-h-[90dvh] overflow-y-auto self-end sm:self-center"
                initial={{ scale: 0.96, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0, y: -16 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-400" />
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 text-white"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>

                <form onSubmit={handleMobileSubmit}>
                  <h3 className="text-2xl font-bebas font-black text-white mb-6 text-center tracking-wide pr-8">
                    <span className="gradient-text">Enter Mobile Number</span>
                  </h3>

                  <div className="mb-6">
                    <label
                      htmlFor="mobileInput"
                      className="block text-gray-400 text-sm font-orbitron uppercase tracking-widest mb-2"
                    >
                      Mobile Number
                    </label>
                    <div className="flex rounded-xl border border-red-500/20 overflow-hidden bg-white/5 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent">
                      <div className="flex items-center px-4 border-r border-white/15 bg-white/8 text-gray-300 text-sm font-orbitron font-semibold select-none">
                        +91
                      </div>
                      <input
                        type="tel"
                        id="mobileInput"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => {
                          setMobile(e.target.value.replace(/\D/g, ''));
                          setMobileError('');
                        }}
                        className="w-full px-3 py-3.5 text-base sm:text-xs text-white placeholder-gray-600 bg-transparent focus:outline-none"
                        required
                        inputMode="numeric"
                        pattern="\d{10}"
                        autoComplete="tel"
                      />
                    </div>
                    {mobileError && (
                      <p className="text-red-400 text-xs mt-1.5 font-orbitron">
                        {mobileError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn-neon w-full text-white font-bebas font-bold py-3.5 px-6 rounded-xl text-lg tracking-widest"
                  >
                    Subscribe Now
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'plan' && (
              <motion.div
                key="plan"
                className="relative glass-panel rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md mx-0 sm:mx-auto z-10 max-h-[90dvh] overflow-y-auto self-end sm:self-center"
                initial={{ scale: 0.96, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0, y: -16 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-red-600 to-rose-500" />
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/40 text-white"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>

                <form onSubmit={handlePlanSubmit}>
                  <h3 className="text-2xl font-bebas font-black text-white mb-4 text-center tracking-wide pr-8">
                    <span className="gradient-text">Choose Your Plan</span>
                  </h3>

                  <div className="text-center mb-5 text-gray-500 text-xs font-orbitron uppercase tracking-widest">
                    Mobile:{' '}
                    <span className="text-red-400 font-bold">+91 {mobile}</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    {PLANS.map((p) => (
                      <label
                        key={p.id}
                        className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                          plan === p.id
                            ? 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20'
                            : 'border-white/10 bg-white/5 hover:border-red-500/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="plan"
                          value={p.id}
                          checked={plan === p.id}
                          onChange={() => setPlan(p.id)}
                          className="mt-0.5 mr-3 accent-red-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2">
                            <span className="font-bebas text-lg text-white tracking-wide">
                              {p.label}
                            </span>
                            <span className="font-bold text-red-400">{p.price}</span>
                            <span className="line-through text-gray-600 text-sm">
                              {p.original}
                            </span>
                            <span className="text-green-400 text-xs font-orbitron font-bold">
                              {p.discount}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-orbitron mt-1">
                            {p.desc}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="btn-neon w-full text-white font-bebas font-bold py-3.5 px-6 rounded-xl text-lg tracking-widest"
                  >
                    Continue to Watch
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'video' && preview && (
              <motion.div
                key="preview"
                role="dialog"
                aria-modal="true"
                aria-label={`${preview.title} preview`}
                className="relative z-10 w-full max-w-[850px] h-[100dvh] sm:h-auto sm:max-h-[min(90dvh,900px)] overflow-y-auto overflow-x-hidden rounded-none sm:rounded-xl bg-[#141414] border-0 sm:border border-white/10 shadow-2xl shadow-black/60 overscroll-contain"
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              >
                {/* Static hero art — no video playback in popup */}
                <div className="relative w-full aspect-video bg-black overflow-hidden">
                  <ThumbImage
                    src={preview.thumb}
                    alt={preview.title}
                    landscape
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/35 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none" />

                  <button
                    type="button"
                    onClick={handleClose}
                    className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-[#181818] border border-white/25 text-white flex items-center justify-center hover:bg-[#2a2a2a] transition-colors"
                    aria-label="Close"
                    title="Close"
                  >
                    <X size={18} />
                  </button>

                  <div className="absolute left-4 sm:left-8 right-16 bottom-5 sm:bottom-8 z-20">
                    <h2 className="font-bebas text-3xl sm:text-5xl text-white tracking-wide leading-none drop-shadow-lg line-clamp-2 max-w-xl">
                      {preview.title}
                    </h2>

                    <div className="mt-2 mb-3 flex items-center gap-2 text-[11px] sm:text-xs text-white/70">
                      <div className="h-1 flex-1 max-w-[140px] sm:max-w-[180px] rounded-full bg-white/20 overflow-hidden">
                        <div className="h-full w-[72%] bg-[#e50914] rounded-full" />
                      </div>
                      <span className="shrink-0">{preview.duration}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => setWatching(true)}
                        className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded bg-white text-black font-semibold text-sm sm:text-base hover:bg-white/90 transition-colors"
                      >
                        <Play size={18} className="fill-black" />
                        Play
                      </button>

                      <button
                        type="button"
                        onClick={() => setInMyList((v) => !v)}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white/50 bg-black/40 text-white flex items-center justify-center hover:border-white transition-colors"
                        aria-label={inMyList ? 'Remove from My List' : 'My List'}
                      >
                        {inMyList ? <Check size={18} /> : <Plus size={18} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setLiked((v) => !v)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                          liked
                            ? 'border-[#46d369] text-[#46d369] bg-black/40'
                            : 'border-white/50 text-white bg-black/40 hover:border-white'
                        }`}
                        aria-label="Rate"
                      >
                        <ThumbsUp size={16} className={liked ? 'fill-[#46d369]' : ''} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="px-4 sm:px-8 pt-4 pb-2 grid sm:grid-cols-[1.4fr_1fr] gap-5 sm:gap-8">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-white/80">
                      <span className="text-[#46d369] font-semibold">
                        {Math.round(Number(preview.rating) * 20)}% Match
                      </span>
                      <span>{preview.year}</span>
                      <span className="border border-white/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white/70">
                        U/A 13+
                      </span>
                      <span>{preview.duration}</span>
                      <span className="border border-white/40 px-1.5 py-0.5 text-[10px] font-semibold text-white/80">
                        HD
                      </span>
                    </div>
                    <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-white/85">
                      {preview.description}
                    </p>
                    <p className="mt-2 text-[11px] text-white/40 font-orbitron uppercase tracking-wider">
                      +91 {mobile} · {PLANS.find((p) => p.id === plan)?.label} Plan
                    </p>
                  </div>

                  <div className="space-y-2 text-[13px] sm:text-sm">
                    <p className="text-white/55">
                      <span className="text-white/40">Genre: </span>
                      <span className="text-white/85">{preview.genre}</span>
                    </p>
                    <p className="text-white/55">
                      <span className="text-white/40">This title is: </span>
                      <span className="text-white/85">{moods.join(', ')}</span>
                    </p>
                    <p className="text-white/55">
                      <span className="text-white/40">Maturity: </span>
                      <span className="text-white/85">U/A 13+ · mature themes</span>
                    </p>
                  </div>
                </div>

                {/* More Like This */}
                <div className="px-4 sm:px-8 pt-4 pb-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
                    More Like This
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                    {related.map((item) => {
                      const meta = toPreview(item);
                      return (
                        <button
                          key={item.title}
                          type="button"
                          onClick={() => playRelated(item)}
                          className="group text-left rounded-md overflow-hidden bg-[#2f2f2f] border border-white/10 hover:border-white/35 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                          aria-label={`Play ${item.title}`}
                        >
                          <div className="relative w-full aspect-video overflow-hidden bg-[#1a1a1a]">
                            <ThumbImage
                              src={item.thumb}
                              alt={item.title}
                              landscape
                              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25">
                              <span className="w-10 h-10 rounded-full border-2 border-white/80 flex items-center justify-center bg-black/40">
                                <Play size={16} className="fill-white text-white ml-0.5" />
                              </span>
                            </div>
                            <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-white/90">
                              {meta.duration}
                            </span>
                          </div>
                          <div className="p-2.5 sm:p-3">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-white/70">
                                <span>{meta.year}</span>
                                <span className="border border-white/35 px-1 text-[9px]">
                                  U/A 13+
                                </span>
                                <span className="border border-white/35 px-1 text-[9px]">
                                  HD
                                </span>
                              </div>
                              <span
                                className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center text-white/80 shrink-0"
                                aria-hidden
                              >
                                <Plus size={12} />
                              </span>
                            </div>
                            <p className="font-semibold text-white text-[13px] leading-tight line-clamp-1">
                              {item.title}
                            </p>
                            <p className="mt-1 text-[11px] leading-snug text-white/55 line-clamp-3 min-h-[2.5rem]">
                              {meta.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {!showAllRelated && relatedFor(preview.title, 18).length > 6 && (
                    <div className="relative mt-3 flex justify-center border-t border-white/10 pt-0">
                      <button
                        type="button"
                        onClick={() => setShowAllRelated(true)}
                        className="relative -top-4 w-9 h-9 rounded-full border border-white/40 bg-[#141414] text-white flex items-center justify-center hover:border-white transition-colors"
                        aria-label="Show more titles"
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>
                  )}

                  <div className="mt-6 pt-2 border-t border-white/10">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
                      About <span className="font-bold">{preview.title}</span>
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/55">
                        <span className="text-white/40">Genres: </span>
                        <span className="text-white/85">
                          {preview.genre}, {GENRE_POOL[(hashStr(preview.title) + 1) % GENRE_POOL.length]}
                        </span>
                      </p>
                      <p className="text-white/55">
                        <span className="text-white/40">This title is: </span>
                        <span className="text-white/85">{moods.join(', ')}</span>
                      </p>
                      <p className="text-white/55">
                        <span className="text-white/40">Maturity Rating: </span>
                        <span className="inline-block border border-white/40 px-1.5 py-0.5 text-[11px] text-white/80 mr-2">
                          U/A 13+
                        </span>
                        <span className="text-white/70">mature themes</span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
