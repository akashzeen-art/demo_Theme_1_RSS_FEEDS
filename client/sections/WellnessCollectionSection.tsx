// WellnessCollectionSection — curated crime & thriller grid
import { useState } from 'react';
import { SectionVideoBg } from '@/components/SectionVideoBg';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Play, X, Star } from 'lucide-react';
import { SubscriptionFlow } from './SubscriptionFlow';
import { getVideo } from './desiVideos';
const cards = [
 { id: '1', title: 'The Last Deal', thumbnail: '/portrait/THELASTDEAL.jpg', category: 'Crime', year: '2024', rating: '9.9' },
 { id: '2', title: 'The Crime Circle', thumbnail: '/portrait/THECRIMECIRCLE.jpg', category: 'Crime', year: '2024', rating: '9.7' },
 { id: '3', title: 'Secret Nights', thumbnail: '/portrait/SECRETNIGHTS.jpg', category: 'Thriller', year: '2024', rating: '9.8' },
 { id: '4', title: 'Mission Darknight', thumbnail: '/portrait/MISSSIONDARKNIGHT.jpg', category: 'Action', year: '2024', rating: '9.6' },
 { id: '5', title: 'Adventure Ke Raaz', thumbnail: '/portrait/ADVENTUREKERAAZ.jpg', category: 'Drama', year: '2024', rating: '9.7' },
 { id: '6', title: 'Killer Instinct', thumbnail: '/portrait/KILLERINSTINCT.jpg', category: 'Thriller', year: '2024', rating: '9.5' },
 { id: '7', title: 'Escape Route 21', thumbnail: '/portrait/ESCAPEROUT21.jpg', category: 'Action', year: '2024', rating: '9.9' },
 { id: '8', title: 'Black Signal', thumbnail: '/portrait/BLACKSIGNAL.jpg', category: 'Mystery', year: '2024', rating: '9.8' },
 { id: '9', title: 'Rogue Nation', thumbnail: '/portrait/ROGUEMISSON.jpg', category: 'Action', year: '2024', rating: '9.6' },
 { id: '10', title: 'Silent Witness', thumbnail: '/portrait/BEYONDSUSPICIONEP1.jpg', category: 'Crime', year: '2024', rating: '9.7' },
 { id: '11', title: 'Hidden Fear Ep1', thumbnail: '/portrait/BEYONDSUSPICIONEP2.jpg', category: 'Thriller', year: '2024', rating: '9.8' },
 { id: '12', title: 'Hidden Fear Ep2', thumbnail: '/portrait/BLACKDIARYSECRETSEP1.jpg', category: 'Thriller', year: '2024', rating: '9.5' },
];

const catGrad: Record<string, string> = {
 Crime: 'from-rose-500 to-red-400',
 Thriller: 'from-red-500 to-orange-400',
 Action: 'from-orange-500 to-amber-400',
 Drama: 'from-purple-500 to-pink-400',
 Mystery: 'from-blue-500 to-cyan-400',
};
const catGlow: Record<string, string> = {
 Crime: 'rgba(244,63,94,0.5)',
 Thriller: 'rgba(239,68,68,0.5)',
 Action: 'rgba(249,115,22,0.5)',
 Drama: 'rgba(168,85,247,0.5)',
 Mystery: 'rgba(59,130,246,0.5)',
};

export function WellnessCollectionSection() {
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
 {/* Background */}

 {/* Stars */}
 {[...Array(20)].map((_, i) => (
 <div key={i} className="absolute rounded-full bg-white hidden sm:block"
 style={{ width: i % 5 === 0 ? 2 : 1, height: i % 5 === 0 ? 2 : 1,
 left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`,
 opacity: 0.1 + (i % 4) * 0.1 }} />
 ))}

 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
 {/* Header */}
 <motion.div className="text-center mb-10 sm:mb-16"
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8 }} viewport={{ once: true }}>
 <p className="text-[9px] sm:text-[10px] font-orbitron uppercase tracking-[0.5em] text-red-400 mb-3">
 Explore the Collection
 </p>
 <h2 className="text-4xl sm:text-5xl md:text-7xl font-bebas font-black text-white mb-3">
 CONTENT UNIVERSE
 </h2>
 <p className="text-gray-500 max-w-md mx-auto text-xs sm:text-sm">
 Every title in its own dimension. Tap to preview.
 </p>
 </motion.div>

 {/* Mobile: 2 cols (6 rows) | Desktop: 6 cols (2 rows) */}
 <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4">
 {cards.map((card, i) => {
 const gradient = catGrad[card.category] ?? 'from-emerald-500 to-teal-400';
 const glow = catGlow[card.category] ?? 'rgba(16,185,129,0.5)';
 return (
 <motion.div key={card.id}
 initial={{ opacity: 0, y: 24 }}
 whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: i * 0.05 }}
 viewport={{ once: true }}
 className="relative group cursor-pointer rounded-xl overflow-hidden"
 style={{ aspectRatio: '1080/1350' }}
 whileHover={{ scale: 1.04, zIndex: 10 }}
 whileTap={{ scale: 0.97 }}
 onClick={() => setActiveVideo({ url: getVideo(parseInt(card.id) + 62), title: card.title, thumb: card.thumbnail })}
 >
 <img src={card.thumbnail} alt={card.title}
 className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

 {/* Glow border */}
 <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-white/25 transition-colors duration-300"
 style={{ boxShadow: `0 0 0 0 ${glow}` }} />

 {/* Like button */}
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
 <span className={`text-[9px] font-orbitron font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
 {card.category}
 </span>
 <span className="flex items-center gap-0.5">
 <Star size={8} className="text-yellow-400 fill-yellow-400" />
 <span className="text-yellow-400 text-[9px] font-orbitron">{card.rating}</span>
 </span>
 </div>
 </div>

 {/* Play overlay */}
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

 {/* Preview modal — sheet on mobile, dialog on desktop */}
 <AnimatePresence>
 {preview && previewCard && (
 <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
 <motion.div className="absolute inset-0 bg-black/80 " onClick={() => setPreview(null)} />
 <motion.div
 className="relative z-10 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden bg-gray-950 border border-white/10"
 initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
 transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
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
 <span className={`px-2.5 py-1 text-[10px] font-orbitron font-bold uppercase bg-gradient-to-r ${catGrad[previewCard.category]} text-white rounded-full`}>
 {previewCard.category}
 </span>
 <span className="text-gray-500 text-xs font-orbitron">{previewCard.year}</span>
 <span className="flex items-center gap-1 ml-auto">
 <Star size={10} className="text-yellow-400 fill-yellow-400" />
 <span className="text-yellow-400 text-xs font-orbitron font-bold">{previewCard.rating}</span>
 </span>
 </div>
 <h3 className="text-3xl sm:text-4xl font-bebas font-black text-white mb-2">{previewCard.title}</h3>
 <p className="text-gray-400 text-sm mb-5">A gripping story that will keep you on the edge of your seat.</p>
 <button className={`w-full py-4 bg-gradient-to-r ${catGrad[previewCard.category]} text-white font-bebas font-bold uppercase text-base rounded-xl flex items-center justify-center gap-2 min-h-[52px]`}>
 <Play size={16} className="fill-white" /> Start Class
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
