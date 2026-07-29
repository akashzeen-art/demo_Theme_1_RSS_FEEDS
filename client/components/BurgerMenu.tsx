import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Menu,
  Home,
  Clapperboard,
  Radio,
  Trophy,
  Film,
  Tv,
  User,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/catalog';

const EXTRA = [
  { label: 'My Account', path: '/account' },
  { label: 'About Us', path: '/about' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Privacy Policy', path: '/privacy' },
];

const ICONS: Record<string, typeof Home> = {
  home: Home,
  reels: Clapperboard,
  live: Radio,
  sports: Trophy,
  movies: Film,
  series: Tv,
};

/** Cosmic dark header — deep navy + cyan accents */
export function BurgerMenu() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const el = scrollerRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [location.pathname]);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled
            ? 'bg-[#050b14]/95 border-b border-cyan-400/15 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl'
            : 'bg-[#050b14]/88 border-b border-white/8 backdrop-blur-md'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 left-1/4 h-32 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute -top-10 right-1/4 h-24 w-40 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="relative flex items-center gap-3 sm:gap-5 px-3 sm:px-6 lg:px-8 h-14 sm:h-16">
          <button
            type="button"
            onClick={() => go('/')}
            className="shrink-0 focus:outline-none"
            aria-label="StreamsIndia Home"
          >
            <img
              src="/logo.png"
              alt="StreamsIndia"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </button>

          <nav
            className="hidden lg:flex flex-1 items-center justify-center gap-0.5 xl:gap-1 min-w-0"
            aria-label="Main categories"
          >
            {CATEGORIES.map((cat) => {
              const Icon = ICONS[cat.icon] || Home;
              return (
                <NavLink
                  key={cat.path}
                  to={cat.path}
                  end={cat.path === '/'}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-1.5 px-2.5 xl:px-3.5 py-2 rounded-lg text-[11px] xl:text-xs font-medium uppercase tracking-[0.08em] transition-colors whitespace-nowrap ${
                      isActive
                        ? 'text-cyan-300'
                        : 'text-white/55 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={13}
                        className={
                          isActive
                            ? 'text-cyan-300'
                            : 'text-white/40 group-hover:text-white/80'
                        }
                      />
                      <span>{cat.label}</span>
                      {cat.icon === 'live' && (
                        <span className="relative flex h-1.5 w-1.5 ml-0.5">
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-300" />
                        </span>
                      )}
                      <span
                        className={`absolute left-2 right-2 -bottom-0.5 h-0.5 rounded-full transition-all ${
                          isActive
                            ? 'bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.6)]'
                            : 'bg-transparent group-hover:bg-white/20'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => go('/account')}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/15 bg-white/5 text-white/85 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-200 transition-colors text-[10px] font-medium uppercase tracking-wider"
            >
              <User size={14} />
              Account
            </button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full text-[#07111f] bg-cyan-400 hover:bg-cyan-300 border-0 shadow-[0_0_16px_rgba(34,211,238,0.35)]"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        <div className="lg:hidden border-t border-white/8 bg-[#07111f]/90">
          <div
            ref={scrollerRef}
            className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto"
            style={
              {
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
              } as React.CSSProperties
            }
            aria-label="Browse categories"
          >
            {CATEGORIES.map((cat) => {
              const Icon = ICONS[cat.icon] || Home;
              return (
                <NavLink
                  key={cat.path}
                  to={cat.path}
                  end={cat.path === '/'}
                  data-active={
                    location.pathname === cat.path ||
                    (cat.path !== '/' && location.pathname.startsWith(cat.path))
                      ? 'true'
                      : undefined
                  }
                  className={({ isActive }) =>
                    `flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-wider whitespace-nowrap transition-colors border ${
                      isActive
                        ? 'bg-cyan-400 text-[#07111f] border-cyan-400'
                        : 'bg-white/5 text-white/60 border-white/10 hover:text-white hover:border-white/25'
                    }`
                  }
                >
                  <Icon size={11} />
                  {cat.label}
                  {cat.icon === 'live' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[110] bg-[#050b14]/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.aside
              className="fixed top-0 right-0 h-full w-[min(100vw-2.5rem,20rem)] z-[111] flex flex-col px-6 sm:px-7 py-8 border-l border-cyan-400/15 overflow-y-auto bg-[#07111f]"
              style={{
                paddingTop: 'max(2rem, env(safe-area-inset-top))',
                paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
                backgroundImage:
                  'radial-gradient(circle at top right, rgba(34,211,238,0.12), transparent 40%), radial-gradient(circle at bottom left, rgba(59,130,246,0.1), transparent 35%)',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <div className="flex items-center justify-between mb-8">
                <img src="/logo.png" alt="" className="h-8 w-auto object-contain" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-cyan-300 text-[10px] uppercase tracking-[0.35em] font-medium mb-3">
                Browse
              </p>
              <nav className="flex flex-col gap-0.5">
                {CATEGORIES.map((link, i) => {
                  const Icon = ICONS[link.icon] || Home;
                  const active =
                    link.path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(link.path);
                  return (
                    <motion.button
                      key={link.path}
                      type="button"
                      onClick={() => go(link.path)}
                      className={`flex items-center gap-3 text-left py-3 px-2 rounded-lg text-sm uppercase tracking-widest border-b border-white/8 transition-colors ${
                        active
                          ? 'text-cyan-300 bg-cyan-400/10'
                          : 'text-white/85 hover:bg-white/5'
                      }`}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Icon
                        size={16}
                        className={active ? 'text-cyan-300' : 'text-white/40'}
                      />
                      {link.label}
                      {link.icon === 'live' && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-300" />
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              <p className="text-white/40 text-[10px] uppercase tracking-[0.35em] mt-8 mb-3">
                More
              </p>
              <nav className="flex flex-col gap-0.5">
                {EXTRA.map((link) => (
                  <button
                    key={link.path}
                    type="button"
                    onClick={() => go(link.path)}
                    className="text-left py-2.5 px-2 text-white/55 text-xs uppercase tracking-widest border-b border-white/8 hover:text-cyan-200 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </nav>

              <div className="mt-auto pt-8 space-y-3">
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
                <p className="text-[10px] text-white/35 tracking-widest">
                  © 2026 Alphamovil Digital Solutions LLP
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
