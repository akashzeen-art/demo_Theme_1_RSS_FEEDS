// StaffPicksSection — Yoga with click-to-play video modal
import { useState } from 'react';
import { SectionVideoBg } from '@/components/SectionVideoBg';
import { motion } from 'framer-motion';
import { Star, Heart, Play } from 'lucide-react';
import { SubscriptionFlow } from './SubscriptionFlow';
import { getVideo } from './desiVideos';

const items = [
 { rank: 1, title: 'The Wanted Target', genre: 'Crime', rating: '4.5', duration: '2 min', img: '/portrait/THEWANTEDTARGET.jpg' },
 { rank: 2, title: 'Wanted by Darkness', genre: 'Thriller', rating: '4.8', duration: '25 min', img: '/portrait/WANTEDBYDARKNESS.jpg' },
 { rank: 3, title: 'Unknown Enemy Ep1', genre: 'Action', rating: '4.9', duration: '37 min', img: '/portrait/UNKNOWNENEMYEP1.jpg' },
 { rank: 4, title: 'Unknown Enemy Ep2', genre: 'Action', rating: '4.8', duration: '39 min', img: '/portrait/UNKNOWNENEMYEP2.jpg' },
 { rank: 5, title: 'Unknown Enemy Ep3', genre: 'Action', rating: '4.6', duration: '12 min', img: '/portrait/UNKNOWNENEMYEP3.jpg' },
 { rank: 6, title: 'The Shadow Game Ep1', genre: 'Thriller', rating: '4.6', duration: '21 min', img: '/portrait/THESHADOWGAMEEP1.jpg' },
 { rank: 7, title: 'The Shadow Game Ep2', genre: 'Thriller', rating: '4.5', duration: '18 min', img: '/portrait/THESHADOWGAMEEP2.jpg' },
 { rank: 8, title: 'The Shadow Game Ep3', genre: 'Thriller', rating: '4.9', duration: '11 min', img: '/portrait/THESHADOWGAMEEP3.jpg' },
 { rank: 9, title: 'The Shadow Game Ep4', genre: 'Thriller', rating: '4.8', duration: '11 min', img: '/portrait/THESHADOWGAMEEP4.jpg' },
 { rank: 10, title: 'The Fitness Trap', genre: 'Drama', rating: '4.5', duration: '40 min', img: '/portrait/THEFITNESSTRAP.jpg' },
];

const genreColor: Record<string, string> = {
 Crime: 'text-rose-400', Thriller: 'text-red-400', Action: 'text-orange-400', Drama: 'text-red-400',
};

export function StaffPicksSection() {
 const [activeVideo, setActiveVideo] = useState<{ url: string; title: string; thumb: string } | null>(null);

 return (
 <section className="relative py-12 md:py-20 overflow-hidden">
 <SectionVideoBg />

 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <motion.div className="flex items-center gap-3 mb-8 md:mb-10"
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }} viewport={{ once: true }}>
 <Heart className="w-6 h-6 md:w-8 md:h-8 text-rose-400 fill-rose-400" />
 <div>
<h2 className="text-3xl md:text-5xl font-bebas font-black text-white">❤️ Staff Picks</h2>
<p className="text-white/55 text-xs sm:text-sm mt-1">Titles our team personally loves</p>
 <div className="w-16 h-1 bg-rose-400 rounded-full mt-1" />
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
 onClick={() => setActiveVideo({ url: getVideo(i + 53), title: item.title, thumb: item.img })}>
<span className="absolute -left-2 bottom-[calc(2.5rem+1.5rem)] sm:bottom-[calc(3rem+1.5rem)] text-6xl sm:text-8xl font-black text-white/10 select-none leading-none z-10">{item.rank}</span>
 <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#0b1728]">
 <img src={item.img} alt={item.title}
 className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500" />
 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
 {item.rank <= 3 && (
 <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-400 flex items-center justify-center">
 <Heart size={12} className="text-white fill-white" />
 </div>
 )}
 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
 <div className="w-12 h-12 rounded-full bg-rose-500/80 flex items-center justify-center shadow-lg">
 <Play size={20} className="text-white fill-white ml-0.5" />
 </div>
 </div>
 <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[9px] font-orbitron text-white">{item.duration}</div>
 </div>
 <div className="mt-1.5 px-0.5">
<p className="text-white font-bebas text-xs sm:text-sm leading-tight line-clamp-1">{item.title}</p>
 <div className="flex items-center gap-1.5 mt-0.5">
 <Star size={9} className="fill-yellow-400 text-yellow-400 shrink-0" />
 <span className="text-yellow-400 text-[10px] font-orbitron">{item.rating}</span>
 <span className="text-gray-600 text-[9px]">·</span>
 <span className="text-gray-400 text-[9px] font-orbitron">{item.duration}</span>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 </div>

 <SubscriptionFlow videoUrl={activeVideo?.url ?? null} title={activeVideo?.title} thumbnail={activeVideo?.thumb} onClose={() => setActiveVideo(null)} />
 </section>
 );
}
