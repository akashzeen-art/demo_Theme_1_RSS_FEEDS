// CookingTenGridSection — 10 × 2 grid using all 20 landscape Eatme images
import { useState } from 'react';
import { SectionVideoBg } from '@/components/SectionVideoBg';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Play, X, Star, Clock, Users } from 'lucide-react';
import { SubscriptionFlow } from './SubscriptionFlow';
import { getCookVideo } from './cookVideos';
const cards = [
 { id: '1', title: 'Grilled Salmon', category: 'Seafood', duration: '25 min', students: '87K', rating: '9.8', img: '/Eatme Landscape/S4.png' },
 { id: '2', title: 'Mushroom Risotto', category: 'Italian', duration: '40 min', students: '72K', rating: '9.6', img: '/Eatme Landscape/S5.png' },
 { id: '3', title: 'Chicken Tikka', category: 'Indian', duration: '45 min', students: '134K', rating: '9.9', img: '/Eatme Landscape/S6.png' },
 { id: '4', title: 'Beef Tacos', category: 'Mexican', duration: '30 min', students: '96K', rating: '9.7', img: '/Eatme Landscape/S7.png' },
 { id: '5', title: 'Shakshuka', category: 'Breakfast', duration: '20 min', students: '118K', rating: '9.8', img: '/Eatme Landscape/S8.png' },
 { id: '6', title: 'Lobster Bisque', category: 'Seafood', duration: '55 min', students: '54K', rating: '9.5', img: '/Eatme Landscape/S9.png' },
 { id: '7', title: 'Pad Thai', category: 'Thai', duration: '25 min', students: '109K', rating: '9.7', img: '/Eatme Landscape/S10.png' },
 { id: '8', title: 'Chocolate Lava Cake', category: 'Dessert', duration: '30 min', students: '143K', rating: '9.9', img: '/Eatme Landscape/S11.png' },
 { id: '9', title: 'Avocado Toast', category: 'Healthy', duration: '15 min', students: '201K', rating: '9.6', img: '/Eatme Landscape/S12.png' },
 { id: '10', title: 'Beef Wellington', category: 'British', duration: '90 min', students: '61K', rating: '9.8', img: '/Eatme Landscape/S13.png' },
 { id: '11', title: 'Pho Bo Soup', category: 'Vietnamese', duration: '60 min', students: '78K', rating: '9.7', img: '/Eatme Landscape/S14.png' },
 { id: '12', title: 'Baklava', category: 'Dessert', duration: '50 min', students: '45K', rating: '9.5', img: '/Eatme Landscape/S15.png' },
 { id: '13', title: 'Eggs Benedict', category: 'Breakfast', duration: '20 min', students: '92K', rating: '9.6', img: '/Eatme Landscape/P3.png' },
 { id: '14', title: 'Lamb Kofta', category: 'Middle East', duration: '35 min', students: '67K', rating: '9.5', img: '/Eatme Landscape/P4.png' },
 { id: '15', title: 'Tonkotsu Ramen', category: 'Japanese', duration: '120 min',students: '83K', rating: '9.9', img: '/Eatme Landscape/P5.png' },
 { id: '16', title: 'Bibimbap Bowl', category: 'Korean', duration: '35 min', students: '76K', rating: '9.7', img: '/Eatme Landscape/P6.png' },
 { id: '17', title: 'Focaccia Bread', category: 'Baking', duration: '180 min',students: '58K', rating: '9.6', img: '/Eatme Landscape/P7.png' },
 { id: '18', title: 'Tiramisu', category: 'Dessert', duration: '45 min', students: '112K', rating: '9.8', img: '/Eatme Landscape/P8.png' },
 { id: '19', title: 'Mango Sticky Rice', category: 'Thai', duration: '30 min', students: '89K', rating: '9.7', img: '/Eatme Landscape/P9.png' },
 { id: '20', title: 'Cinnamon Rolls', category: 'Baking', duration: '150 min',students: '127K', rating: '9.8', img: '/Eatme Landscape/P10.png' },
];

const catGrad: Record<string, string> = {
 Seafood: 'from-blue-500 to-cyan-400',
 Italian: 'from-orange-500 to-amber-400',
 Indian: 'from-amber-500 to-yellow-400',
 Mexican: 'from-red-500 to-orange-400',
 Breakfast: 'from-yellow-500 to-orange-400',
 Thai: 'from-orange-500 to-red-400',
 Dessert: 'from-pink-500 to-rose-400',
 Healthy: 'from-green-500 to-emerald-400',
 British: 'from-slate-500 to-gray-400',
 Vietnamese: 'from-emerald-500 to-teal-400',
 'Middle East':'from-amber-600 to-orange-500',
 Japanese: 'from-red-500 to-pink-400',
 Korean: 'from-rose-500 to-red-400',
 Baking: 'from-amber-500 to-yellow-400',
};

export function CookingTenGridSection() {
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
 {/* BG */}

 <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6">
 {/* Header */}
 <motion.div className="text-center mb-10 sm:mb-14"
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8 }} viewport={{ once: true }}>
 <p className="text-[9px] sm:text-[10px] font-orbitron uppercase tracking-[0.5em] text-orange-400 mb-3">
 Full Kitchen Collection
 </p>
 <h2 className="text-4xl sm:text-5xl md:text-7xl font-bebas font-black text-white mb-3">
 🍳 RECIPE GALLERY
 </h2>
 <p className="text-gray-400 max-w-md mx-auto text-xs sm:text-sm">
 20 handpicked dishes · 2 rows × 10 columns
 </p>
 </motion.div>

 {/* 10 cols × 2 rows — landscape aspect ratio */}
 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2 sm:gap-3">
 {cards.map((card, i) => {
 const gradient = catGrad[card.category] ?? 'from-orange-500 to-amber-400';
 return (
 <motion.div key={card.id}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, delay: i * 0.03 }}
 viewport={{ once: true }}
 className="relative group cursor-pointer rounded-xl overflow-hidden"
 style={{ aspectRatio: '3/4' }}
 whileHover={{ scale: 1.06, zIndex: 20 }}
 whileTap={{ scale: 0.97 }}
 onClick={() => setActiveVideo({ url: getCookVideo(parseInt(card.id) - 1), title: card.title, thumb: card.img })}
 >
 <img src={card.img} alt={card.title}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

 {/* Hover border glow */}
 <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-orange-400/50 transition-colors duration-300" />

 {/* Like */}
 <button
 onClick={e => { e.stopPropagation(); toggleLike(card.id); }}
 className={`absolute top-1.5 right-1.5 p-1 rounded-full border transition-all ${liked.has(card.id) ? 'bg-red-500/30 border-red-500/60' : '/50 border-white/20'}`}
 >
 <Heart size={10} className={liked.has(card.id) ? 'fill-red-500 text-red-500' : 'text-white'} />
 </button>

 {/* Bottom info */}
 <div className="absolute bottom-0 left-0 right-0 p-2">
 <p className="text-white font-bebas text-xs leading-tight line-clamp-1">{card.title}</p>
 <div className="flex items-center justify-between mt-0.5">
 <span className={`text-[8px] font-orbitron font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r ${gradient} truncate max-w-[60%]`}>
 {card.category}
 </span>
 <span className="flex items-center gap-0.5 flex-shrink-0">
 <Star size={7} className="text-yellow-400 fill-yellow-400" />
 <span className="text-yellow-400 text-[8px] font-orbitron">{card.rating}</span>
 </span>
 </div>
 </div>

 {/* Play overlay */}
 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
 <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg`}>
 <Play size={12} className="text-white fill-white ml-0.5" />
 </div>
 </div>
 </motion.div>
 );
 })}
 </div>
 </div>

 {/* Preview modal */}

 <SubscriptionFlow videoUrl={activeVideo?.url ?? null} title={activeVideo?.title} thumbnail={activeVideo?.thumb} onClose={() => setActiveVideo(null)} />
 </section>
 );
}
