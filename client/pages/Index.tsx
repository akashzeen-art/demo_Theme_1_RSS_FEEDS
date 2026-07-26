import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

import { BurgerMenu } from '@/components/BurgerMenu';
import { CategoryNav } from '@/components/CategoryNav';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { SectionDivider } from '@/components/SectionDivider';
import { HeroSection } from '@/sections/HeroSection';
import { CategoryLaunchSection } from '@/sections/CategoryLaunchSection';
import { HomeCategoryRssBlocks } from '@/sections/HomeCategoryRss';
import { FeaturedSection } from '@/sections/FeaturedSection';
import { TopPicksSection } from '@/sections/TopPicksSection';
import { ActionSection } from '@/sections/ActionSection';
import { MostWatchedSection } from '@/sections/MostWatchedSection';
import { BestOfWeekSection } from '@/sections/BestOfWeekSection';
import { CriticsChoiceSection } from '@/sections/CriticsChoiceSection';
import { TrendingSection } from '@/sections/TrendingSection';
import { RomanceSection } from '@/sections/RomanceSection';
import { ThrillerSection } from '@/sections/ThrillerSection';
import { NewReleasesSection } from '@/sections/NewReleasesSection';
import { StaffPicksSection } from '@/sections/StaffPicksSection';
import { FooterSection } from '@/sections/FooterSection';

export default function Index() {
 const [scrollProgress, setScrollProgress] = useState(0);

 useEffect(() => {
 const handleScroll = () => {
 const max = document.documentElement.scrollHeight - window.innerHeight;
 if (max > 0) setScrollProgress((window.scrollY / max) * 100);
 };
 window.addEventListener('scroll', handleScroll, { passive: true });
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 const scrollToContent = () => {
 document.getElementById('rss-feeds')?.scrollIntoView({ behavior: 'smooth' });
 };

 return (
 <div className="relative w-full overflow-x-hidden">
 <AnimatedBackground />

 <BurgerMenu />
 <CategoryNav />

 <div className="fixed top-0 left-0 right-0 h-1 z-[95] origin-left overflow-hidden">
 <div
          className="h-full bg-[#ff0000] transition-transform duration-150"
 style={{
 transform: `scaleX(${scrollProgress / 100})`,
 transformOrigin: 'left',
 }}
 />
 </div>

 {scrollProgress > 20 && (
 <button
 onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 sm:bottom-8 sm:right-8 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white flex items-center justify-center transition-transform hover:scale-110 bg-[#ff0000] shadow-lg border-2 border-[#111]"
 aria-label="Scroll to top"
 >
 <ChevronUp size={18} />
 </button>
 )}

 <div className="relative z-10 pt-[100px] sm:pt-[108px] lg:pt-16">
 <HeroSection onEnter={scrollToContent} />

 <CategoryLaunchSection />

 {/* RSS feeds — all categories */}
 <div id="rss-feeds" className="pt-2">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
 <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#ff0000]">
 Live RSS Feeds
 </p>
 <h2 className="font-bebas text-3xl sm:text-5xl text-[#0f0f0f] tracking-wide leading-none mt-1">
 Watch by category
 </h2>
 </div>
 <HomeCategoryRssBlocks />
 </div>

 <SectionDivider colors="from-transparent via-red-500/50 to-transparent" />

 {/* Catalog rows */}
 <div id="featured-section">
 <FeaturedSection />
 </div>

 <SectionDivider colors="from-transparent via-rose-500/40 to-transparent" />
 <TopPicksSection />
 <SectionDivider colors="from-transparent via-amber-500/40 to-transparent" />
 <ActionSection />
 <SectionDivider colors="from-transparent via-orange-500/40 to-transparent" />
 <TrendingSection />
 <RomanceSection />

 <SectionDivider colors="from-transparent via-red-600/40 to-transparent" />
 <MostWatchedSection />
 <ThrillerSection />

 <SectionDivider colors="from-transparent via-rose-500/40 to-transparent" />
 <BestOfWeekSection />
 <CriticsChoiceSection />
 <NewReleasesSection />
 <StaffPicksSection />
 <FooterSection />
 </div>
 </div>
 );
}
