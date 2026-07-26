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
 const [active, setActive] = useState<{ url: string; title: string; thumb: string } | null>(null);

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
          <h2 className="text-2xl md:text-4xl font-bebas tracking-wide text-[#0f0f0f]">{title}</h2>
          {subtitle && <p className="text-[#606060] text-xs sm:text-sm mt-1">{subtitle}</p>}
          <div className="h-0.5 w-16 mt-2 bg-[#ff0000]" />
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
 })
 }
 >
 {ranked && (
 <span className="absolute -left-1 bottom-10 text-5xl sm:text-7xl font-black text-white/10 select-none leading-none z-10">
 {i + 1}
 </span>
 )}
 <div
 className={`relative overflow-hidden rounded-lg ${
 landscape ? 'aspect-video' : 'aspect-[2/3]'
 }`}
 >
 <img
 src={landscape && item.landscape ? item.landscape : item.img}
 alt={item.title}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
 loading="lazy"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
 <div className="absolute inset-0 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
 <div
 className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center"
 style={{ background: '#ff0000' }}
 >
 <Play size={16} className="text-white fill-white ml-0.5" />
 </div>
 </div>
 {item.badge && (
 <span
 className={`absolute top-2 left-2 px-1.5 py-0.5 text-[9px] font-orbitron uppercase tracking-wider rounded ${
 item.badge === 'LIVE'
 ? 'bg-[#ff0000] text-white'
 : 'bg-white text-[#0f0f0f] border border-[#e5e5e5]'
 }`}
 >
 {item.badge}
 </span>
 )}
 <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/75 rounded text-[9px] font-orbitron text-white">
 {item.duration}
 </span>
 </div>
 <div className="mt-1.5 px-0.5">
 <p className="text-[#0f0f0f] font-bebas text-sm leading-tight line-clamp-1">{item.title}</p>
 <div className="flex items-center gap-1.5 mt-0.5">
 <span className="text-[#ff0000] text-[9px] font-medium">{item.genre}</span>
 <span className="text-gray-600 text-[9px]">·</span>
 <Star size={9} className="text-[#ff0000] fill-[#ff0000]" />
 <span className="text-[#606060] text-[9px]">{item.rating}</span>
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
 onClose={() => setActive(null)}
 />
 </section>
 );
}
