import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, Star, Clock } from 'lucide-react';
import {
  LIVE_STREAMS,
  MOVIES_TRENDING,
  WEBSERIES_NEW,
  type ContentItem,
  landscapeThumb,
  portraitThumb,
} from '@/lib/catalog';

const SLIDE_MS = 6000;

const HERO_ITEMS: Array<ContentItem & { blurb: string }> = [
  {
    ...LIVE_STREAMS[0],
    blurb: 'Big live moments, bold stories and premium entertainment from your own catalog.',
  },
  {
    ...MOVIES_TRENDING[0],
    blurb: 'A hardcoded featured stage with cinematic posters from your StreamsIndia library.',
  },
  {
    ...WEBSERIES_NEW[0],
    blurb: 'Binge-ready episodes, cinematic visuals and a cleaner dark home experience.',
  },
  {
    ...LIVE_STREAMS[4],
    blurb: 'Concerts, talk shows and marquee events take the lead before RSS discovery blocks.',
  },
  {
    ...MOVIES_TRENDING[2],
    blurb: 'Your own content now appears above the feed sections and inside the hero itself.',
  },
  {
    ...WEBSERIES_NEW[3],
    blurb: 'A darker UI keeps the homepage richer while still supporting the live RSS sections below.',
  },
];

interface HeroSectionProps {
  onEnter?: () => void;
}

/** Dark cinematic hero — thumbnails only (portrait mobile / landscape desktop) */
export function HeroSection({ onEnter }: HeroSectionProps) {
  const [itemIdx, setItemIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const items = HERO_ITEMS;
  const current = items[itemIdx] ?? items[0];
  const displayTitle = current.title;
  const currentIsLive = current.badge === 'LIVE' || current.duration === 'LIVE';

  const goPrev = () => setItemIdx((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setItemIdx((i) => (i + 1) % items.length);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    setProgress(0);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const ratio = Math.min(1, (now - start) / SLIDE_MS);
      setProgress(ratio);
      if (ratio >= 1) {
        setItemIdx((i) => (i + 1) % items.length);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [itemIdx, paused, items.length]);

  const landscapeSrc = useMemo(
    () => current.landscape || landscapeThumb(current.videoSno),
    [current]
  );
  const portraitSrc = useMemo(
    () => current.img || portraitThumb(current.videoSno),
    [current]
  );

  const getLandscape = (item: ContentItem) =>
    item.landscape || landscapeThumb(item.videoSno);
  const getPortrait = (item: ContentItem) =>
    item.img || portraitThumb(item.videoSno);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.img
            key={landscapeSrc}
            src={landscapeSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.22, scale: 1.06 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[#07111f]/45 via-[#07111f]/78 to-[#07111f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07111f]/70 via-transparent to-[#07111f]/45" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-8 sm:pb-12 overflow-x-clip">
        <div className="relative mb-6 sm:mb-8">
          <motion.div
            className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          >
            <div className="min-w-0 flex-1 relative">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-200">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  {currentIsLive ? 'Live now' : 'Featured content'}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/80">
                  <Star size={11} className="fill-cyan-300 text-cyan-300" />
                  My Content
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.h1
                  key={current?.id || 'title'}
                  className="font-bebas text-white tracking-wide leading-[0.9] line-clamp-2 relative"
                  style={{
                    fontSize: 'clamp(1.85rem, 7vw, 4.25rem)',
                    textShadow: '0 10px 30px rgba(0,0,0,0.45)',
                  }}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  {displayTitle}
                </motion.h1>
              </AnimatePresence>
              <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/65">
                {current.blurb}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-white/55">
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={12} /> {current.duration}
                </span>
                <span>{current.genre}</span>
                <span>Rating {current.rating}</span>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={onEnter}
              className="w-full sm:w-auto shrink-0 self-stretch sm:self-end inline-flex items-center justify-center gap-2.5 rounded-full bg-cyan-400 px-7 py-3.5 sm:py-4 text-xs font-black uppercase tracking-[0.2em] text-[#07111f] shadow-[0_14px_30px_rgba(34,211,238,0.28)] transition-all hover:bg-cyan-300"
              whileTap={{ scale: 0.97 }}
            >
              <Play size={15} className="fill-[#07111f]" />
              Browse My Content
            </motion.button>
          </motion.div>
        </div>

        {/* Main hero thumbnail — portrait on mobile, landscape on desktop */}
        <motion.div
          className="relative mx-1 sm:mx-2"
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 18, delay: 0.08 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="absolute -inset-1 rounded-[1.25rem] bg-gradient-to-r from-cyan-500/40 via-transparent to-blue-500/35 blur-sm pointer-events-none" />

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1728] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            {/* Mobile: portrait 1080×1350 */}
            <div className="relative aspect-[4/5] sm:hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`m-${portraitSrc}`}
                  src={portraitSrc}
                  alt={displayTitle}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  onError={(e) => {
                    e.currentTarget.src = portraitThumb(1);
                  }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />
            </div>

            {/* Desktop/tablet: landscape 1350×760 */}
            <div className="relative hidden sm:block aspect-[1350/760]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`d-${landscapeSrc}`}
                  src={landscapeSrc}
                  alt={displayTitle}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  onError={(e) => {
                    e.currentTarget.src = landscapeThumb(1);
                  }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-6 pointer-events-none">
              <p className="font-bebas text-xl sm:text-3xl text-white leading-none drop-shadow-lg line-clamp-2">
                {displayTitle}
              </p>
              <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/60">
                {current.genre} · {current.duration}
              </p>
            </div>

            {items.length > 1 && (
              <>
                <motion.button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous"
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-sm sm:h-11 sm:w-11"
                  whileTap={{ scale: 0.92 }}
                >
                  <ChevronLeft size={18} strokeWidth={2.5} />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={goNext}
                  aria-label="Next"
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-sm sm:h-11 sm:w-11"
                  whileTap={{ scale: 0.92 }}
                >
                  <ChevronRight size={18} strokeWidth={2.5} />
                </motion.button>
              </>
            )}
          </div>

          {items.length > 1 && (
            <div className="mt-3 sm:mt-4 relative">
              <div className="h-2 rounded-full overflow-hidden bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Thumbnail strip — portrait mobile / landscape desktop */}
        <div
          className="mt-5 sm:mt-7 flex gap-2.5 sm:gap-4 overflow-x-auto pb-2 sm:pb-3 pt-1 -mx-1 px-1 touch-pan-x"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {items.map((item, i) => {
            const active = i === itemIdx;
            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setItemIdx(i)}
                aria-label={item.title}
                className={`relative flex-shrink-0 overflow-hidden rounded-xl border transition-all w-[92px] aspect-[4/5] sm:w-[168px] sm:aspect-[1350/760] ${
                  active
                    ? 'border-cyan-400 ring-2 ring-cyan-400/30 z-10 opacity-100'
                    : 'border-white/10 opacity-85 hover:opacity-100'
                }`}
                style={{ background: '#111' }}
                initial={false}
                animate={{
                  scale: active ? 1.04 : 1,
                  y: active ? -3 : 0,
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                {/* Mobile portrait */}
                <img
                  src={getPortrait(item)}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center sm:hidden"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = portraitThumb(1);
                  }}
                />
                {/* Desktop landscape */}
                <img
                  src={getLandscape(item)}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center hidden sm:block"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = landscapeThumb(1);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {active && (
                  <span className="absolute top-1 left-1 rounded-md bg-cyan-400 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wider text-[#07111f] sm:text-[8px]">
                    Now
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 p-2">
                  <p className="line-clamp-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.14em] text-white/92">
                    {item.title}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
