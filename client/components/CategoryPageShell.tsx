import { ReactNode, useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { BurgerMenu } from '@/components/BurgerMenu';
import { CategoryNav } from '@/components/CategoryNav';
import { FooterSection } from '@/sections/FooterSection';

interface CategoryPageShellProps {
 badge: string;
 title: string;
 subtitle: string;
 heroImage?: string;
 children: ReactNode;
}

export function CategoryPageShell({
 badge,
 title,
 subtitle,
 heroImage,
 children,
}: CategoryPageShellProps) {
 const [scrollProgress, setScrollProgress] = useState(0);

 useEffect(() => {
 const handleScroll = () => {
 const max = document.documentElement.scrollHeight - window.innerHeight;
 if (max > 0) setScrollProgress((window.scrollY / max) * 100);
 };
 window.addEventListener('scroll', handleScroll, { passive: true });
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 return (
 <div className="relative min-h-screen w-full overflow-x-hidden text-white bg-[#050b14]">
 <AnimatedBackground />
 <BurgerMenu />
 <CategoryNav />

 <div className="fixed top-0 left-0 right-0 h-1 z-[95] origin-left overflow-hidden">
 <div
          className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)] transition-transform duration-150"
 style={{ transform: `scaleX(${scrollProgress / 100})`, transformOrigin: 'left' }}
 />
 </div>

 {scrollProgress > 20 && (
 <button
 onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-40 w-12 h-12 rounded-full text-[#07111f] flex items-center justify-center transition-transform hover:scale-110 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
 aria-label="Scroll to top"
 >
 <ChevronUp size={18} />
 </button>
 )}

 <div className="relative z-10 pt-[96px] sm:pt-[108px] lg:pt-16">
 <header className="relative px-4 sm:px-8 lg:px-12 pb-8 sm:pb-12 overflow-hidden">
 {heroImage && (
 <div className="absolute inset-0 opacity-40">
 <img src={heroImage} alt="" className="w-full h-full object-cover" />
 <div className="absolute inset-0 bg-gradient-to-r from-[#050b14] via-[#07111f]/85 to-transparent" />
 <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-[#050b14]/40" />
 </div>
 )}
          <div className="relative max-w-7xl mx-auto py-8 sm:py-12">
            <p className="text-cyan-300 text-[10px] sm:text-xs uppercase tracking-[0.35em] mb-3 font-medium">
              {badge}
            </p>
            <h1 className="font-bebas text-5xl sm:text-7xl md:text-8xl tracking-wide text-white leading-none">
              {title}
            </h1>
            <p className="mt-3 text-white/55 max-w-xl text-sm sm:text-base">{subtitle}</p>
            <div className="h-1 w-20 mt-5 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.45)]" />
          </div>
 </header>

 {children}
 <FooterSection />
 </div>
 </div>
 );
}
