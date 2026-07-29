// CookingGridSection — extra cooking grid using remaining Eatme Portrait images
import { useState } from 'react';
import { SectionVideoBg } from '@/components/SectionVideoBg';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Play, X, Star } from 'lucide-react';
import { SubscriptionFlow } from './SubscriptionFlow';
import { getVideo } from './desiVideos';
const cards = [
 { id: '1', title: 'Hidden Fear Ep3', category: 'Thriller', rating: '9.8', img: '/Potrait-New_desi/BLACK DIARY SECRETS  EP2.jpg' },
 { id: '2', title: 'Hidden Fear Ep4', category: 'Thriller', rating: '9.6', img: '/Potrait-New_desi/BLACK SIGNAL.jpg' },
 { id: '3', title: 'The Silent Hunt', category: 'Action', rating: '9.7', img: '/Potrait-New_desi/DANGEROUS ALLIANCE.jpg' },
 { id: '4', title: 'The Last Chance', category: 'Drama', rating: '9.5', img: '/Potrait-New_desi/DANGEROUS MINDS EP1.jpg' },
 { id: '5', title: 'Shadow Force', category: 'Action', rating: '9.9', img: '/Potrait-New_desi/DANGEROUS MINDS EP2.jpg' },
 { id: '6', title: 'Crimewave', category: 'Crime', rating: '9.4', img: '/Potrait-New_desi/DANGEROUS MINDS EP3.jpg' },
 { id: '7', title: 'Mystery Avenue', category: 'Mystery', rating: '9.7', img: '/Potrait-New_desi/DANGEROUS MINDS EP4.jpg' },
 { id: '8', title: 'Dangerous Destination Ep1',category: 'Thriller', rating: '9.8', img: '/Potrait-New_desi/DANGEROUS TERRITORY.jpg' },
 { id: '9', title: 'Dangerous Destination Ep2',category: 'Thriller', rating: '9.6', img: '/Potrait-New_desi/DARK CITY FILES.jpg' },
 { id: '10', title: 'Dangerous Destination Ep3',category: 'Thriller', rating: '9.5', img: '/Potrait-New_desi/DEAD END MISSON.jpg' },
 { id: '11', title: 'Dangerous Destination Ep4',category: 'Thriller', rating: '9.9', img: '/Potrait-New_desi/ESCAPE BEYOND FEAR EP1.jpg' },
 { id: '12', title: 'Killer Wali Raat', category: 'Crime', rating: '9.7', img: '/Potrait-New_desi/ESCAPE BEYOND FEAR EP2.jpg' },
];

const catGrad: Record<string, string> = {
 Thriller: 'from-red-500 to-orange-400',
 Action: 'from-orange-500 to-amber-400',
 Crime: 'from-rose-500 to-red-400',
 Drama: 'from-purple-500 to-pink-400',
 Mystery: 'from-blue-500 to-cyan-400',
};

export function CookingGridSection() {
 const [liked, setLiked] = useState<Set<string>>(new Set());
 const [activeVideo, setActiveVideo] = useState<{ url: string; title: string; thumb: string } | null>(null);
 const [preview, setPreview] = useState<string | null>(null);
 const previewCard = cards.find(c => c.id === preview);

 const toggleLike = (id: string) => {
 setLiked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
 };

 return (
 <section className="relative w-full overflow-hidden py-16 sm:py-24">
 <SectionVideoBg />

 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
 <motion.div className="text-center mb-10 sm:mb-16"
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8 }} viewport={{ once: true }}>
 <div className="flex items-center justify-center gap-2 mb-3">
 <p className="text-[9px] sm:text-[10px] font-orbitron uppercase tracking-[0.5em] text-red-400">Spotlight Collection</p>
 </div>
 <h2 className="text-3xl md:text-5xl font-bebas font-black text-white">
 <span className="gradient-text">🎬 Spotlight</span>
 </h2>
 <p className="text-gray-400 max-w-md mx-auto text-xs sm:text-sm">Every title in its own dimension. Tap to explore.</p>
 </motion.div>

 {/* Mobile: 2 cols | Desktop: 6 cols (2 rows) */}
 <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4">
 {cards.map((card, i) => {
 const gradient = catGrad[card.category] ?? 'from-orange-500 to-amber-400';
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
 onClick={() => setActiveVideo({ url: getVideo(parseInt(card.id) + 74), title: card.title, thumb: card.img })}>
 <img src={card.img} alt={card.title}
 className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
 <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-white/25 transition-colors duration-300" />

 <button onClick={e => { e.stopPropagation(); toggleLike(card.id); }}
 className={`absolute top-2 right-2 p-1.5 rounded-full border transition-all ${liked.has(card.id) ? 'bg-red-500/30 border-red-500/60' : '/50 border-white/20'}`}>
 <Heart size={12} className={liked.has(card.id) ? 'fill-red-500 text-red-500' : 'text-white'} />
 </button>

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
 transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
 <div className="flex justify-center pt-3 pb-1 sm:hidden">
 <div className="w-10 h-1 rounded-full bg-white/20" />
 </div>
 <div className="relative">
 <img src={previewCard.img} alt={previewCard.title} className="w-full h-52 sm:h-64 object-cover" />
 <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
 <button onClick={() => setPreview(null)}
 className="absolute top-3 right-3 p-2 rounded-full /60 border border-white/20 text-white">
 <X size={15} />
 </button>
 </div>
 <div className="p-5 sm:p-6">
 <div className="flex items-center gap-2 mb-2">
 <span className={`px-2.5 py-1 text-[10px] font-orbitron font-bold uppercase bg-gradient-to-r ${catGrad[previewCard.category] ?? 'from-orange-500 to-amber-400'} text-white rounded-full`}>{previewCard.category}</span>
 <span className="flex items-center gap-1 ml-auto">
 <Star size={10} className="text-yellow-400 fill-yellow-400" />
 <span className="text-yellow-400 text-xs font-orbitron font-bold">{previewCard.rating}</span>
 </span>
 </div>
 <h3 className="text-3xl sm:text-4xl font-bebas font-black text-white mb-2">{previewCard.title}</h3>
 <p className="text-gray-400 text-sm mb-5">An explosive episode you won't want to miss.</p>
 <button className={`w-full py-4 bg-gradient-to-r ${catGrad[previewCard.category] ?? 'from-orange-500 to-amber-400'} text-white font-bebas font-bold uppercase text-base rounded-xl flex items-center justify-center gap-2 min-h-[52px]`}>
 <Play size={16} className="fill-white" /> Cook Now
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
