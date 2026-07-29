// CriticsChoiceSection — Yoga with click-to-play video modal
import { useState } from 'react';
import { SectionVideoBg } from '@/components/SectionVideoBg';
import { motion } from 'framer-motion';
import { Award, Star, Play } from 'lucide-react';
import { SubscriptionFlow } from './SubscriptionFlow';
import { getVideo } from './desiVideos';

const items = [
 { rank: 1, title: 'Her Story', genre: 'Drama', rating: '5.0', duration: '44 min', img: '/Potrait-New_desi/HER STORY.jpg' },
 { rank: 2, title: 'Dangerous Territory', genre: 'Action', rating: '4.9', duration: '49 min', img: '/Potrait-New_desi/DANGEROUS TERRITORY.jpg' },
 { rank: 3, title: 'Shadow Protocol', genre: 'Thriller', rating: '4.9', duration: '46 min', img: '/Potrait-New_desi/SHADOW PROTOCOL.jpg' },
 { rank: 4, title: 'Escape Beyond Fear Ep1', genre: 'Thriller', rating: '4.8', duration: '36 min', img: '/Potrait-New_desi/ESCAPE BEYOND FEAR EP1.jpg' },
 { rank: 5, title: 'Escape Beyond Fear Ep2', genre: 'Thriller', rating: '4.8', duration: '38 min', img: '/Potrait-New_desi/ESCAPE BEYOND FEAR EP2.jpg' },
 { rank: 6, title: 'Escape Beyond Fear Ep3', genre: 'Thriller', rating: '4.7', duration: '40 min', img: '/Potrait-New_desi/ESCAPE BEYOND FEAR EP3.jpg' },
 { rank: 7, title: 'Underground Warriors Ep1', genre: 'Action', rating: '4.7', duration: '45 min', img: '/Potrait-New_desi/UNDERGROUND WARRIORS EP1.jpg' },
 { rank: 8, title: 'Underground Warriors Ep2', genre: 'Action', rating: '4.6', duration: '47 min', img: '/Potrait-New_desi/UNDERGROUND WARRIORS EP2.jpg' },
 { rank: 9, title: 'Mystery Junction', genre: 'Mystery', rating: '4.6', duration: '42 min', img: '/Potrait-New_desi/MYSTERY JUNCTION.jpg' },
 { rank: 10, title: 'Dark City Files', genre: 'Crime', rating: '4.5', duration: '50 min', img: '/Potrait-New_desi/DARK CITY FILES.jpg' },
];

export function CriticsChoiceSection() {
 const [activeVideo, setActiveVideo] = useState<{ url: string; title: string; thumb: string } | null>(null);

 return (
 <section className="relative py-12 md:py-20 overflow-hidden">
 <SectionVideoBg />

 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <motion.div className="flex items-center gap-3 mb-8 md:mb-10"
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }} viewport={{ once: true }}>
 <Award className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
 <div>
<h2 className="text-3xl md:text-5xl font-bebas font-black text-white">⭐ Critics' Choice</h2>
<p className="text-white/55 text-xs sm:text-sm mt-1">Top-rated titles by our expert critics</p>
 <div className="w-16 h-1 bg-emerald-400 rounded-full mt-1" />
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
 onClick={() => setActiveVideo({ url: getVideo(i + 43), title: item.title, thumb: item.img })}>
<span className="absolute -left-2 bottom-[calc(2.5rem+1.5rem)] sm:bottom-[calc(3rem+1.5rem)] text-6xl sm:text-8xl font-black text-white/10 select-none leading-none z-10">{item.rank}</span>
 <div className="relative h-44 sm:h-60 md:h-72 rounded-xl overflow-hidden">
 <img src={item.img} alt={item.title}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
 {item.rank <= 3 && (
 <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center">
 <Award size={12} className="text-black" />
 </div>
 )}
 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
 <div className="w-12 h-12 rounded-full bg-emerald-500/80 flex items-center justify-center shadow-lg">
 <Play size={20} className="text-white fill-white ml-0.5" />
 </div>
 </div>
 <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[9px] font-orbitron text-white">{item.duration}</div>
 </div>
 <div className="mt-1.5 px-0.5">
<p className="text-white font-bebas text-xs sm:text-sm leading-tight line-clamp-1">{item.title}</p>
 <div className="flex items-center gap-1.5 mt-0.5">
 <span className="text-emerald-400 text-[9px] font-orbitron">{item.genre}</span>
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
