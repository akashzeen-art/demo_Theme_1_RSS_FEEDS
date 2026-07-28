import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
 Radio,
 ChevronRight,
 Home,
 Clapperboard,
 Trophy,
 Film,
 Tv,
 type LucideIcon,
} from 'lucide-react';
import { getEnabledRssCategories, type RssCategoryId } from '@/lib/rssFeeds';

const ICONS: Record<RssCategoryId | 'home', LucideIcon> = {
 home: Home,
 reels: Clapperboard,
 live: Radio,
 sports: Trophy,
 movies: Film,
 webseries: Tv,
};

/** Category-wise thumbnail sets from StreamsIndia catalog */
const CATEGORY_THUMBS: Record<RssCategoryId | 'home', number[]> = {
 home: [1, 13, 31, 51],
 reels: [71, 72, 73, 74],
 live: [51, 52, 53, 55],
 sports: [31, 32, 33, 37],
 movies: [1, 2, 5, 7],
 webseries: [13, 19, 14, 15],
};

const HOME_CARD = {
 id: 'home' as const,
 title: 'Home',
 subtitle: 'Featured live hub',
 path: '#browse-categories',
 pagePath: '/',
 accent: 'from-red-600 to-rose-800',
 badge: 'Hub',
};

function thumbSrc(sno: number) {
 return `/potrait_new_desicontent/${sno}.png`;
}

function CategoryThumbCollage({
 snos,
 title,
}: {
 snos: number[];
 title: string;
}) {
 const [hero, ...rest] = snos;
 const side = rest.slice(0, 3);

 return (
 <div className="absolute inset-0">
 {/* Hero poster */}
 <img
 src={thumbSrc(hero)}
 alt={title}
 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
 loading="lazy"
 />

 {/* Category-wise side strip — hide on very small cards */}
 <div className="absolute top-3 right-3 bottom-24 w-[28%] hidden sm:flex flex-col gap-1.5 z-[2]">
 {side.map((sno, i) => (
 <motion.div
 key={sno}
 className="relative flex-1 min-h-0 rounded-lg overflow-hidden border border-white/25 shadow-lg shadow-black/50"
 initial={{ opacity: 0, x: 12 }}
 whileInView={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.12 + i * 0.06 }}
 viewport={{ once: true }}
 >
 <img
 src={thumbSrc(sno)}
 alt=""
 className="w-full h-full object-cover"
 loading="lazy"
 />
 <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
 </motion.div>
 ))}
 </div>

 {/* Soft film grain wash — keep art readable */}
 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/20" />
 <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
 </div>
 );
}

/** Cool category launch grid with category-wise thumbnail collages */
export function CategoryLaunchSection() {
 const cards = [
 HOME_CARD,
 ...getEnabledRssCategories().map((cat) => ({
 id: cat.id,
 title: cat.title,
 subtitle: cat.subtitle,
 path: `#section-${cat.id}`,
 pagePath: cat.path,
 accent: cat.accent,
 badge: cat.badge,
 })),
 ];

 return (
 <section id="browse-categories" className="relative py-12 md:py-16">
 <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <motion.div
 className="mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
 initial={{ opacity: 0, y: 16 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 >
 <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300" />
              </span>
              <p className="text-cyan-300 text-[10px] sm:text-xs uppercase tracking-[0.35em] font-medium">
                Live TV Guide
              </p>
            </div>
            <h2 className="text-4xl md:text-6xl font-bebas tracking-wide text-white leading-none">
              Browse by <span className="text-cyan-300">Category</span>
            </h2>
            <p className="text-white/55 text-xs sm:text-sm mt-2 max-w-md">
              Pick a world — each channel streams live feeds from StreamsIndia.
            </p>
            <div className="h-0.5 w-24 mt-3 bg-cyan-300" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-medium">
            {cards.length} Channels
          </p>
 </motion.div>

 <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
 {cards.map((cat, i) => {
 const Icon = ICONS[cat.id] || Film;
 const thumbs = CATEGORY_THUMBS[cat.id] || [1, 2, 3, 4];

 return (
 <motion.div
 key={cat.id}
 initial={{ opacity: 0, y: 24 }}
 whileInView={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.05, duration: 0.45 }}
 viewport={{ once: true }}
 className="group relative"
 >
 <a
 href={cat.path}
                  className="relative block aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden border border-[#e5e5e5] bg-white transition-all duration-300 hover:border-[#ff0000] hover:shadow-md hover:-translate-y-0.5"
 >
 <CategoryThumbCollage snos={thumbs} title={cat.title} />

 {/* Light category tint — does not hide posters */}
 <div
 className={`absolute inset-0 bg-gradient-to-br ${cat.accent} opacity-25 mix-blend-soft-light pointer-events-none transition-opacity group-hover:opacity-35`}
 />

 <div className="absolute inset-3 rounded-xl border border-white/0 group-hover:border-white/15 transition-all duration-500 pointer-events-none" />

                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-[3] flex items-center gap-1.5 max-w-[70%]">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#ff0000] text-[8px] font-medium uppercase tracking-wider text-white">
                      <Radio size={9} />
                      {cat.badge}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-[3] w-8 h-8 rounded-full bg-white border border-[#e5e5e5] flex items-center justify-center text-[#0f0f0f] group-hover:bg-[#ff0000] group-hover:border-[#ff0000] group-hover:text-white transition-all">
                    <Icon size={14} />
                  </div>

 <div className="absolute inset-x-0 bottom-0 z-[3] p-3.5 sm:p-4">
 <p className="text-[8px] font-orbitron uppercase tracking-[0.28em] text-white/45 mb-1">
 {thumbs.length} titles
 </p>
 <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide leading-none drop-shadow-lg">
 {cat.title}
 </h3>
 <p className="text-[10px] sm:text-xs text-white/70 font-orbitron mt-1.5 line-clamp-1">
 {cat.subtitle}
 </p>
                    <div className="mt-3 h-0.5 w-0 group-hover:w-12 bg-[#ff0000] transition-all duration-500 rounded-full" />
                  </div>
                </a>

                {cat.id !== 'home' && (
                  <Link
                    to={cat.pagePath}
                    className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:translate-y-1 sm:group-hover:translate-y-0 transition-all inline-flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg bg-[#ff0000] text-white text-[9px] font-medium uppercase tracking-wider shadow-md"
                  >
                    Open <ChevronRight size={11} />
                  </Link>
                )}
 </motion.div>
 );
 })}
 </div>
 </div>
 </section>
 );
}
