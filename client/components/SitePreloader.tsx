import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DURATION_MS = 5000;
const STORAGE_KEY = 'si-cosmic-preloader-seen';
const PHASES = [
  'Booting cinematic universe',
  'Loading premium streams',
  'Syncing featured catalog',
  'Launching cosmic experience',
];

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: `${(i * 29) % 100}%`,
  y: `${(i * 47) % 100}%`,
  size: 4 + (i % 4) * 4,
  delay: (i % 6) * 0.18,
  duration: 3.5 + (i % 5) * 0.45,
}));

/** First-visit cosmic preloader aligned with the dark theme. */
export function SitePreloader() {
  const [visible, setVisible] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== '1';
    } catch {
      return true;
    }
  });
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);

  const finish = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
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
    const skipTimer = window.setTimeout(() => setCanSkip(true), 1200);

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
  const phaseIndex = Math.min(PHASES.length - 1, Math.floor(progress * PHASES.length));
  const phaseLabel = useMemo(() => PHASES[phaseIndex], [phaseIndex]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              'radial-gradient(circle at top, rgba(34,211,238,0.14), transparent 28%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.16), transparent 24%), linear-gradient(180deg, #040b14 0%, #07111f 55%, #091525 100%)',
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
          <div className="absolute inset-0 pointer-events-none opacity-[0.10]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '110px 110px' }} />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 70% 48% at 50% 36%, rgba(34,211,238,0.18), transparent 62%), radial-gradient(ellipse 55% 40% at 100% 100%, rgba(59,130,246,0.16), transparent 55%)',
            }}
          />

          {PARTICLES.map((particle) => (
            <motion.span
              key={particle.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                background: particle.id % 3 === 0 ? '#67e8f9' : particle.id % 3 === 1 ? '#93c5fd' : '#ffffff',
                opacity: 0.3,
                boxShadow: '0 0 14px rgba(103,232,249,0.3)',
              }}
              animate={{ y: [0, -24, 0], opacity: [0.15, 0.7, 0.15], scale: [0.85, 1.08, 0.9] }}
              transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: 'easeInOut' }}
            />
          ))}

          <motion.div
            className="absolute w-[min(78vw,360px)] aspect-square rounded-full pointer-events-none"
            style={{
              background:
                'conic-gradient(from 180deg, rgba(34,211,238,0.1), rgba(59,130,246,0.32), rgba(34,211,238,0.1))',
              boxShadow: '0 0 80px rgba(34,211,238,0.18)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute w-[min(62vw,290px)] aspect-square rounded-full border border-cyan-300/20 pointer-events-none"
            animate={{ rotate: -360, scale: [1, 1.03, 1] }}
            transition={{ rotate: { duration: 22, repeat: Infinity, ease: 'linear' }, scale: { duration: 4.6, repeat: Infinity, ease: 'easeInOut' } }}
          />

          <div className="absolute inset-3 sm:inset-5 rounded-[28px] border border-white/10 pointer-events-none" />
          <div className="absolute inset-5 sm:inset-8 rounded-[24px] border border-cyan-300/12 pointer-events-none" />

          {/* Main composition */}
          <div className="relative z-10 flex w-full max-w-[22rem] sm:max-w-md flex-col items-center text-center px-2">
            <motion.div
              className="mb-6 sm:mb-7 rounded-[28px] border border-white/10 bg-white/5 px-6 py-5 shadow-[0_24px_70px_rgba(2,6,23,0.45)] backdrop-blur-xl"
              initial={{ opacity: 0, scale: 0.82, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <img
                src="/logo.png"
                alt="StreamsIndia"
                className="h-12 sm:h-14 w-auto max-w-[220px] object-contain mx-auto drop-shadow-[0_0_28px_rgba(34,211,238,0.25)]"
                draggable={false}
                decoding="async"
              />
            </motion.div>

            <motion.h1
              className="font-bebas leading-[0.88] tracking-wide text-white"
              style={{
                fontSize: 'clamp(2.75rem, 13vw, 4.5rem)',
                textShadow: '0 12px 28px rgba(0,0,0,0.45)',
              }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.06 }}
            >
              Streams
              <span className="text-cyan-300">India</span>
            </motion.h1>

            <motion.p
              className="mt-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.28em] text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              Movies · Live · Sports · Series
            </motion.p>

            <motion.p
              className="mt-4 text-xs sm:text-sm text-white/72"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32 }}
            >
              {phaseLabel}
            </motion.p>

            {/* Progress */}
            <div className="mt-8 sm:mt-10 w-full rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 shadow-[0_20px_60px_rgba(2,6,23,0.3)] backdrop-blur-xl">
              <div className="flex items-end justify-between gap-3 mb-2.5">
                <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/45">
                  Loading
                </span>
                <span className="font-bebas text-2xl leading-none text-white tabular-nums">
                  {remaining}
                  <span className="text-sm text-white/35 ml-0.5">s</span>
                </span>
              </div>

              <div
                className="relative h-3 overflow-hidden rounded-full border border-cyan-200/15 bg-white/10"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
              >
                <div
                  className="absolute inset-y-0 left-0 transition-[width] duration-75 ease-linear"
                  style={{
                    width: `${pct}%`,
                    backgroundImage:
                      'linear-gradient(90deg, #22d3ee 0%, #60a5fa 55%, #818cf8 100%)',
                    boxShadow: '0 0 22px rgba(34,211,238,0.45)',
                  }}
                />
              </div>

              <p className="mt-2 text-[10px] font-medium tabular-nums text-white/40">
                {pct}%
              </p>
            </div>

            <AnimatePresence>
              {canSkip && (
                <motion.button
                  type="button"
                  onClick={finish}
                  className="mt-6 sm:mt-7 rounded-full border border-cyan-300/25 bg-cyan-400/15 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-[0_14px_30px_rgba(34,211,238,0.18)] backdrop-blur-md"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  Enter site
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <motion.span
            className="hidden sm:block absolute top-[18%] left-[8%] font-bebas text-4xl text-transparent select-none pointer-events-none"
            style={{ WebkitTextStroke: '1.5px rgba(103,232,249,0.32)' }}
            animate={{ rotate: [-12, -6, -12], scale: [1, 1.06, 1] }}
            transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          >
            STAR
          </motion.span>
          <motion.span
            className="hidden sm:block absolute bottom-[16%] right-[9%] font-bebas text-4xl text-transparent select-none pointer-events-none"
            style={{ WebkitTextStroke: '1.5px rgba(147,197,253,0.3)' }}
            animate={{ rotate: [10, 16, 10], scale: [1, 1.08, 1] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            aria-hidden
          >
            GLOW
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
