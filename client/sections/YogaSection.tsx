// Yoga Section — dedicated yoga classes showcase
import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionVideoBg } from '@/components/SectionVideoBg';
import { useState as useFlowState } from 'react';
import { SubscriptionFlow } from './SubscriptionFlow';
import { useRef, useState } from 'react';
import { Play, Wind, Clock, Star, Users } from 'lucide-react';

const YOGA_THUMBS = [
 '/landscape_new_desicontent/1.png',
 '/landscape_new_desicontent/2.png',
 '/landscape_new_desicontent/3.png',
];
const YOGA_BG = [
 '/landscape_new_desicontent/5.png',
 '/landscape_new_desicontent/6.png',
];
import { getYogaVideo } from './yogaVideos';
const YOGA_VIDEO = getYogaVideo(0);

const yogaClasses = [
 { title: 'Sunrise Vinyasa', level: 'Beginner', duration: '30 min', students: '98K', rating: '9.8' },
 { title: 'Power Flow', level: 'Intermediate', duration: '45 min', students: '74K', rating: '9.6' },
 { title: 'Yin & Restore', level: 'All Levels', duration: '60 min', students: '112K', rating: '9.9' },
 { title: 'Ashtanga Fundamentals',level: 'Advanced', duration: '50 min', students: '56K', rating: '9.5' },
];

export function YogaSection() {
 const ref = useRef<HTMLElement>(null);
 const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
 const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
 const [thumbIdx] = useState(() => Math.floor(Math.random() * YOGA_THUMBS.length));
 const [bgIdx] = useState(() => Math.floor(Math.random() * YOGA_BG.length));
 const [playing, setPlaying] = useState(false);
 const [flowVideo, setFlowVideo] = useFlowState<{ url: string; title: string; thumb: string } | null>(null);

 return (
 <section ref={ref} className="relative w-full overflow-hidden py-16 sm:py-24">
 <SectionVideoBg />

 {/* Floating particles */}
 {[...Array(8)].map((_, i) => (
 <motion.div key={i} className="absolute rounded-full bg-emerald-400/20 hidden sm:block"
 style={{ width: 2, height: 2, left: `${10 + i * 11}%`, top: `${20 + (i % 4) * 18}%` }}
 animate={{ y: [0, -20, 0], opacity: [0.1, 0.5, 0.1] }}
 transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
 />
 ))}

 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
 <div className="flex flex-col md:grid md:grid-cols-2 gap-8 sm:gap-16 items-center">

 {/* Text */}
 <div className="space-y-5 sm:space-y-7 md:order-1">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0">
 <Wind size={16} className="text-white" />
 </div>
 <div>
 <p className="text-[10px] font-orbitron uppercase tracking-[0.4em] text-emerald-400">Yoga & Mindfulness</p>
 <p className="text-[9px] font-orbitron uppercase tracking-[0.2em] text-gray-600">500+ Classes · All Levels</p>
 </div>
 </div>

 <div>
 <p className="text-xs sm:text-sm font-orbitron uppercase tracking-widest text-emerald-400/60 mb-2">Find Your Flow</p>
 <h2 className="font-bebas font-black text-white leading-none" style={{ fontSize: 'clamp(3.5rem, 12vw, 7rem)' }}>
 BREATHE<br />
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">& MOVE</span>
 </h2>
 </div>

 <p className="text-gray-400 leading-relaxed text-sm sm:text-base max-w-md">
 From sunrise flows to deep restorative sessions — our expert instructors guide you through every breath, every pose, every transformation.
 </p>

 {/* Class list */}
 <div className="space-y-2">
 {yogaClasses.map((cls, i) => (
 <motion.div key={i}
 className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-colors cursor-pointer group"
 whileHover={{ x: 4 }}>
 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center flex-shrink-0">
 <Play size={12} className="text-white fill-white ml-0.5" />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-white text-sm font-bebas leading-tight">{cls.title}</p>
 <p className="text-gray-500 text-[10px] font-orbitron">{cls.level} · {cls.duration}</p>
 </div>
 <div className="flex items-center gap-1 flex-shrink-0">
 <Star size={9} className="text-yellow-400 fill-yellow-400" />
 <span className="text-yellow-400 text-[10px] font-orbitron">{cls.rating}</span>
 </div>
 </motion.div>
 ))}
 </div>

 <div className="flex items-center gap-3 pt-1">
 <motion.button
 className="flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bebas font-bold uppercase text-base sm:text-lg rounded-lg shadow-xl shadow-emerald-500/25 min-h-[48px]"
 whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
 onClick={() => setFlowVideo({ url: YOGA_VIDEO, title: "Yoga Session", thumb: YOGA_THUMBS[thumbIdx] })}>
 <Play size={16} className="fill-white" /> Browse Classes
 </motion.button>
 <motion.button
 className="px-4 sm:px-5 py-3.5 sm:py-4 border border-white/20 text-white font-orbitron font-bold uppercase text-xs rounded-lg min-h-[48px]"
 whileTap={{ scale: 0.96 }}>
 Free Trial
 </motion.button>
 </div>
 </div>

 {/* Image */}
 <div className="relative w-full md:order-2">
 <motion.div className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 z-20 bg-black/90 border border-emerald-500/50 rounded-xl px-3 py-2 sm:px-4 sm:py-3 "
 animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity }}>
 <p className="text-emerald-400 text-[9px] font-orbitron uppercase tracking-widest">Students</p>
 <p className="text-white text-lg sm:text-2xl font-bebas font-black leading-none">500K+</p>
 </motion.div>
 <motion.div className="absolute -bottom-3 -left-2 sm:-bottom-4 sm:-left-4 z-20 bg-black/90 border border-teal-500/50 rounded-xl px-3 py-2 sm:px-4 sm:py-3 "
 animate={{ y: [0, 6, 0] }} transition={{ duration: 5, repeat: Infinity }}>
 <p className="text-teal-400 text-[9px] font-orbitron uppercase tracking-widest">Rating</p>
 <p className="text-white text-lg sm:text-2xl font-bebas font-black leading-none">4.9 ★</p>
 </motion.div>

 <div className="relative rounded-2xl overflow-hidden group cursor-pointer mt-3 mr-2 sm:mt-0 sm:mr-0"
 onClick={() => setFlowVideo({ url: YOGA_VIDEO, title: "Yoga Session", thumb: YOGA_THUMBS[thumbIdx] })}>
 <img src={YOGA_THUMBS[thumbIdx]} alt="Yoga"
 className="w-full h-56 sm:h-80 md:h-[480px] object-cover group-hover:scale-[1.03] transition-transform duration-700"
 />
 {playing && <video src={YOGA_VIDEO} autoPlay loop muted playsInline controlsList="nodownload noremoteplayback" disablePictureInPicture onContextMenu={(e) => e.preventDefault()} className="absolute inset-0 w-full h-full object-cover" />}
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
 <div className="absolute inset-0 rounded-2xl border border-emerald-500/20 group-hover:border-emerald-500/60 transition-colors duration-500" />
 <div className="absolute inset-0 flex items-center justify-center">
 <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 /40 border-white/30 group-hover:bg-emerald-500/40 group-hover:border-emerald-400/80`}>
 {playing ? <div className="flex gap-1"><div className="w-1 h-4 bg-white rounded-full" /><div className="w-1 h-4 bg-white rounded-full" /></div>
 : <Play size={20} className="text-white fill-white ml-1" />}
 </div>
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
 <div className="flex items-center gap-3 text-[10px] sm:text-xs font-orbitron text-gray-400">
 <span className="flex items-center gap-1"><Star size={9} className="text-yellow-400 fill-yellow-400" /> 9.9</span>
 <span className="flex items-center gap-1"><Clock size={9} /> 60 min</span>
 <span className="flex items-center gap-1"><Users size={9} /> 156K</span>
 </div>
 </div>
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

 <motion.div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent"
 initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 1.5 }} viewport={{ once: true }} />
 </section>
 );
}
