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
    <div className="relative min-h-screen text-[#0f0f0f] w-full overflow-x-hidden bg-white">
      <AnimatedBackground />
      <BurgerMenu />
      <CategoryNav />

      {(title || badge) && (
        <div className="relative z-10 w-full border-b border-[#e5e5e5] bg-white px-4 sm:px-12 pt-[7.5rem] sm:pt-32 lg:pt-24 pb-8 sm:pb-16">
          {badge && (
            <p className="text-[#ff0000] text-[10px] sm:text-xs uppercase tracking-[0.35em] mb-3 sm:mb-4 font-medium">{badge}</p>
          )}
          {title && (
            <h1 className="font-bebas text-4xl sm:text-7xl tracking-wide leading-none mb-2 sm:mb-3 text-[#0f0f0f]">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-[#606060] text-xs sm:text-sm uppercase tracking-widest leading-relaxed max-w-xl">{subtitle}</p>
          )}
          <div className="h-1 w-20 sm:w-24 mt-4 bg-[#ff0000] rounded-full" />
        </div>
      )}

      <main className="relative z-10">{children}</main>
    </div>
  );
}
