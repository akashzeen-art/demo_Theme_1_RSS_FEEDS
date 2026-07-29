// Section 6 — Universe / Card Grid (mobile-first grid replaces orbit)
import { useState } from 'react';
import { SectionVideoBg } from '@/components/SectionVideoBg';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Play, X, Star } from 'lucide-react';
import { SubscriptionFlow } from './SubscriptionFlow';
import { getVideo } from './desiVideos';
const cards = [
 { id: '1', title: 'Code Red Mafia', thumbnail: '/Potrait-New_desi/ESCAPE BEYOND FEAR EP3.jpg', category: 'Crime', year: '2024', rating: '9.9' },
 { id: '2', title: 'Blackmail Junction', thumbnail: '/Potrait-New_desi/ESCAPE FROM NOWHERE.jpg', category: 'Thriller', year: '2024', rating: '9.7' },
 { id: '3', title: 'The Unofficial Network', thumbnail: '/Potrait-New_desi/ESCAPE PLAN 302.jpg', category: 'Mystery', year: '2024', rating: '9.8' },
 { id: '4', title: 'Shadow Operation', thumbnail: '/Potrait-New_desi/ESCAPE ROUT 21.jpg', category: 'Action', year: '2024', rating: '9.6' },
 { id: '5', title: 'Chase to Danger Ep1', thumbnail: '/Potrait-New_desi/FATAL CONNECTIONS EP1.jpg', category: 'Thriller', year: '2024', rating: '9.7' },
 { id: '6', title: 'Chase to Danger Ep2', thumbnail: '/Potrait-New_desi/FATAL CONNECTIONS EP2.jpg', category: 'Thriller', year: '2024', rating: '9.5' },
 { id: '7', title: 'Chase to Danger Ep3', thumbnail: '/Potrait-New_desi/FATAL CONNECTIONS EP3.jpg', category: 'Thriller', year: '2024', rating: '9.9' },
 { id: '8', title: 'Chase to Danger Ep4', thumbnail: '/Potrait-New_desi/FINAL COUNTDOWN.jpg', category: 'Thriller', year: '2024', rating: '9.8' },
 { id: '9', title: 'Dark Evidence', thumbnail: '/Potrait-New_desi/FINAL WITNESS.jpg', category: 'Crime', year: '2024', rating: '9.6' },
 { id: '10', title: 'The Last Truth Ep1', thumbnail: '/Potrait-New_desi/HER STORY.jpg', category: 'Drama', year: '2024', rating: '9.7' },
 { id: '11', title: 'The Last Truth Ep2', thumbnail: '/Potrait-New_desi/KILLER INSTINCT.jpg', category: 'Drama', year: '2024', rating: '9.8' },
 { id: '12', title: 'Crime Syndicate', thumbnail: '/Potrait-New_desi/LAST MISSION ALIVE.jpg', category: 'Crime', year: '2024', rating: '9.5' },
];

const catGrad: Record<string, string> = {
 Yoga: 'from-emerald-500 to-teal-400',
 Cooking: 'from-orange-500 to-amber-400',
 Baking: 'from-amber-500 to-yellow-400',
 Meditation: 'from-teal-500 to-cyan-400',
 Healthy: 'from-green-500 to-emerald-400',
};
const catGlow: Record<string, string> = {
 Yoga: 'rgba(16,185,129,0.5)',
 Cooking: 'rgba(249,115,22,0.5)',
 Baking: 'rgba(245,158,11,0.5)',
 Meditation: 'rgba(20,184,166,0.5)',
 Healthy: 'rgba(34,197,94,0.5)',
};

export function UniverseSection() {
 const [liked, setLiked] = useState<Set<string>>(new Set());
 const [preview, setPreview] = useState<string | null>(null);
 const [activeVideo, setActiveVideo] = useState<{ url: string; title: string; thumb: string } | null>(null);

 const previewCard = cards.find(c => c.id === preview);

 const toggleLike = (id: string) => {
 setLiked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
 };

 return (
 <section className="relative w-full overflow-hidden py-16 sm:py-24">
 <SectionVideoBg />
 {/* Space bg */}

 {/* Stars */}
 {[...Array(20)].map((_, i) => (
 <motion.div key={i} className="absolute rounded-full bg-white hidden sm:block"
 style={{ width: i % 5 === 0 ? 2 : 1, height: i % 5 === 0 ? 2 : 1, left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, opacity: 0.15 + (i % 4) * 0.1 }}
 animate={{ opacity: [0.05, 0.5, 0.05] }} transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: i * 0.25 }}
 />
 ))}

 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
 {/* Header */}
 <motion.div className="text-center mb-10 sm:mb-16"
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8 }} viewport={{ once: true }}
 >
 <p className="text-[9px] sm:text-[10px] font-orbitron uppercase tracking-[0.5em] text-emerald-400 mb-3">Explore the Collection</p>
 <h2 className="text-4xl sm:text-5xl md:text-7xl font-bebas font-black text-white mb-3">FLOATING UNIVERSE</h2>
 <p className="text-gray-500 max-w-md mx-auto text-xs sm:text-sm">
 Every title in its own dimension. Tap to preview.
 </p>
 </motion.div>

 {/* Mobile: 2 cols (6 rows) | Desktop: 6 cols (2 rows) */}
 <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4">
 {cards.map((card, i) => {
 const gradient = catGrad[card.category] ?? 'from-purple-500 to-blue-400';
 const glow = catGlow[card.category] ?? 'rgba(139,92,246,0.5)';
 return (
 <motion.div key={card.id}
 initial={{ opacity: 0, y: 24 }}
 whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: i * 0.06 }}
 viewport={{ once: true }}
 className="relative group cursor-pointer rounded-xl overflow-hidden"
 style={{ aspectRatio: '2/3' }}
 whileHover={{ scale: 1.04, zIndex: 10 }}
 whileTap={{ scale: 0.97 }}
 onClick={() => setActiveVideo({ url: getVideo(parseInt(card.id) + 86), title: card.title, thumb: card.thumbnail })}
 >
 <img src={card.thumbnail} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

 {/* Glow border */}
 <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-white/25 transition-colors duration-300"
 style={{ boxShadow: `0 0 0 0 ${glow}` }} />

 {/* Like button — top right */}
 <button
 onClick={e => { e.stopPropagation(); toggleLike(card.id); }}
 className={`absolute top-2 right-2 p-1.5 rounded-full border transition-all ${liked.has(card.id) ? 'bg-red-500/30 border-red-500/60' : '/50 border-white/20'}`}
 >
 <Heart size={12} className={liked.has(card.id) ? 'fill-red-500 text-red-500' : 'text-white'} />
 </button>

 {/* Bottom info */}
 <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
 <p className="text-white font-bebas text-sm sm:text-base leading-tight line-clamp-1">{card.title}</p>
 <div className="flex items-center justify-between mt-0.5">
 <span className={`text-[9px] font-orbitron font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>{card.category}</span>
 <span className="flex items-center gap-0.5">
 <Star size={8} className="text-yellow-400 fill-yellow-400" />
 <span className="text-yellow-400 text-[9px] font-orbitron">{card.rating}</span>
 </span>
 </div>
 </div>

 {/* Play overlay on hover */}
 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
 <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg`}>
 <Play size={14} className="text-white fill-white ml-0.5" />
 </div>
 </div>
 </motion.div>
 );
 })}
 </div>


 </div>

 {/* Preview modal */}
 <AnimatePresence>
 {preview && previewCard && (
 <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
 <motion.div className="absolute inset-0 bg-black/80 " onClick={() => setPreview(null)} />
 <motion.div
 className="relative z-10 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden bg-gray-950 border border-white/10"
 initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
 transition={{ type: 'spring', damping: 30, stiffness: 300 }}
 >
 {/* Drag handle on mobile */}
 <div className="flex justify-center pt-3 pb-1 sm:hidden">
 <div className="w-10 h-1 rounded-full bg-white/20" />
 </div>
 <div className="relative">
 <img src={previewCard.thumbnail} alt={previewCard.title} className="w-full h-52 sm:h-64 object-cover" />
 <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
 <button onClick={() => setPreview(null)}
 className="absolute top-3 right-3 p-2 rounded-full /60 border border-white/20 text-white">
 <X size={15} />
 </button>
 </div>
 <div className="p-5 sm:p-6">
 <div className="flex items-center gap-2 mb-2">
 <span className={`px-2.5 py-1 text-[10px] font-orbitron font-bold uppercase bg-gradient-to-r ${catGrad[previewCard.category]} text-white rounded-full`}>{previewCard.category}</span>
 <span className="text-gray-500 text-xs font-orbitron">{previewCard.year}</span>
 <span className="flex items-center gap-1 ml-auto"><Star size={10} className="text-yellow-400 fill-yellow-400" /><span className="text-yellow-400 text-xs font-orbitron font-bold">{previewCard.rating}</span></span>
 </div>
 <h3 className="text-3xl sm:text-4xl font-bebas font-black text-white mb-2">{previewCard.title}</h3>
 <p className="text-gray-400 text-sm mb-5">A gripping story that will keep you on the edge of your seat.</p>
 <button className={`w-full py-4 bg-gradient-to-r ${catGrad[previewCard.category] ?? 'from-emerald-500 to-teal-400'} text-white font-bebas font-bold uppercase text-base rounded-xl flex items-center justify-center gap-2 min-h-[52px]`}>
 <Play size={16} className="fill-white" /> Start Now
 </button>
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>

 <SubscriptionFlow videoUrl={activeVideo?.url ?? null} title={activeVideo?.title} thumbnail={activeVideo?.thumb} onClose={() => setActiveVideo(null)} />
 </section>
 );
}
