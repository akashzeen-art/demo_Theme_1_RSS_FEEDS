import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionVideoBg } from '@/components/SectionVideoBg';
import { useState as useFlowState } from 'react';
import { SubscriptionFlow } from './SubscriptionFlow';
import { useRef, useState } from 'react';
import { Eye, Play, Clock, Star, Users } from 'lucide-react';

const THUMB = '/landscape_new_desicontent/29.png';
const BG = '/landscape_new_desicontent/29.png';
const VIDEOS = [
 'https://vz-32907a33-0f1.b-cdn.net/47ba2b6c-3128-4ecc-a1a6-1f346031ce8c/play_480p.mp4',
 'https://vz-32907a33-0f1.b-cdn.net/0ac3ec22-9eb5-4f74-8509-1387ca471cb4/play_480p.mp4',
];

export function ThrillerSection() {
 const ref = useRef<HTMLElement>(null);
 const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
 const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
 const [bgLoaded, setBgLoaded] = useState(false);
 const [vidIdx] = useState(() => Math.floor(Math.random() * VIDEOS.length));
 const [flowVideo, setFlowVideo] = useFlowState<{ url: string; title: string; thumb: string } | null>(null);

 return (
 <section ref={ref} className="relative w-full overflow-hidden py-16 sm:py-24">
 <SectionVideoBg />

 {[...Array(8)].map((_, i) => (
 <motion.div key={i} className="absolute rounded-full bg-blue-400/20 hidden sm:block"
 style={{ width: 2, height: 2, left: `${10 + i * 11}%`, top: `${20 + (i % 4) * 18}%` }}
 animate={{ y: [0, -20, 0], opacity: [0.1, 0.5, 0.1] }}
 transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
 />
 ))}

 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
 <div className="flex flex-col md:grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">

 {/* Image */}
 <div className="relative w-full md:order-1">
 <motion.div className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 z-20 bg-black/90 border border-blue-500/50 rounded-xl px-3 py-2 sm:px-4 sm:py-3 "
 animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity }}>
 <p className="text-blue-400 text-[9px] font-orbitron uppercase tracking-widest">Series</p>
 <p className="text-white text-lg sm:text-2xl font-bebas font-black leading-none">4 Eps</p>
 </motion.div>
 <motion.div className="absolute -bottom-3 -left-2 sm:-bottom-4 sm:-left-4 z-20 bg-black/90 border border-cyan-500/50 rounded-xl px-3 py-2 sm:px-4 sm:py-3 "
 animate={{ y: [0, 6, 0] }} transition={{ duration: 5, repeat: Infinity }}>
 <p className="text-cyan-400 text-[9px] font-orbitron uppercase tracking-widest">Rating</p>
 <p className="text-white text-lg sm:text-2xl font-bebas font-black leading-none">9.9 ★</p>
 </motion.div>

 <div className="relative rounded-2xl overflow-hidden group cursor-pointer mt-3 ml-2 sm:mt-0 sm:ml-0"
 onClick={() => setFlowVideo({ url: VIDEOS[vidIdx], title: 'Dangerous Minds', thumb: THUMB })}>
 <img src={THUMB} alt="Dangerous Minds"
 className="w-full h-56 sm:h-80 md:h-[460px] object-cover group-hover:scale-[1.03] transition-transform duration-700" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />
 <div className="absolute inset-0 rounded-2xl border border-blue-500/20 group-hover:border-blue-500/60 transition-colors duration-500" />
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 /50 border-white/20 group-hover:bg-blue-500/30 group-hover:border-blue-400/70">
 <Play size={20} className="text-white fill-white ml-1" />
 </div>
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
 <div className="flex items-center gap-3 text-[10px] sm:text-xs font-orbitron text-gray-400">
 <span className="flex items-center gap-1"><Star size={9} className="text-yellow-400 fill-yellow-400" /> 9.9</span>
 <span className="flex items-center gap-1"><Clock size={9} /> 43 min</span>
 <span className="flex items-center gap-1"><Users size={9} /> 156K</span>
 </div>
 </div>
 </div>
 </div>

 {/* Text */}
 <div className="space-y-5 sm:space-y-7 md:order-2">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
 <Eye size={16} className="text-white" />
 </div>
 <div>
 <p className="text-[10px] font-orbitron uppercase tracking-[0.4em] text-blue-400">Spotlight · Drama</p>
 <p className="text-[9px] font-orbitron uppercase tracking-[0.2em] text-gray-600">Psychological · Series</p>
 </div>
 </div>

 <div>
 <p className="text-xs sm:text-sm font-orbitron uppercase tracking-widest text-blue-400/60 mb-2">Inside the Mind</p>
<h2 className="font-bebas font-black text-white leading-none" style={{ fontSize: 'clamp(3.5rem, 12vw, 7rem)' }}>
 DANGEROUS<br />
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
 MINDS
 </span>
 </h2>
 </div>

 <p className="text-gray-400 leading-relaxed text-sm sm:text-base max-w-md">
 A psychological thriller that dives deep into the criminal mind. Four gripping episodes that unravel the darkest secrets of those who walk among us — hiding in plain sight.
 </p>

 <div className="flex flex-wrap gap-2">
 {['Psychological', 'Crime', 'Series', 'Dark Drama'].map(tag => (
 <span key={tag} className="px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-orbitron font-bold uppercase bg-blue-500/10 text-blue-300 border border-blue-500/30">{tag}</span>
 ))}
 </div>

 <div className="flex items-center gap-3 pt-1">
 <motion.button
 className="flex items-center gap-2 px-5 sm:px-7 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bebas font-bold uppercase text-base sm:text-lg rounded-lg shadow-xl shadow-blue-500/25 min-h-[48px]"
 whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
 onClick={() => setFlowVideo({ url: VIDEOS[vidIdx], title: 'Dangerous Minds', thumb: THUMB })}>
 <Play size={16} className="fill-white" /> Watch Now
 </motion.button>
 <motion.button
 className="px-4 sm:px-5 py-3.5 sm:py-4 border border-white/20 text-white font-orbitron font-bold uppercase text-xs rounded-lg min-h-[48px]"
 whileTap={{ scale: 0.96 }}>
 + Save
 </motion.button>
 </div>
 </div>
 </div>
 </div>

 <SubscriptionFlow
 videoUrl={flowVideo?.url ?? null}
 title={flowVideo?.title}
 thumbnail={flowVideo?.thumb}
 onClose={() => setFlowVideo(null)}
 />

 <motion.div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"
 initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 1.5 }} viewport={{ once: true }} />
 </section>
 );
}
