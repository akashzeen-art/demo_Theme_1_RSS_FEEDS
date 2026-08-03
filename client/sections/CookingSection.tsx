// Cooking Section — dedicated cooking classes showcase
import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionVideoBg } from '@/components/SectionVideoBg';
import { useState as useFlowState } from 'react';
import { SubscriptionFlow } from './SubscriptionFlow';
import { getVideo } from './desiVideos';
import { useRef, useState } from 'react';
import { Play, ChefHat, Clock, Star, Users } from 'lucide-react';

const COOK_THUMBS = [
 '/Landscape-New-Desi/BLACK DIARY SECRETS  EP1.jpg',
 '/Landscape-New-Desi/BLACK DIARY SECRETS  EP2.jpg',
 '/Landscape-New-Desi/BLACK SIGNAL.jpg',
];
const COOK_BG = [
 '/Landscape-New-Desi/DANGEROUS ALLIANCE.jpg',
 '/Landscape-New-Desi/DANGEROUS MINDS EP1.jpg',
];
const COOK_VIDEO = getVideo(1);

const cookingClasses = [
 { title: 'Italian Pasta Masterclass', cuisine: 'Italian', duration: '42 min', students: '134K', rating: '9.9' },
 { title: 'Wok Skills & Stir Fry', cuisine: 'Asian', duration: '35 min', students: '89K', rating: '9.7' },
 { title: 'French Pastry Basics', cuisine: 'French', duration: '58 min', students: '67K', rating: '9.6' },
 { title: 'Plant-Based Bowls', cuisine: 'Healthy', duration: '28 min', students: '102K', rating: '9.8' },
];

export function CookingSection() {
 const ref = useRef<HTMLElement>(null);
 const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
 const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
 const [thumbIdx] = useState(() => Math.floor(Math.random() * COOK_THUMBS.length));
 const [bgIdx] = useState(() => Math.floor(Math.random() * COOK_BG.length));
 const [playing, setPlaying] = useState(false);
 const [flowVideo, setFlowVideo] = useFlowState<{ url: string; title: string; thumb: string } | null>(null);

 return (
 <section ref={ref} className="relative w-full overflow-hidden py-16 sm:py-24">
 <SectionVideoBg />

 {/* Floating spice dots */}
 {[...Array(8)].map((_, i) => (
 <motion.div key={i} className="absolute rounded-full bg-orange-400/20 hidden sm:block"
 style={{ width: 2, height: 2, left: `${15 + i * 10}%`, top: `${25 + (i % 4) * 16}%` }}
 animate={{ y: [0, -18, 0], opacity: [0.1, 0.5, 0.1] }}
 transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.35 }}
 />
 ))}

 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
 <div className="flex flex-col md:grid md:grid-cols-2 gap-8 sm:gap-16 items-center">

 {/* Image — left on desktop */}
 <div className="relative w-full md:order-1">
 <motion.div className="absolute -top-3 -left-2 sm:-top-4 sm:-left-4 z-20 bg-black/90 border border-orange-500/50 rounded-xl px-3 py-2 sm:px-4 sm:py-3 "
 animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity }}>
 <p className="text-orange-400 text-[9px] font-orbitron uppercase tracking-widest">Recipes</p>
 <p className="text-white text-lg sm:text-2xl font-bebas font-black leading-none">1200+</p>
 </motion.div>
 <motion.div className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-4 z-20 bg-black/90 border border-amber-500/50 rounded-xl px-3 py-2 sm:px-4 sm:py-3 "
 animate={{ y: [0, 6, 0] }} transition={{ duration: 5, repeat: Infinity }}>
 <p className="text-amber-400 text-[9px] font-orbitron uppercase tracking-widest">Rating</p>
 <p className="text-white text-lg sm:text-2xl font-bebas font-black leading-none">4.9 ★</p>
 </motion.div>

 <div className="relative rounded-2xl overflow-hidden group cursor-pointer mt-3 ml-2 sm:mt-0 sm:ml-0" style={{ aspectRatio: '1350/760' }}
 onClick={() => setFlowVideo({ url: COOK_VIDEO, title: "Cooking Class", thumb: COOK_THUMBS[thumbIdx] })}>
 <img src={COOK_THUMBS[thumbIdx]} alt="Cooking"
 className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
 />
 {playing && <video src={COOK_VIDEO} autoPlay loop muted playsInline controlsList="nodownload noremoteplayback" disablePictureInPicture className="absolute inset-0 w-full h-full object-cover" />}
 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
 <div className="absolute inset-0 rounded-2xl border border-orange-500/20 group-hover:border-orange-500/60 transition-colors duration-500" />
 <div className="absolute inset-0 flex items-center justify-center">
 <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 /40 border-white/30 group-hover:bg-orange-500/40 group-hover:border-orange-400/80`}>
 {playing ? <div className="flex gap-1"><div className="w-1 h-4 bg-white rounded-full" /><div className="w-1 h-4 bg-white rounded-full" /></div>
 : <Play size={20} className="text-white fill-white ml-1" />}
 </div>
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
 <div className="flex items-center gap-3 text-[10px] sm:text-xs font-orbitron text-gray-400">
 <span className="flex items-center gap-1"><Star size={9} className="text-yellow-400 fill-yellow-400" /> 9.9</span>
 <span className="flex items-center gap-1"><Clock size={9} /> 42 min</span>
 <span className="flex items-center gap-1"><Users size={9} /> 134K</span>
 </div>
 </div>
 </div>
 </div>

 {/* Text — right on desktop */}
 <div className="space-y-5 sm:space-y-7 md:order-2">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30 flex-shrink-0">
 <ChefHat size={16} className="text-white" />
 </div>
 <div>
 <p className="text-[10px] font-orbitron uppercase tracking-[0.4em] text-orange-400">Cooking & Recipes</p>
 <p className="text-[9px] font-orbitron uppercase tracking-[0.2em] text-gray-600">1200+ Recipes · 50+ Cuisines</p>
 </div>
 </div>

 <div>
 <p className="text-xs sm:text-sm font-orbitron uppercase tracking-widest text-orange-400/60 mb-2">Master the Kitchen</p>
 <h2 className="font-bebas font-black text-white leading-none" style={{ fontSize: 'clamp(3.5rem, 12vw, 7rem)' }}>
 COOK WITH<br />
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">PASSION</span>
 </h2>
 </div>

 <p className="text-gray-400 leading-relaxed text-sm sm:text-base max-w-md">
 From quick weeknight dinners to elaborate weekend feasts — our world-class chefs teach you every technique, every flavour, every secret.
 </p>

 {/* Recipe list */}
 <div className="space-y-2">
 {cookingClasses.map((cls, i) => (
 <motion.div key={i}
 className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/40 transition-colors cursor-pointer group"
 whileHover={{ x: 4 }}>
 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
 <Play size={12} className="text-white fill-white ml-0.5" />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-white text-sm font-bebas leading-tight">{cls.title}</p>
 <p className="text-gray-500 text-[10px] font-orbitron">{cls.cuisine} · {cls.duration}</p>
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
 className="flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bebas font-bold uppercase text-base sm:text-lg rounded-lg shadow-xl shadow-orange-500/25 min-h-[48px]"
 whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
 onClick={() => setFlowVideo({ url: COOK_VIDEO, title: "Cooking Class", thumb: COOK_THUMBS[thumbIdx] })}>
 <Play size={16} className="fill-white" /> Browse Recipes
 </motion.button>
 <motion.button
 className="px-4 sm:px-5 py-3.5 sm:py-4 border border-white/20 text-white font-orbitron font-bold uppercase text-xs rounded-lg min-h-[48px]"
 whileTap={{ scale: 0.96 }}>
 Free Trial
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

 <motion.div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent"
 initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 1.5 }} viewport={{ once: true }} />
 </section>
 );
}
