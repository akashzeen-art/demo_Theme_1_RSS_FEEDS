// TrendingSection — Yoga with click-to-play video modal
import { useState } from 'react';
import { SectionVideoBg } from '@/components/SectionVideoBg';
import { motion } from 'framer-motion';
import { TrendingUp, Star, Play } from 'lucide-react';
import { SubscriptionFlow } from './SubscriptionFlow';
import { getVideo } from './desiVideos';

const items = [
 { rank: 1, title: 'Fatal Connections Ep3', genre: 'Thriller', rating: '4.9', duration: '41 min', img: '/potrait_new_desicontent/13.png' },
 { rank: 2, title: 'The Hidden Enemy', genre: 'Action', rating: '4.8', duration: '46 min', img: '/potrait_new_desicontent/14.png' },
 { rank: 3, title: 'Escape From Nowhere', genre: 'Thriller', rating: '4.9', duration: '43 min', img: '/potrait_new_desicontent/15.png' },
 { rank: 4, title: 'The Final Secret', genre: 'Mystery', rating: '4.7', duration: '50 min', img: '/potrait_new_desicontent/16.png' },
 { rank: 5, title: 'The Secret Order', genre: 'Crime', rating: '4.9', duration: '48 min', img: '/potrait_new_desicontent/17.png' },
 { rank: 6, title: 'The Final Dhokha', genre: 'Drama', rating: '4.8', duration: '44 min', img: '/potrait_new_desicontent/18.png' },
 { rank: 7, title: 'Black Diary Secrets Ep1', genre: 'Thriller', rating: '4.7', duration: '37 min', img: '/potrait_new_desicontent/19.png' },
 { rank: 8, title: 'Black Diary Secrets Ep2', genre: 'Thriller', rating: '4.8', duration: '40 min', img: '/potrait_new_desicontent/20.png' },
 { rank: 9, title: 'Final Witness', genre: 'Crime', rating: '4.9', duration: '45 min', img: '/potrait_new_desicontent/21.png' },
 { rank: 10, title: 'The Missing Link', genre: 'Mystery', rating: '4.6', duration: '42 min', img: '/potrait_new_desicontent/22.png' },
];

export function TrendingSection() {
 const [activeVideo, setActiveVideo] = useState<{ url: string; title: string; thumb: string } | null>(null);

 return (
 <section className="relative py-12 md:py-20 overflow-hidden">
 <SectionVideoBg />

 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <motion.div className="flex items-center gap-3 mb-8 md:mb-10"
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }} viewport={{ once: true }}>
 <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-cyan-400 animate-pulse" />
 <div>
 <h2 className="text-3xl md:text-5xl font-bebas font-black">
 <span className="gradient-text">🎬 Trending Now</span>
 </h2>
 <p className="text-slate-500 text-xs sm:text-sm mt-1">Most watched titles this week</p>
 <div className="accent-bar w-20 mt-2" />
 </div>
 </motion.div>

 <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
 <div className="flex gap-4 sm:gap-5">
 {items.map((item, i) => (
 <motion.div key={i}
 className="relative w-32 sm:w-44 md:w-48 flex-shrink-0 group cursor-pointer"
 initial={{ opacity: 0, x: 30 }}
 whileInView={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.4, delay: i * 0.05 }}
 viewport={{ once: true }}
 onClick={() => setActiveVideo({ url: getVideo(i + 13), title: item.title, thumb: item.img })}>
 <span className="absolute -left-2 bottom-[calc(2.5rem+1.5rem)] sm:bottom-[calc(3rem+1.5rem)] text-6xl sm:text-8xl font-black text-slate-900/10 select-none leading-none z-10">{item.rank}</span>
 <div className="relative h-44 sm:h-60 md:h-72 rounded-xl overflow-hidden">
 <img src={item.img} alt={item.title}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
 <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg play-pulse"
 style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}>
 <Play size={20} className="text-white fill-white ml-0.5" />
 </div>
 </div>
 {/* Duration badge */}
 <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[9px] font-orbitron text-white">{item.duration}</div>
 </div>
 {/* Below thumbnail info */}
 <div className="mt-1.5 px-0.5">
 <p className="text-slate-900 font-bebas text-xs sm:text-sm leading-tight line-clamp-1">{item.title}</p>
 <div className="flex items-center gap-1.5 mt-0.5">
 <span className="text-red-400 text-[9px] font-orbitron">{item.genre}</span>
 <span className="text-gray-600 text-[9px]">·</span>
 <span className="text-gray-400 text-[9px] font-orbitron">{item.duration}</span>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </div>

 <SubscriptionFlow
 videoUrl={activeVideo?.url ?? null}
 title={activeVideo?.title}
 thumbnail={activeVideo?.thumb}
 onClose={() => setActiveVideo(null)}
 />
 </section>
 );
}
