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
 document.getElementById('featured-section')?.scrollIntoView({ behavior: 'smooth' });
 };

 return (
 <div className="relative w-full overflow-x-hidden bg-[#07111f] text-white">
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

 {/* My content first */}
 <div id="featured-section">
 <FeaturedSection />
 </div>

 <SectionDivider colors="from-transparent via-cyan-500/35 to-transparent" />
 <TopPicksSection />
 <SectionDivider colors="from-transparent via-teal-500/35 to-transparent" />
 <ActionSection />
 <SectionDivider colors="from-transparent via-sky-500/35 to-transparent" />
 <TrendingSection />
 <RomanceSection />

 <SectionDivider colors="from-transparent via-cyan-500/35 to-transparent" />
 <MostWatchedSection />
 <ThrillerSection />

 <SectionDivider colors="from-transparent via-teal-500/35 to-transparent" />
 <BestOfWeekSection />
 <CriticsChoiceSection />
 <NewReleasesSection />
 <StaffPicksSection />

 <SectionDivider colors="from-transparent via-white/10 to-transparent" />

 <CategoryLaunchSection />

 {/* RSS feeds lower on page */}
 <div id="rss-feeds" className="pt-6 sm:pt-10">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
 <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-cyan-300">
 Global Entertainment Feeds
 </p>
 <h2 className="font-bebas text-3xl sm:text-5xl text-white tracking-wide leading-none mt-1">
 Watch by category
 </h2>
 <p className="mt-2 max-w-xl text-xs sm:text-sm text-white/55">
 Your hardcoded catalog content appears first. These lower feed blocks are for global entertainment discovery around Hollywood, celebrity chatter, international fandom, Europe, Native voices and Latin pop culture.
 </p>
 <p className="mt-2 max-w-2xl text-[11px] sm:text-xs text-white/35 leading-relaxed">
 Demo presentation only. RSS and live feed references here are for entertainment discovery and non-commercial showcase use, not positioned as owned or commercial editorial streams.
 </p>
 </div>
 <HomeCategoryRssBlocks />
 </div>
 <FooterSection />
 </div>
 </div>
 );
}
