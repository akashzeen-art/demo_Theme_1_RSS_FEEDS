// FooterSection — cosmic dark StreamsIndia footer
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CATEGORY_LINKS = [
  { href: '/reels', label: 'Reels' },
  { href: '/live', label: 'Live' },
  { href: '/sports', label: 'Sports' },
  { href: '/movies', label: 'Movies' },
  { href: '/webseries', label: 'Web Series' },
];

const LEGAL_LINKS = [
  { href: '/terms', label: 'Terms of Services' },
  { href: '/refund', label: 'Refund Policy' },
  { href: '/privacy', label: 'Privacy Policy' },
];

export function FooterSection() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#050b14]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-48 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/5 h-40 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.35), transparent), radial-gradient(1px 1px at 70% 60%, rgba(34,211,238,0.35), transparent), radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.2), transparent)',
            backgroundSize: '100% 100%',
          }}
        />
      </div>

      <div className="relative h-36 sm:h-48 md:h-56 overflow-hidden z-10 border-t border-white/8">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-[#07111f]/50 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <motion.img
            src="/logo.png"
            alt="StreamsIndia"
            className="h-16 sm:h-24 md:h-28 w-auto object-contain select-none drop-shadow-[0_0_24px_rgba(34,211,238,0.25)]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />
          <motion.p
            className="text-xs sm:text-sm font-orbitron uppercase tracking-[0.3em] mt-3 text-cyan-300/90"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Movies · Series · Live · Sports · Reels
          </motion.p>
        </div>
      </div>

      <div className="border-t border-white/10 relative z-10 bg-[#07111f]/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <motion.div
            className="flex flex-col items-center text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <p className="text-white/55 text-sm sm:text-base max-w-xs leading-relaxed">
              Your all-in-one OTT destination — movies, series, live, sports and more
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[10px] sm:text-xs font-medium uppercase tracking-widest">
              {CATEGORY_LINKS.map((link, i, arr) => (
                <span key={link.href} className="flex items-center gap-3">
                  <Link
                    to={link.href}
                    className="text-white/80 hover:text-cyan-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                  {i < arr.length - 1 && <span className="text-white/20">·</span>}
                </span>
              ))}
            </div>

            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full" />

            <div className="border-t border-white/10 pt-6 w-full space-y-3">
              <p className="text-white/40 text-xs sm:text-sm">
                Copyright © 2026, Alphamovil Digital Solutions LLP All Rights Reserved
              </p>

              <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
                {LEGAL_LINKS.map((link, i) => (
                  <span key={link.href} className="flex items-center gap-2 sm:gap-3">
                    <Link
                      to={link.href}
                      className="text-white/45 hover:text-cyan-300 transition-colors font-orbitron uppercase tracking-widest text-[10px] sm:text-xs"
                    >
                      {link.label}
                    </Link>
                    {i < LEGAL_LINKS.length - 1 && (
                      <span className="text-white/20">|</span>
                    )}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]"
                  animate={{ opacity: [1, 0.35, 1], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <p className="text-[10px] text-white/40 font-orbitron tracking-widest">
                  All systems operational
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
