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

/** YouTube-style red + white header — flat, no blur */
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
 className={`fixed top-0 left-0 right-0 z-[100] bg-white border-b border-[#e5e5e5] transition-shadow ${
 scrolled ? 'shadow-sm' : ''
 }`}
 style={{ paddingTop: 'env(safe-area-inset-top)' }}
 >
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
 isActive ? 'text-[#ff0000]' : 'text-[#606060] hover:text-[#0f0f0f]'
 }`
 }
 >
 {({ isActive }) => (
 <>
 <Icon
 size={13}
 className={isActive ? 'text-[#ff0000]' : 'text-[#909090] group-hover:text-[#0f0f0f]'}
 />
 <span>{cat.label}</span>
 {cat.icon === 'live' && (
 <span className="relative flex h-1.5 w-1.5 ml-0.5">
 <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff0000]" />
 </span>
 )}
 <span
 className={`absolute left-2 right-2 -bottom-0.5 h-0.5 rounded-full transition-all ${
 isActive ? 'bg-[#ff0000]' : 'bg-transparent group-hover:bg-[#e5e5e5]'
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
 className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-full border border-[#e5e5e5] bg-white text-[#0f0f0f] hover:bg-[#f2f2f2] transition-colors text-[10px] font-medium uppercase tracking-wider"
 >
 <User size={14} />
 Account
 </button>

 <button
 type="button"
 onClick={() => setOpen(true)}
 className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-[#ff0000] hover:bg-[#cc0000] border-0"
 aria-label="Open menu"
 >
 <Menu size={18} />
 </button>
 </div>
 </div>

 <div className="lg:hidden border-t border-[#e5e5e5] bg-[#f9f9f9]">
 <div
 ref={scrollerRef}
 className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto"
 style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
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
 ? 'bg-[#ff0000] text-white border-[#ff0000]'
 : 'bg-white text-[#606060] border-[#e5e5e5] hover:text-[#0f0f0f]'
 }`
 }
 >
 <Icon size={11} />
 {cat.label}
 {cat.icon === 'live' && (
 <span className="w-1.5 h-1.5 rounded-full bg-white" />
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
 className="fixed inset-0 z-[110] bg-black/40"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setOpen(false)}
 />

 <motion.aside
 className="fixed top-0 right-0 h-full w-[min(100vw-2.5rem,20rem)] z-[111] flex flex-col px-6 sm:px-7 py-8 border-l border-[#e5e5e5] overflow-y-auto bg-white"
 style={{
 paddingTop: 'max(2rem, env(safe-area-inset-top))',
 paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
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
 className="w-9 h-9 rounded-full border border-[#e5e5e5] flex items-center justify-center text-[#606060] hover:bg-[#f2f2f2]"
 aria-label="Close menu"
 >
 <X size={18} />
 </button>
 </div>

 <p className="text-[#ff0000] text-[10px] uppercase tracking-[0.35em] font-medium mb-3">
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
 className={`flex items-center gap-3 text-left py-3 px-2 rounded-lg text-sm uppercase tracking-widest border-b border-[#e5e5e5] transition-colors ${
 active
 ? 'text-[#ff0000] bg-[#fff0f0]'
 : 'text-[#0f0f0f] hover:bg-[#f2f2f2]'
 }`}
 initial={{ opacity: 0, x: 16 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: i * 0.04 }}
 >
 <Icon size={16} className={active ? 'text-[#ff0000]' : 'text-[#909090]'} />
 {link.label}
 {link.icon === 'live' && (
 <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ff0000]" />
 )}
 </motion.button>
 );
 })}
 </nav>

 <p className="text-[#909090] text-[10px] uppercase tracking-[0.35em] mt-8 mb-3">
 More
 </p>
 <nav className="flex flex-col gap-0.5">
 {EXTRA.map((link) => (
 <button
 key={link.path}
 type="button"
 onClick={() => go(link.path)}
 className="text-left py-2.5 px-2 text-[#606060] text-xs uppercase tracking-widest border-b border-[#e5e5e5] hover:text-[#0f0f0f] transition-colors"
 >
 {link.label}
 </button>
 ))}
 </nav>

 <div className="mt-auto pt-8 space-y-3">
 <div className="h-px bg-[#e5e5e5]" />
 <p className="text-[10px] text-[#909090] tracking-widest">
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
