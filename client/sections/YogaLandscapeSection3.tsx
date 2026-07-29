import { useState } from 'react';
import { SectionVideoBg } from '@/components/SectionVideoBg';
import { motion } from 'framer-motion';
import { Play, Star, Clock, Users, Sparkles, Wind } from 'lucide-react';
import { SubscriptionFlow } from './SubscriptionFlow';
import { getYogaVideo } from './yogaVideos';
import { landscapeThumb } from '@/lib/catalog';

const catGrad: Record<string, string> = {
 Yoga: 'from-emerald-500 to-teal-400',
 Meditation:'from-teal-500 to-cyan-400',
};

// S1–S12
const LANDSCAPE_1 = [
 { id: 1, title: 'Sunrise Vinyasa Flow', category: 'Yoga', duration: '32 min', students: '128K', rating: '9.9' },
 { id: 2, title: 'Deep Yin & Restore', category: 'Yoga', duration: '45 min', students: '112K', rating: '9.8' },
 { id: 3, title: 'Power Core Blast', category: 'Yoga', duration: '40 min', students: '103K', rating: '9.7' },
 { id: 4, title: 'Ashtanga Fundamentals', category: 'Yoga', duration: '50 min', students: '76K', rating: '9.6' },
 { id: 5, title: 'Breathwork & Pranayama', category: 'Meditation', duration: '30 min', students: '94K', rating: '9.9' },
 { id: 6, title: 'Kundalini Awakening', category: 'Yoga', duration: '55 min', students: '88K', rating: '9.8' },
 { id: 7, title: 'Hatha Yoga Basics', category: 'Yoga', duration: '35 min', students: '134K', rating: '9.7' },
 { id: 8, title: 'Restorative Deep Stretch',category: 'Yoga', duration: '60 min', students: '97K', rating: '9.8' },
 { id: 9, title: 'Guided Meditation', category: 'Meditation', duration: '25 min', students: '156K', rating: '9.9' },
 { id: 10, title: 'Prenatal Yoga', category: 'Yoga', duration: '40 min', students: '72K', rating: '9.6' },
 { id: 11, title: 'Chair Yoga for Seniors', category: 'Yoga', duration: '30 min', students: '89K', rating: '9.7' },
 { id: 12, title: 'Hot Yoga Flow', category: 'Yoga', duration: '45 min', students: '67K', rating: '9.6' },
];

// S13–S25
const LANDSCAPE_2 = [
 { id: 13, title: 'Yoga Nidra Sleep', category: 'Meditation', duration: '35 min', students: '143K', rating: '9.9' },
 { id: 14, title: 'Aerial Yoga Basics', category: 'Yoga', duration: '50 min', students: '54K', rating: '9.5' },
 { id: 15, title: 'Acro Yoga Partner Flow', category: 'Yoga', duration: '55 min', students: '48K', rating: '9.6' },
 { id: 16, title: 'Bikram Yoga Series', category: 'Yoga', duration: '60 min', students: '72K', rating: '9.7' },
 { id: 17, title: 'Yoga for Back Pain', category: 'Yoga', duration: '40 min', students: '201K', rating: '9.8' },
 { id: 18, title: 'Sound Bath Meditation', category: 'Meditation', duration: '45 min', students: '118K', rating: '9.9' },
 { id: 19, title: 'Kids Yoga Adventure', category: 'Yoga', duration: '25 min', students: '96K', rating: '9.6' },
 { id: 20, title: 'Yoga for Athletes', category: 'Yoga', duration: '50 min', students: '83K', rating: '9.7' },
 { id: 21, title: 'Vinyasa Sunrise II', category: 'Yoga', duration: '32 min', students: '91K', rating: '9.8' },
 { id: 22, title: 'Yin Flow Deep', category: 'Yoga', duration: '45 min', students: '78K', rating: '9.7' },
 { id: 23, title: 'Core Power Yoga', category: 'Yoga', duration: '40 min', students: '105K', rating: '9.8' },
 { id: 24, title: 'Breathwork Journey', category: 'Meditation', duration: '30 min', students: '87K', rating: '9.9' },
 { id: 25, title: 'Ashtanga Flow II', category: 'Yoga', duration: '50 min', students: '64K', rating: '9.6' },
];

function LandscapeRow({ cards, viOffset }: { cards: typeof LANDSCAPE_1; viOffset: number }) {
 const [activeVideo, setActiveVideo] = useState<{ url: string; title: string; thumb: string } | null>(null);
 return (
 <>
 <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
 <div className="flex gap-4 sm:gap-5">
 {cards.map((card, i) => {
 const gradient = catGrad[card.category] ?? 'from-emerald-500 to-teal-400';
 const img = landscapeThumb(card.id);
 return (
 <motion.div key={card.id}
 className="relative flex-shrink-0 w-64 sm:w-80 md:w-96 group cursor-pointer rounded-2xl overflow-hidden"
 style={{ aspectRatio: '1350/760' }}
 initial={{ opacity: 0, x: 30 }}
 whileInView={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.4, delay: i * 0.05 }}
 viewport={{ once: true }}
 whileHover={{ scale: 1.03, zIndex: 10 }}
 onClick={() => setActiveVideo({ url: getYogaVideo(viOffset + i), title: card.title, thumb: img })}>
 <img src={img} alt={card.title}
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
 <SubscriptionFlow videoUrl={activeVideo?.url ?? null} title={activeVideo?.title} thumbnail={activeVideo?.thumb} onClose={() => setActiveVideo(null)} />
 </>
 );
}

export function YogaLandscapeSection3() {
 return (
 <section className="relative py-12 md:py-20 overflow-hidden">
 <SectionVideoBg />
 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <motion.div className="flex items-center gap-3 mb-8 md:mb-10"
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }} viewport={{ once: true }}>
 <Wind className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
 <div>
 <h2 className="text-3xl md:text-5xl font-bebas font-black text-white">🧘 Flow & Breathe</h2>
 <p className="text-gray-400 text-xs sm:text-sm mt-1">Immersive yoga sessions in widescreen</p>
 <div className="w-16 h-1 bg-emerald-400 rounded-full mt-1" />
 </div>
 </motion.div>
 <LandscapeRow cards={LANDSCAPE_1} viOffset={0} />
 </div>
 </section>
 );
}

export function YogaLandscapeSection4() {
 return (
 <section className="relative py-12 md:py-20 overflow-hidden">
 <SectionVideoBg />
 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <motion.div className="flex items-center gap-3 mb-8 md:mb-10"
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }} viewport={{ once: true }}>
 <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-teal-400" />
 <div>
 <h2 className="text-3xl md:text-5xl font-bebas font-black text-white">✨ Wellness Sessions</h2>
 <p className="text-gray-400 text-xs sm:text-sm mt-1">Speciality yoga & meditation for deeper practice</p>
 <div className="w-16 h-1 bg-teal-400 rounded-full mt-1" />
 </div>
 </motion.div>
 <LandscapeRow cards={LANDSCAPE_2} viOffset={12} />
 </div>
 </section>
 );
}
