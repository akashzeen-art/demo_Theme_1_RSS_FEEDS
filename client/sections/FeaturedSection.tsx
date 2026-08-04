// Featured Section — OTT spotlight player with SubscriptionFlow
import { useState } from 'react';
import { SectionVideoBg } from '@/components/SectionVideoBg';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, Star, Clock, Users } from 'lucide-react';
import { SubscriptionFlow } from './SubscriptionFlow';
import { getVideoByTitle } from './desiVideos';

const videos = [
 { id: '1', title: 'Raaz Beyond Fear', thumbnail: '/landscape/RAAZBEYONDFEAR.jpg', video: getVideoByTitle('Raaz Beyond Fear'), description: 'A gripping tale of fear, secrets and survival', rating: '9.8', category: 'Thriller', level: 'Suspense', duration: '34 min', students: '128K' },
 { id: '2', title: 'The Hidden Truth', thumbnail: '/landscape/THEHIDDENTRUTH.jpg', video: getVideoByTitle('The Hidden Truth'), description: 'Uncover the truth buried deep beneath the surface', rating: '9.5', category: 'Drama', level: 'Mystery', duration: '22 min', students: '94K' },
 { id: '3', title: 'Silent Chase', thumbnail: '/landscape/SCILENTCHASE.jpg', video: getVideoByTitle('Silent Chase'), description: 'A silent pursuit through the shadows of the city', rating: '9.6', category: 'Action', level: 'Thriller', duration: '10 min', students: '112K' },
 { id: '4', title: 'The Missing Witness', thumbnail: '/landscape/THEMISSINGWITNESS.jpg', video: getVideoByTitle('The Missing Witness'), description: 'The key witness vanishes — who can be trusted?', rating: '9.4', category: 'Crime', level: 'Mystery', duration: '14 min', students: '76K' },
 { id: '5', title: 'The Secret Route Ep 1', thumbnail: '/landscape/THESECRETROUTEP1.jpg', video: getVideoByTitle('The Secret Route Ep1'), description: 'Episode 1 of the thrilling secret route saga', rating: '9.7', category: 'Thriller', level: 'Series', duration: '12 min', students: '103K' },
 { id: '6', title: 'The Secret Route Ep 2', thumbnail: '/landscape/THESECRETROUTEP2.jpg', video: getVideoByTitle('The Secret Route Ep2'), description: 'The route gets darker in this explosive episode', rating: '9.3', category: 'Thriller', level: 'Series', duration: '13 min', students: '88K' },
];

const catColors: Record<string, string> = {
 Thriller: 'from-red-600 to-rose-500',
 Drama: 'from-rose-600 to-amber-500',
 Action: 'from-orange-600 to-amber-400',
 Crime: 'from-red-700 to-red-500',
 Series: 'from-red-500 to-orange-400',
};

export function FeaturedSection() {
 const [active, setActive] = useState(0);
 const [direction, setDirection] = useState(1);
 const [flowVideo, setFlowVideo] = useState<{ url: string; title: string; thumb: string } | null>(null);

 const go = (next: number) => {
 setDirection(next > active ? 1 : -1);
 setActive((next + videos.length) % videos.length);
 };

 const openFlow = (v: typeof videos[0]) => {
 setFlowVideo({ url: v.video, title: v.title, thumb: v.thumbnail });
 };

 const current = videos[active];
 const gradient = catColors[current.category] ?? 'from-emerald-500 to-teal-400';

 return (
 <section className="relative w-full overflow-hidden py-12 sm:py-20">
 <SectionVideoBg />
 <AnimatePresence mode="wait">
 <motion.div key={current.id}
 className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-gradient-to-b ${gradient} opacity-[0.05] rounded-full pointer-events-none`}
 initial={{ opacity: 0 }} animate={{ opacity: 0.05 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
 />
 </AnimatePresence>

 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
 <motion.div className="mb-6 sm:mb-10"
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.7 }} viewport={{ once: true }}>
 <div className="flex items-center gap-2 mb-1.5">
 <motion.div
 className="w-2 h-2 rounded-full bg-red-600"
 animate={{ scale: [1, 1.4, 1] }}
 transition={{ duration: 1.5, repeat: Infinity }}
 />
 <p className="text-[10px] font-orbitron uppercase tracking-[0.3em] text-red-400">Now Playing</p>
 </div>
 <h2 className="text-4xl sm:text-5xl md:text-7xl font-bebas font-black text-white">
 <span className="gradient-text">FEATURED TITLES</span>
 </h2>
 <div className="accent-bar w-32 mt-2" />
 </motion.div>

 <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 sm:gap-6">

 {/* Player */}
 <div className="lg:col-span-3">
 <div className="relative rounded-xl overflow-hidden bg-gray-900 glow-card" style={{ aspectRatio: '1350/760' }}>

 {/* Thumbnail */}
 <AnimatePresence mode="wait" custom={direction}>
 <motion.img key={current.id + '-t'} src={current.thumbnail} alt={current.title}
 className="absolute inset-0 w-full h-full object-cover"
 custom={direction}
 initial={{ x: direction * 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
 exit={{ x: direction * -50, opacity: 0 }} transition={{ duration: 0.4 }}
 />
 </AnimatePresence>

 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />

 {/* Badges */}
 <div className="absolute top-3 left-3 flex items-center gap-2">
 <span className={`px-2.5 py-1 text-[10px] font-orbitron font-bold uppercase bg-gradient-to-r ${gradient} text-white rounded-full`}>{current.category}</span>
 <span className="px-2.5 py-1 text-[10px] font-orbitron /60 text-gray-300 rounded-full border border-white/10 ">{current.level}</span>
 </div>

 {/* Play button — opens SubscriptionFlow */}
 <button
 onClick={() => openFlow(current)}
 className="absolute inset-0 flex items-center justify-center group"
 >
 <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center transition-all bg-white/10 border-white/40 group-hover:bg-red-600/40 group-hover:border-red-400/70 play-pulse">
 <Play size={22} className="text-white fill-white ml-1" />
 </div>
 </button>

 {/* Bottom info */}
 <AnimatePresence mode="wait">
 <motion.div key={current.id + '-i'} className="absolute bottom-0 left-0 right-0 p-4 sm:p-6"
 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.35 }}>
 <h3 className="text-2xl sm:text-4xl font-bebas font-black text-white mb-1">{current.title}</h3>
 <p className="text-gray-300 text-xs sm:text-sm mb-2 line-clamp-1">{current.description}</p>
 <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-orbitron text-gray-400 flex-wrap">
 <span className="flex items-center gap-1"><Star size={10} className="text-yellow-400 fill-yellow-400" /><span className="text-yellow-400 font-bold">{current.rating}</span></span>
 <span className="flex items-center gap-1"><Clock size={10} />{current.duration}</span>
 <span className="flex items-center gap-1"><Users size={10} />{current.students}</span>
 </div>
 </motion.div>
 </AnimatePresence>

 {/* Progress bar */}
 <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white/10">
 <div className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500`} style={{ width: `${((active + 1) / videos.length) * 100}%` }} />
 </div>
 </div>

 {/* Dots + nav */}
 <div className="flex items-center justify-between mt-3 sm:mt-4">
 <div className="flex gap-1.5 sm:gap-2">
 {videos.map((_, i) => (
 <button key={i} onClick={() => go(i)}
 className={`rounded-full transition-all duration-300 ${i === active ? `w-6 sm:w-8 h-2 bg-gradient-to-r ${gradient}` : 'w-2 h-2 bg-gray-700'}`}
 />
 ))}
 </div>
 <div className="flex gap-2">
 <motion.button onClick={() => go(active - 1)}
 className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:border-white/50 transition-all"
 whileTap={{ scale: 0.88 }}><ChevronLeft size={17} /></motion.button>
 <motion.button onClick={() => go(active + 1)}
 className={`w-10 h-10 rounded-full bg-gradient-to-r ${gradient} text-white flex items-center justify-center`}
 whileTap={{ scale: 0.88 }}><ChevronRight size={17} /></motion.button>
 </div>
 </div>
 </div>

 {/* Side list — clicking any item opens SubscriptionFlow for that video */}
 <div className="lg:col-span-2">
 <p className="text-[10px] font-orbitron uppercase tracking-widest text-gray-600 mb-3">Up Next</p>
 <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 snap-x snap-mandatory lg:snap-none" style={{ scrollbarWidth: 'none' }}>
 {videos.map((v, i) => {
 const g = catColors[v.category] ?? 'from-emerald-500 to-teal-400';
 return (
 <motion.button key={v.id}
 onClick={() => { go(i); openFlow(v); }}
 className={`flex-shrink-0 snap-start flex items-center gap-3 p-2.5 sm:p-3 rounded-xl text-left transition-all w-64 sm:w-72 lg:w-full ${i === active ? 'bg-white/8 border border-white/20' : 'border border-transparent hover:bg-white/5 hover:border-white/10'}`}>
 <div className="relative w-16 sm:w-20 aspect-[1350/760] rounded-lg overflow-hidden flex-shrink-0">
 <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover object-center" />
 <div className="absolute inset-0 /30" />
 {/* Play icon overlay */}
 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
 <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${g} flex items-center justify-center`}>
 <Play size={9} className="text-white fill-white ml-0.5" />
 </div>
 </div>
 {i === active && (
 <div className="absolute inset-0 flex items-center justify-center">
 <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${g} flex items-center justify-center`}>
 <Play size={9} className="text-white fill-white ml-0.5" />
 </div>
 </div>
 )}
 </div>
 <div className="flex-1 min-w-0">
 <p className={`font-bebas text-sm sm:text-base leading-tight truncate ${i === active ? 'text-white' : 'text-gray-300'}`}>{v.title}</p>
 <div className="flex items-center gap-1.5 mt-0.5">
 <span className={`text-[9px] font-orbitron font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r ${g}`}>{v.category}</span>
 <span className="text-gray-600 text-[9px]">·</span>
 <span className="text-gray-500 text-[9px] font-orbitron">{v.duration}</span>
 </div>
 </div>
 <div className="flex-shrink-0 flex items-center gap-0.5">
 <Star size={9} className="text-yellow-400 fill-yellow-400" />
 <span className="text-yellow-400 text-[10px] font-orbitron font-bold">{v.rating}</span>
 </div>
 </motion.button>
 );
 })}
 </div>
 </div>
 </div>
 </div>

 {/* SubscriptionFlow popup */}
 <SubscriptionFlow
 videoUrl={flowVideo?.url ?? null}
 title={flowVideo?.title}
 thumbnail={flowVideo?.thumb}
 onClose={() => setFlowVideo(null)}
 />
 </section>
 );
}
