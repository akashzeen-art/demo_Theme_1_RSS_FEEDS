import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Loader2, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import {
  RSS_CATEGORIES,
  getEnabledRssCategories,
  type RssFeedConfig,
  type RssVideoItem,
} from '@/lib/rssFeeds';
import { fetchCategoryRss } from '@/lib/fetchRss';
import { StreamPlayer } from '@/components/StreamPlayer';

const FALLBACK_SLIDE_MS = 90000;
const FEED_LIMIT = 8;

function cleanTitle(title: string) {
  return title
    .replace(/\bYouTube\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s\-–—|·]+|[\s\-–—|·]+$/g, '')
    .trim();
}

function useHeroRss(category: RssFeedConfig) {
  const [items, setItems] = useState<RssVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCategoryRss(category.id, FEED_LIMIT)
      .then((data) => {
        if (!cancelled) {
          setItems(
            data.map((item) => ({
              ...item,
              title: cleanTitle(item.title),
              author: cleanTitle(item.author || ''),
            }))
          );
          setError(null);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setItems([]);
          setError(err.message || 'Feed unavailable');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category.id]);

  return { items, loading, error };
}

interface HeroSectionProps {
  onEnter?: () => void;
}

/** Crazy comic-action hero — impact type, bursts, ink frame */
export function HeroSection({ onEnter }: HeroSectionProps) {
  const category =
    getEnabledRssCategories().find((c) => c.id === 'live') ??
    getEnabledRssCategories()[0] ??
    RSS_CATEGORIES[0];
  const { items, loading, error } = useHeroRss(category);

  const [itemIdx, setItemIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (itemIdx >= items.length && items.length > 0) setItemIdx(0);
  }, [items, itemIdx]);

  const current = items[itemIdx] ?? null;
  const displayTitle = cleanTitle(current?.title || category.title);
  const currentIsLive = Boolean(current?.isLive || current?.provider === 'live');

  const goPrev = () => {
    if (!items.length) return;
    setItemIdx((i) => (i - 1 + items.length) % items.length);
  };

  const goNext = () => {
    if (!items.length) return;
    setItemIdx((i) => (i + 1) % items.length);
  };

  const handleVideoEnded = () => {
    if (currentIsLive || items.length <= 1) return;
    setProgress(0);
    setItemIdx((i) => (i + 1) % items.length);
  };

  useEffect(() => {
    if (paused || currentIsLive || items.length <= 1) return;
    setProgress(0);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const soft = Math.min(0.95, (now - start) / FALLBACK_SLIDE_MS);
      setProgress((prev) => (prev > soft ? prev : soft));
      if (now - start >= FALLBACK_SLIDE_MS) {
        setItemIdx((i) => (i + 1) % items.length);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [itemIdx, paused, items.length, currentIsLive]);

  const backdrop = useMemo(
    () => current?.thumbnail || `/landscape_new_desicontent/${category.sno}.png`,
    [current, category.sno]
  );

  return (
    <section className="relative w-full overflow-hidden">
      {/* Kinetic backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.img
            key={backdrop}
            src={backdrop}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1, rotate: -1 }}
            animate={{ opacity: 0.22, scale: 1.14, rotate: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-[#fffaf3]/30 via-[#fffaf3]/80 to-[#fffaf3]" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(#111 1.2px, transparent 1.3px)',
            backgroundSize: '18px 18px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent)',
          }}
        />
        {/* Speed rays */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            background:
              'repeating-conic-gradient(from 0deg at 50% 40%, #111 0deg 2deg, transparent 2deg 12deg)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-8 sm:pb-12 overflow-x-clip">
        {/* Impact header */}
        <div className="relative mb-6 sm:mb-8">
          <motion.div
            className="hidden sm:block absolute -top-6 -left-2 sm:-left-6 font-bebas text-[clamp(4rem,18vw,9rem)] leading-none text-transparent select-none pointer-events-none"
            style={{ WebkitTextStroke: '2px rgba(17,17,17,0.07)' }}
            animate={{ x: [0, 8, 0], rotate: [-8, -6, -8] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            ACTION
          </motion.div>

          <motion.div
            className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          >
            <div className="min-w-0 flex-1 relative">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <motion.span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ff0000] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-[4px_4px_0_#111] -rotate-2"
                  animate={{ rotate: [-3, -1, -3], scale: [1, 1.04, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  {currentIsLive ? 'Live' : 'On Air'}
                </motion.span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#ffcc00] text-[#111] text-[10px] font-black uppercase tracking-[0.18em] border-2 border-[#111] shadow-[3px_3px_0_#111] rotate-1">
                  <Zap size={11} className="fill-[#111]" />
                  StreamsIndia
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.h1
                  key={current?.id || 'title'}
                  className="font-bebas text-[#111] tracking-wide leading-[0.88] line-clamp-2 relative"
                  style={{
                    fontSize: 'clamp(1.85rem, 7vw, 4.25rem)',
                    textShadow: '3px 3px 0 #ffcc00, 5px 5px 0 #111',
                  }}
                  initial={{ opacity: 0, x: -24, rotate: -2 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, x: 18, rotate: 2 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  {loading && !current
                    ? 'Loading…'
                    : error && !current
                      ? 'Feed unavailable'
                      : displayTitle}
                </motion.h1>
              </AnimatePresence>
            </div>

            <motion.button
              type="button"
              onClick={onEnter}
              className="w-full sm:w-auto shrink-0 self-stretch sm:self-end inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 bg-[#ff0000] text-white text-xs font-black uppercase tracking-[0.2em] border-[3px] border-[#111] shadow-[4px_4px_0_#111] sm:shadow-[6px_6px_0_#111] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all"
              whileTap={{ scale: 0.97 }}
            >
              <Play size={15} className="fill-white" />
              Watch
            </motion.button>
          </motion.div>
        </div>

        {/* Explosive player stage */}
        <motion.div
          className="relative mx-1 sm:mx-2"
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 18, delay: 0.08 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Stickers — desktop only to avoid clipping on phones */}
          <motion.div
            className="hidden md:block absolute -top-5 -left-8 z-40 font-bebas text-4xl text-[#ff0000] select-none pointer-events-none"
            style={{ textShadow: '2px 2px 0 #111' }}
            animate={{ rotate: [-12, -8, -12], y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            BAM!
          </motion.div>
          <motion.div
            className="hidden md:block absolute -top-4 -right-6 z-40 px-2.5 py-1 bg-[#ffcc00] border-[3px] border-[#111] font-bebas text-2xl text-[#111] select-none pointer-events-none shadow-[3px_3px_0_#111] rotate-6"
            animate={{ rotate: [8, 14, 8], scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          >
            ZAP
          </motion.div>
          <motion.div
            className="hidden md:block absolute -bottom-3 left-[12%] z-40 w-16 h-16 comic-burst pointer-events-none"
            style={{ background: '#ff0000', opacity: 0.55 }}
            animate={{ rotate: [0, 40, 0], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="hidden md:block absolute top-[30%] -right-4 z-40 w-12 h-12 comic-burst pointer-events-none"
            style={{ background: '#ffcc00', opacity: 0.7 }}
            animate={{ rotate: [20, -10, 20], scale: [1, 1.15, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />

          {/* Triple ink frame — lighter on mobile */}
          <div className="absolute -inset-1 sm:-inset-2 bg-[#ffcc00] sm:rotate-1 pointer-events-none" />
          <div className="absolute -inset-1.5 sm:-inset-[5px] bg-[#ff0000] sm:-rotate-[0.6deg] pointer-events-none" />
          <div className="absolute -inset-2 sm:-inset-[9px] bg-[#111] sm:rotate-[0.4deg] pointer-events-none shadow-[6px_6px_0_rgba(17,17,17,0.12)] sm:shadow-[12px_12px_0_rgba(17,17,17,0.15)]" />

          <div className="relative overflow-hidden bg-black border-2 sm:border-[3px] border-[#111]">
            <div className="absolute top-0 left-0 z-20 w-5 h-5 sm:w-8 sm:h-8 border-t-4 border-l-4 border-[#ffcc00] pointer-events-none" />
            <div className="absolute top-0 right-0 z-20 w-5 h-5 sm:w-8 sm:h-8 border-t-4 border-r-4 border-[#ffcc00] pointer-events-none" />
            <div className="absolute bottom-0 left-0 z-20 w-5 h-5 sm:w-8 sm:h-8 border-b-4 border-l-4 border-[#ffcc00] pointer-events-none" />
            <div className="absolute bottom-0 right-0 z-20 w-5 h-5 sm:w-8 sm:h-8 border-b-4 border-r-4 border-[#ffcc00] pointer-events-none" />

            {current?.embedUrl ? (
              <StreamPlayer
                src={current.embedUrl}
                title={displayTitle}
                onEnded={handleVideoEnded}
                onProgress={(ratio) => {
                  if (!paused) setProgress(ratio);
                }}
              />
            ) : (
              <div className="aspect-video bg-[#111] flex items-center justify-center">
                {loading ? (
                  <Loader2 className="w-9 h-9 text-[#ff0000] animate-spin" />
                ) : (
                  <button
                    type="button"
                    onClick={onEnter}
                    className="px-7 py-3.5 bg-[#ff0000] text-white text-xs font-black uppercase tracking-wider border-2 border-white shadow-[4px_4px_0_#ffcc00]"
                  >
                    Browse
                  </button>
                )}
              </div>
            )}

            {items.length > 1 && (
              <>
                <motion.button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous"
                  className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 bg-[#ffcc00] text-[#111] border-2 sm:border-[3px] border-[#111] flex items-center justify-center shadow-[2px_2px_0_#111] sm:shadow-[3px_3px_0_#111]"
                  whileTap={{ scale: 0.92 }}
                >
                  <ChevronLeft size={18} strokeWidth={3} />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={goNext}
                  aria-label="Next"
                  className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 bg-[#ffcc00] text-[#111] border-2 sm:border-[3px] border-[#111] flex items-center justify-center shadow-[2px_2px_0_#111] sm:shadow-[3px_3px_0_#111]"
                  whileTap={{ scale: 0.92 }}
                >
                  <ChevronRight size={18} strokeWidth={3} />
                </motion.button>
              </>
            )}
          </div>

          {items.length > 1 && !currentIsLive && (
            <div className="mt-3 sm:mt-4 relative">
              <div className="h-2.5 sm:h-3 bg-white border-2 sm:border-[3px] border-[#111] overflow-hidden shadow-[2px_2px_0_#111] sm:shadow-[3px_3px_0_#111]">
                <motion.div
                  className="h-full bg-[#ff0000]"
                  style={{
                    width: `${progress * 100}%`,
                    backgroundImage:
                      'repeating-linear-gradient(-45deg, #ff0000 0 8px, #cc0000 8px 16px)',
                  }}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Thumb strip — no tilt on small screens */}
        <div
          className="mt-5 sm:mt-7 flex gap-2.5 sm:gap-4 overflow-x-auto pb-2 sm:pb-3 pt-1 -mx-1 px-1 touch-pan-x"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {loading && items.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[100px] sm:w-[132px] aspect-video bg-[#111]/10 animate-pulse border-2 sm:border-[3px] border-[#111]/20"
                />
              ))
            : items.map((item, i) => {
                const active = i === itemIdx;
                const tilt = active ? 0 : i % 2 === 0 ? -2.5 : 2.5;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => setItemIdx(i)}
                    aria-label={item.title}
                    className={`relative flex-shrink-0 w-[100px] sm:w-[132px] aspect-video overflow-hidden border-2 sm:border-[3px] transition-colors ${
                      active
                        ? 'border-[#ff0000] shadow-[3px_3px_0_#111] z-10'
                        : 'border-[#111] shadow-[2px_2px_0_rgba(17,17,17,0.25)] opacity-80'
                    }`}
                    style={{ background: '#111' }}
                    initial={false}
                    animate={{
                      rotate: typeof window !== 'undefined' && window.innerWidth < 640 ? 0 : tilt,
                      scale: active ? 1.05 : 1,
                      y: active ? -4 : 0,
                    }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  >
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {active && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#ffcc00] border-2 border-[#111] text-[7px] sm:text-[8px] font-black uppercase tracking-wider text-[#111]">
                        Now
                      </span>
                    )}
                  </motion.button>
                );
              })}
        </div>
      </div>
    </section>
  );
}
