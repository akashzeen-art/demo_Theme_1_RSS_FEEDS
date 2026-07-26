import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DURATION_MS = 8000;
const STORAGE_KEY = 'si-preloader-seen';

/**
 * First-open comic splash — 8s, once per browser session.
 * Skip available after a short beat so phones stay usable.
 */
export function SitePreloader() {
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) !== '1';
    } catch {
      return true;
    }
  });
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const start = performance.now();
    let raf = 0;
    let done = false;

    const end = () => {
      if (done) return;
      done = true;
      finish();
    };

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION_MS);
      setProgress(p);
      if (p >= 1) {
        end();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    const skipTimer = window.setTimeout(() => setCanSkip(true), 1600);

    const html = document.documentElement;
    const prevBody = document.body.style.overflow;
    const prevHtml = html.style.overflow;
    document.body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(skipTimer);
      document.body.style.overflow = prevBody;
      html.style.overflow = prevHtml;
    };
  }, [visible, finish]);

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [visible]);

  const remaining = Math.max(0, Math.ceil((1 - progress) * (DURATION_MS / 1000)));
  const pct = Math.round(progress * 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: '#fffaf3',
            paddingTop: 'max(1rem, env(safe-area-inset-top))',
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
            paddingRight: 'max(1rem, env(safe-area-inset-right))',
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Loading StreamsIndia"
          aria-live="polite"
          role="status"
        >
          {/* Atmosphere */}
          <div className="absolute inset-0 comic-halftone opacity-40 pointer-events-none" />
          <div className="absolute inset-0 comic-halftone-red opacity-25 pointer-events-none" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 75% 50% at 50% 40%, rgba(255,204,0,0.35), transparent 62%), radial-gradient(ellipse 55% 40% at 100% 100%, rgba(255,0,0,0.16), transparent 55%)',
            }}
          />

          <motion.div
            className="absolute comic-burst pointer-events-none"
            style={{
              width: 'min(72vw, 280px)',
              aspectRatio: '1',
              background: '#ffcc00',
              opacity: 0.28,
            }}
            animate={{ rotate: [0, 10, 0], scale: [0.96, 1.05, 0.96] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Ink frames */}
          <div className="absolute inset-3 sm:inset-5 border-[3px] border-[#111] pointer-events-none" />
          <div className="absolute inset-5 sm:inset-8 border-2 border-[#ff0000] pointer-events-none" />

          {/* Main composition */}
          <div className="relative z-10 flex w-full max-w-[20rem] sm:max-w-sm flex-col items-center text-center px-2">
            <motion.div
              className="mb-6 sm:mb-7 bg-white border-[3px] border-[#111] p-4 sm:p-5 shadow-[6px_6px_0_#111]"
              initial={{ opacity: 0, scale: 0.82, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <img
                src="/logo.png"
                alt="StreamsIndia"
                className="h-12 sm:h-14 w-auto max-w-[220px] object-contain mx-auto"
                draggable={false}
                decoding="async"
              />
            </motion.div>

            <motion.h1
              className="font-bebas leading-[0.88] tracking-wide text-[#111]"
              style={{
                fontSize: 'clamp(2.75rem, 13vw, 4.25rem)',
                textShadow: '3px 3px 0 #ffcc00, 5px 5px 0 #111',
              }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.06 }}
            >
              Streams
              <span className="text-[#ff0000]">India</span>
            </motion.h1>

            <motion.p
              className="mt-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.28em] text-[#111]/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              Movies · Live · Sports · Series
            </motion.p>

            {/* Progress */}
            <div className="mt-8 sm:mt-10 w-full">
              <div className="flex items-end justify-between gap-3 mb-2.5">
                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#111]/45">
                  Loading
                </span>
                <span className="font-bebas text-2xl leading-none text-[#111] tabular-nums">
                  {remaining}
                  <span className="text-sm text-[#111]/40 ml-0.5">s</span>
                </span>
              </div>

              <div
                className="relative h-4 bg-white border-[3px] border-[#111] overflow-hidden shadow-[3px_3px_0_#111]"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-[#ff0000] transition-[width] duration-75 ease-linear"
                  style={{
                    width: `${pct}%`,
                    backgroundImage:
                      'repeating-linear-gradient(-45deg, #ff0000 0 7px, #cc0000 7px 14px)',
                  }}
                />
              </div>

              <p className="mt-2 text-[10px] font-medium tabular-nums text-[#111]/40">
                {pct}%
              </p>
            </div>

            <AnimatePresence>
              {canSkip && (
                <motion.button
                  type="button"
                  onClick={finish}
                  className="mt-6 sm:mt-7 px-5 py-2.5 bg-[#111] text-white text-[10px] font-bold uppercase tracking-[0.25em] border-[3px] border-[#111] shadow-[3px_3px_0_#ff0000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Enter site
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Corner stickers — desktop only so mobile stays clean */}
          <motion.span
            className="hidden sm:block absolute top-[18%] left-[8%] font-bebas text-4xl text-transparent select-none pointer-events-none"
            style={{ WebkitTextStroke: '2.5px #111' }}
            animate={{ rotate: [-12, -6, -12], scale: [1, 1.06, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          >
            BAM
          </motion.span>
          <motion.span
            className="hidden sm:block absolute bottom-[16%] right-[9%] font-bebas text-4xl text-transparent select-none pointer-events-none"
            style={{ WebkitTextStroke: '2.5px #ff0000' }}
            animate={{ rotate: [10, 16, 10], scale: [1, 1.08, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            aria-hidden
          >
            ZAP
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
