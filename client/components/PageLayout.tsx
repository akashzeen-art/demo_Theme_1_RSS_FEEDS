import { ReactNode } from 'react';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { BurgerMenu } from '@/components/BurgerMenu';
import { CategoryNav } from '@/components/CategoryNav';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  badge?: string;
}

export function PageLayout({ children, title, subtitle, badge }: PageLayoutProps) {
  return (
    <div className="relative min-h-screen text-white w-full overflow-x-hidden bg-[#050b14]">
      <AnimatedBackground />
      <BurgerMenu />
      <CategoryNav />

      {(title || badge) && (
        <div className="relative z-10 w-full border-b border-white/10 bg-[#07111f]/70 backdrop-blur-sm px-4 sm:px-12 pt-[7.5rem] sm:pt-32 lg:pt-24 pb-8 sm:pb-16">
          {badge && (
            <p className="text-cyan-300 text-[10px] sm:text-xs uppercase tracking-[0.35em] mb-3 sm:mb-4 font-medium">{badge}</p>
          )}
          {title && (
            <h1 className="font-bebas text-4xl sm:text-7xl tracking-wide leading-none mb-2 sm:mb-3 text-white">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-white/55 text-xs sm:text-sm uppercase tracking-widest leading-relaxed max-w-xl">{subtitle}</p>
          )}
          <div className="h-1 w-20 sm:w-24 mt-4 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.45)]" />
        </div>
      )}

      <main className="relative z-10">{children}</main>
    </div>
  );
}
