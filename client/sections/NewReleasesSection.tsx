// NewReleasesSection — Cooking with click-to-play video modal
import { useState } from 'react';
import { SectionVideoBg } from '@/components/SectionVideoBg';
import { motion } from 'framer-motion';
import { Play, Plus, Star, Sparkles } from 'lucide-react';
import { SubscriptionFlow } from './SubscriptionFlow';
import { getVideo } from './desiVideos';

const items = [
 { title: 'Black Horizon', genre: 'Mystery', rating: '4.9', duration: '48 min', img: '/Potrait-New_desi/MIDNIGHT ESCAPE.jpg' },
 { title: 'Dark Empire', genre: 'Crime', rating: '4.8', duration: '52 min', img: '/Potrait-New_desi/MISSSION DARKNIGHT.jpg' },
 { title: 'Adventure Beyond Borders', genre: 'Action', rating: '4.7', duration: '45 min', img: '/Potrait-New_desi/MYSTERY JUNCTION.jpg' },
 { title: 'Midnight Case', genre: 'Thriller',rating: '4.8', duration: '44 min', img: '/Potrait-New_desi/MIDNIGHT ESCAPE.jpg' },
];

export function NewReleasesSection() {
 const [activeVideo, setActiveVideo] = useState<{ url: string; title: string; thumb: string } | null>(null);

 return (
 <section className="relative py-12 md:py-20 overflow-hidden">
 <SectionVideoBg />

 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <motion.div className="flex items-center gap-3 mb-8 md:mb-10"
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }} viewport={{ once: true }}>
 <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
 <div>
<h2 className="text-3xl md:text-5xl font-bebas font-black text-white">🆕 New Releases</h2>
<p className="text-white/55 text-xs sm:text-sm mt-1">Fresh titles just dropped</p>
 <div className="w-16 h-1 bg-amber-400 rounded-full mt-1" />
 </div>
 </motion.div>

 <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-4">
 {items.map((item, i) => (
 <motion.div key={i}
 className="group cursor-pointer"
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, delay: i * 0.04 }}
 viewport={{ once: true }}
 onClick={() => setActiveVideo({ url: getVideo(i + 22), title: item.title, thumb: item.img })}>
 <div className="relative rounded-xl overflow-hidden bg-gray-900" style={{ aspectRatio: '1080/1350' }}>
 <img src={item.img} alt={item.title}
 className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500" />
 <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-amber-400 text-black text-[9px] font-black uppercase rounded font-orbitron">NEW</div>
 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
 <div className="w-10 h-10 rounded-full bg-amber-500/80 flex items-center justify-center shadow-lg">
 <Play size={16} className="text-white fill-white ml-0.5" />
 </div>
 </div>
 <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[9px] font-orbitron text-white">{item.duration}</div>
 </div>
 <div className="mt-1.5 px-0.5">
<p className="text-white font-bebas text-xs sm:text-sm leading-tight line-clamp-1">{item.title}</p>
 <div className="flex items-center gap-1.5 mt-0.5">
 <Star size={9} className="fill-yellow-400 text-yellow-400 shrink-0" />
 <span className="text-yellow-400 text-[10px] font-orbitron">{item.rating}</span>
 <span className="text-gray-600 text-[10px]">·</span>
 <span className="text-gray-400 text-[10px] font-orbitron">{item.duration}</span>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>

 <SubscriptionFlow videoUrl={activeVideo?.url ?? null} title={activeVideo?.title} thumbnail={activeVideo?.thumb} onClose={() => setActiveVideo(null)} />
 </section>
 );
}
