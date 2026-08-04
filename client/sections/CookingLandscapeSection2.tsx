// CookingLandscapeSection2 — second 10 landscape cards (P3–P10 + S14–S15)
import { useState } from 'react';
import { SectionVideoBg } from '@/components/SectionVideoBg';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Star, X, Clock, Users, Utensils } from 'lucide-react';
import { SubscriptionFlow } from './SubscriptionFlow';
import { getVideo } from './desiVideos';
const cards = [
 { id: '1', title: 'Pho Bo Noodle Soup', category: 'Vietnamese', duration: '60 min', students: '78K', rating: '9.7', img: '/landscape/DEADENDMISSON.jpg' },
 { id: '2', title: 'Baklava Masterclass', category: 'Dessert', duration: '50 min', students: '45K', rating: '9.5', img: '/landscape/ESCAPEBEYONDFEAREP1.jpg' },
 { id: '3', title: 'Eggs Benedict', category: 'Breakfast', duration: '20 min', students: '92K', rating: '9.6', img: '/landscape/BEYONDSUSPICIONEP2.jpg' },
 { id: '4', title: 'Lamb Kofta Skewers', category: 'Middle East', duration: '35 min', students: '67K', rating: '9.5', img: '/landscape/BLACKDIARYSECRETSEP1.jpg' },
 { id: '5', title: 'Tonkotsu Ramen', category: 'Japanese', duration: '120 min', students: '83K', rating: '9.9', img: '/landscape/BLACKDIARYSECRETSEP2.jpg' },
 { id: '6', title: 'Bibimbap Bowl', category: 'Korean', duration: '35 min', students: '76K', rating: '9.7', img: '/landscape/BLACKSIGNAL.jpg' },
 { id: '7', title: 'Focaccia Bread', category: 'Baking', duration: '180 min', students: '58K', rating: '9.6', img: '/landscape/DANGEROUSALLIANCE.jpg' },
 { id: '8', title: 'Tiramisu Masterclass', category: 'Dessert', duration: '45 min', students: '112K', rating: '9.8', img: '/landscape/DANGEROUSMINDSEP1.jpg' },
 { id: '9', title: 'Mango Sticky Rice', category: 'Thai', duration: '30 min', students: '89K', rating: '9.7', img: '/landscape/DANGEROUSMINDSEP2.jpg' },
 { id: '10', title: 'Cinnamon Rolls', category: 'Baking', duration: '150 min', students: '127K', rating: '9.8', img: '/landscape/DANGEROUSMINDSEP3.jpg' },
];

const catGrad: Record<string, string> = {
 Vietnamese: 'from-emerald-500 to-teal-400',
 Dessert: 'from-pink-500 to-rose-400',
 Breakfast: 'from-yellow-500 to-orange-400',
 'Middle East':'from-amber-600 to-orange-500',
 Japanese: 'from-red-500 to-pink-400',
 Korean: 'from-rose-500 to-red-400',
 Baking: 'from-amber-500 to-yellow-400',
 Thai: 'from-orange-500 to-red-400',
};

export function CookingLandscapeSection2() {
 const [activeVideo, setActiveVideo] = useState<{ url: string; title: string; thumb: string } | null>(null);

 return (
 <section className="relative py-12 md:py-20 overflow-hidden">
 <SectionVideoBg />

 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <motion.div className="flex items-center gap-3 mb-8 md:mb-10"
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }} viewport={{ once: true }}>
 <Utensils className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
 <div>
 <h2 className="text-3xl md:text-5xl font-bebas font-black text-white">🌏 World Kitchen</h2>
 <p className="text-gray-400 text-xs sm:text-sm mt-1">Global flavours from every corner of the world</p>
 <div className="w-16 h-1 bg-amber-400 rounded-full mt-1" />
 </div>
 </motion.div>

 <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
 <div className="flex gap-4 sm:gap-5">
 {cards.map((card, i) => {
 const gradient = catGrad[card.category] ?? 'from-amber-500 to-orange-400';
 return (
 <motion.div key={card.id}
 className="relative flex-shrink-0 w-64 sm:w-80 md:w-96 group cursor-pointer rounded-2xl overflow-hidden"
 style={{ aspectRatio: '1350/760' }}
 initial={{ opacity: 0, x: 30 }}
 whileInView={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.4, delay: i * 0.05 }}
 viewport={{ once: true }}
 whileHover={{ scale: 1.03, zIndex: 10 }}
 onClick={() => setActiveVideo({ url: getVideo(parseInt(card.id) + 10), title: card.title, thumb: card.img })}>
 <img src={card.img} alt={card.title}
 className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
 <div className={`absolute top-3 left-3 px-2.5 py-1 text-[10px] font-orbitron font-bold uppercase bg-gradient-to-r ${gradient} text-white rounded-full`}>
 {card.category}
 </div>
 <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
 <h3 className="text-white font-bebas text-lg sm:text-xl leading-tight mb-1">{card.title}</h3>
 <div className="flex items-center gap-3 text-[10px] sm:text-xs font-orbitron text-gray-400">
 <span className="flex items-center gap-1"><Star size={9} className="fill-yellow-400 text-yellow-400" /><span className="text-yellow-400 font-bold">{card.rating}</span></span>
 <span className="flex items-center gap-1"><Clock size={9} />{card.duration}</span>
 <span className="flex items-center gap-1"><Users size={9} />{card.students}</span>
 </div>
 </div>
 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
 <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center shadow-xl`}>
 <Play size={18} className="text-white fill-white ml-0.5" />
 </div>
 </div>
 <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-white/30 transition-colors duration-300" />
 </motion.div>
 );
 })}
 </div>
 </div>
 </div>

 <SubscriptionFlow videoUrl={activeVideo?.url ?? null} title={activeVideo?.title} thumbnail={activeVideo?.thumb} onClose={() => setActiveVideo(null)} />
 </section>
 );
}
