import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import { ContentItem, resolveVideo } from '@/lib/catalog';
import { SubscriptionFlow } from '@/sections/SubscriptionFlow';

interface ContentRowProps {
 title: string;
 subtitle?: string;
 items: ContentItem[];
 ranked?: boolean;
 landscape?: boolean;
}

export function ContentRow({ title, subtitle, items, ranked = false, landscape = false }: ContentRowProps) {
 const [active, setActive] = useState<{
   url: string;
   title: string;
   thumb: string;
   genre: string;
   duration: string;
   rating: string;
 } | null>(null);

 return (
 <section className="relative py-6 md:py-10">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <motion.div
 className="mb-5 md:mb-6"
 initial={{ opacity: 0, y: 16 }}
 whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 viewport={{ once: true }}
 >
          <h2 className="text-[1.55rem] sm:text-3xl md:text-[2.15rem] font-bebas tracking-wide text-white leading-none">{title}</h2>
          {subtitle && <p className="text-white/55 text-[11px] sm:text-sm mt-1 leading-relaxed">{subtitle}</p>}
          <div className="h-0.5 w-16 mt-2 bg-cyan-300" />
 </motion.div>

 <div className="overflow-x-auto pb-3 -mx-1 px-1 touch-pan-x" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
 <div className="flex gap-3 sm:gap-4">
 {items.map((item, i) => (
 <motion.button
 key={item.id}
 type="button"
 className={`relative flex-shrink-0 group text-left ${
 landscape ? 'w-52 sm:w-64 md:w-72' : 'w-28 sm:w-36 md:w-40'
 }`}
 initial={{ opacity: 0, x: 24 }}
 whileInView={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.35, delay: i * 0.04 }}
 viewport={{ once: true }}
 onClick={() =>
 setActive({
 url: resolveVideo(item),
 title: item.title,
 thumb: landscape && item.landscape ? item.landscape : item.img,
 genre: item.genre,
 duration: item.duration,
 rating: item.rating,
 })
 }
 >
 {ranked && (
 <span className="absolute -left-1 bottom-10 text-5xl sm:text-7xl font-black text-white/10 select-none leading-none z-10">
 {i + 1}
 </span>
 )}
 <div
 className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#0b1728] ${
 landscape ? 'aspect-[1350/760]' : 'aspect-[4/5]'
 }`}
 >
 <img
 src={landscape && item.landscape ? item.landscape : item.img}
 alt={item.title}
 className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
 loading="lazy"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
 <div className="absolute inset-0 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
 <div
 className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center"
 style={{ background: '#22d3ee' }}
 >
 <Play size={16} className="text-white fill-white ml-0.5" />
 </div>
 </div>
 {item.badge && (
 <span
 className={`absolute top-2 left-2 px-1.5 py-0.5 text-[9px] font-orbitron uppercase tracking-wider rounded ${
 item.badge === 'LIVE'
 ? 'bg-cyan-400 text-[#07111f]'
 : 'bg-white/90 text-[#07111f] border border-white/20'
 }`}
 >
 {item.badge}
 </span>
 )}
 <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/75 rounded text-[9px] font-orbitron text-white">
 {item.duration}
 </span>
 </div>
 <div className="mt-2 px-0.5">
 <p className="text-white font-bebas text-[13px] sm:text-sm leading-tight line-clamp-2 min-h-[2.2rem]">{item.title}</p>
 <div className="flex items-center gap-1.5 mt-1">
 <span className="text-cyan-300 text-[9px] sm:text-[10px] font-medium">{item.genre}</span>
 <span className="text-white/25 text-[9px]">·</span>
 <Star size={9} className="text-cyan-300 fill-cyan-300" />
 <span className="text-white/55 text-[9px] sm:text-[10px]">{item.rating}</span>
 </div>
 </div>
 </motion.button>
 ))}
 </div>
 </div>
 </div>

 <SubscriptionFlow
 videoUrl={active?.url ?? null}
 title={active?.title}
 thumbnail={active?.thumb}
 genre={active?.genre}
 duration={active?.duration}
 rating={active?.rating}
 onClose={() => setActive(null)}
 />
 </section>
 );
}
