import { useState } from 'react';
import { SectionVideoBg } from '@/components/SectionVideoBg';
import { motion } from 'framer-motion';
import { Star, Play, Wind, Flame, Heart, Sparkles } from 'lucide-react';
import { SubscriptionFlow } from './SubscriptionFlow';
import { getYogaVideo } from './yogaVideos';

// Portrait items 1–10
const PORTRAIT_1 = [
 { title: 'Morning Vinyasa Flow', genre: 'Yoga', rating: '4.9', duration: '32 min', img: '/Yoga Portrait/1.png', vi: 0 },
 { title: 'Yin & Restore', genre: 'Yoga', rating: '4.8', duration: '45 min', img: '/Yoga Portrait/2.png', vi: 1 },
 { title: 'Power Core Flow', genre: 'Yoga', rating: '4.9', duration: '40 min', img: '/Yoga Portrait/3.png', vi: 2 },
 { title: 'Ashtanga Fundamentals', genre: 'Yoga', rating: '4.7', duration: '50 min', img: '/Yoga Portrait/4.png', vi: 3 },
 { title: 'Breathwork & Pranayama', genre: 'Meditation', rating: '4.9', duration: '30 min', img: '/Yoga Portrait/5.png', vi: 4 },
 { title: 'Kundalini Awakening', genre: 'Yoga', rating: '4.8', duration: '55 min', img: '/Yoga Portrait/6.png', vi: 5 },
 { title: 'Hatha Yoga Basics', genre: 'Yoga', rating: '4.7', duration: '35 min', img: '/Yoga Portrait/7.png', vi: 6 },
 { title: 'Restorative Deep Stretch',genre: 'Yoga', rating: '4.8', duration: '60 min', img: '/Yoga Portrait/8.png', vi: 7 },
 { title: 'Guided Meditation', genre: 'Meditation', rating: '4.9', duration: '25 min', img: '/Yoga Portrait/9.png', vi: 8 },
 { title: 'Prenatal Yoga', genre: 'Yoga', rating: '4.6', duration: '40 min', img: '/Yoga Portrait/10.png', vi: 9 },
];

// Portrait items 11–20
const PORTRAIT_2 = [
 { title: 'Sunrise Vinyasa', genre: 'Yoga', rating: '5.0', duration: '32 min', img: '/Yoga Portrait/11.png', vi: 10 },
 { title: 'Deep Yin Flow', genre: 'Yoga', rating: '4.9', duration: '45 min', img: '/Yoga Portrait/12.png', vi: 11 },
 { title: 'Power Core Yoga', genre: 'Yoga', rating: '4.8', duration: '40 min', img: '/Yoga Portrait/13.png', vi: 12 },
 { title: 'Breathwork Mastery', genre: 'Meditation', rating: '4.8', duration: '30 min', img: '/Yoga Portrait/14.png', vi: 13 },
 { title: 'Ashtanga Series', genre: 'Yoga', rating: '4.8', duration: '50 min', img: '/Yoga Portrait/15.png', vi: 14 },
 { title: 'Kundalini Flow', genre: 'Yoga', rating: '4.8', duration: '55 min', img: '/Yoga Portrait/16.png', vi: 15 },
 { title: 'Breathwork & Pranayama II',genre:'Meditation', rating: '4.7', duration: '30 min', img: '/Yoga Portrait/17.png', vi: 16 },
 { title: 'Restorative Yoga', genre: 'Yoga', rating: '4.7', duration: '60 min', img: '/Yoga Portrait/18.png', vi: 17 },
 { title: 'Ashtanga Advanced', genre: 'Yoga', rating: '4.6', duration: '50 min', img: '/Yoga Portrait/19.png', vi: 18 },
 { title: 'Morning Meditation', genre: 'Meditation', rating: '4.6', duration: '25 min', img: '/Yoga Portrait/20.png', vi: 19 },
];

// Portrait items 21–30
const PORTRAIT_3 = [
 { title: 'Vinyasa Sunrise II', genre: 'Yoga', rating: '5.0', duration: '32 min', img: '/Yoga Portrait/21.png', vi: 20 },
 { title: 'Deep Yin Restore', genre: 'Yoga', rating: '4.9', duration: '45 min', img: '/Yoga Portrait/22.png', vi: 21 },
 { title: 'Core Power Blast', genre: 'Yoga', rating: '4.8', duration: '40 min', img: '/Yoga Portrait/23.png', vi: 22 },
 { title: 'Breathwork Journey', genre: 'Meditation', rating: '4.8', duration: '30 min', img: '/Yoga Portrait/24.png', vi: 23 },
 { title: 'Ashtanga Flow II', genre: 'Yoga', rating: '4.8', duration: '50 min', img: '/Yoga Portrait/25.png', vi: 24 },
 { title: 'Kundalini Awakening II', genre: 'Yoga', rating: '4.8', duration: '55 min', img: '/Yoga Portrait/26.png', vi: 25 },
 { title: 'Hatha Basics II', genre: 'Yoga', rating: '4.7', duration: '35 min', img: '/Yoga Portrait/27.png', vi: 26 },
 { title: 'Restorative Stretch', genre: 'Yoga', rating: '4.7', duration: '60 min', img: '/Yoga Portrait/28.png', vi: 27 },
 { title: 'Guided Breathwork', genre: 'Meditation', rating: '4.6', duration: '25 min', img: '/Yoga Portrait/29.png', vi: 28 },
 { title: 'Prenatal Flow', genre: 'Yoga', rating: '4.6', duration: '40 min', img: '/Yoga Portrait/30.png', vi: 29 },
];

const genreColor: Record<string, string> = {
 Yoga: 'text-emerald-400', Meditation: 'text-teal-400',
};

function PortraitRow({ items, accentColor = 'bg-emerald-500' }: { items: typeof PORTRAIT_1; accentColor?: string }) {
 const [activeVideo, setActiveVideo] = useState<{ url: string; title: string; thumb: string } | null>(null);
 return (
 <>
 <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
 <div className="flex gap-4 sm:gap-5">
 {items.map((item, i) => (
 <motion.div key={i}
 className="relative w-32 sm:w-44 md:w-48 flex-shrink-0 group cursor-pointer"
 initial={{ opacity: 0, x: 30 }}
 whileInView={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.4, delay: i * 0.05 }}
 viewport={{ once: true }}
 onClick={() => setActiveVideo({ url: getYogaVideo(item.vi), title: item.title, thumb: item.img })}>
 <div className="relative h-44 sm:h-60 md:h-72 rounded-xl overflow-hidden">
 <img src={item.img} alt={item.title}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
 <div className={`w-12 h-12 rounded-full ${accentColor}/80 flex items-center justify-center shadow-lg`}>
 <Play size={20} className="text-white fill-white ml-0.5" />
 </div>
 </div>
 <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[9px] font-orbitron text-white">{item.duration}</div>
 </div>
 <div className="mt-1.5 px-0.5">
 <p className="text-white font-bebas text-xs sm:text-sm leading-tight line-clamp-1">{item.title}</p>
 <div className="flex items-center gap-1.5 mt-0.5">
 <span className={`text-[9px] font-orbitron ${genreColor[item.genre] ?? 'text-emerald-400'}`}>{item.genre}</span>
 <span className="text-gray-600 text-[9px]">·</span>
 <span className="text-gray-400 text-[9px] font-orbitron">{item.duration}</span>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 <SubscriptionFlow videoUrl={activeVideo?.url ?? null} title={activeVideo?.title} thumbnail={activeVideo?.thumb} onClose={() => setActiveVideo(null)} />
 </>
 );
}

export function YogaPortraitSection() {
 return (
 <section className="relative py-12 md:py-20 overflow-hidden">
 <SectionVideoBg />
 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <motion.div className="flex items-center gap-3 mb-8 md:mb-10"
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }} viewport={{ once: true }}>
 <Wind className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
 <div>
 <h2 className="text-3xl md:text-5xl font-bebas font-black text-white">🧘 Yoga & Mindfulness</h2>
 <p className="text-gray-400 text-xs sm:text-sm mt-1">Expert-led yoga sessions for every level</p>
 <div className="w-16 h-1 bg-emerald-400 rounded-full mt-1" />
 </div>
 </motion.div>
 <PortraitRow items={PORTRAIT_1} accentColor="bg-emerald-500" />
 </div>
 </section>
 );
}

export function YogaPortraitSection2() {
 return (
 <section className="relative py-12 md:py-20 overflow-hidden">
 <SectionVideoBg />
 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <motion.div className="flex items-center gap-3 mb-8 md:mb-10"
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }} viewport={{ once: true }}>
 <Flame className="w-6 h-6 md:w-8 md:h-8 text-teal-400" />
 <div>
 <h2 className="text-3xl md:text-5xl font-bebas font-black text-white">🔥 Power Flows</h2>
 <p className="text-gray-400 text-xs sm:text-sm mt-1">High-energy yoga flows to ignite your practice</p>
 <div className="w-16 h-1 bg-teal-400 rounded-full mt-1" />
 </div>
 </motion.div>
 <PortraitRow items={PORTRAIT_2} accentColor="bg-teal-500" />
 </div>
 </section>
 );
}

export function YogaPortraitSection3() {
 return (
 <section className="relative py-12 md:py-20 overflow-hidden">
 <SectionVideoBg />
 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <motion.div className="flex items-center gap-3 mb-8 md:mb-10"
 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }} viewport={{ once: true }}>
 <Heart className="w-6 h-6 md:w-8 md:h-8 text-rose-400 fill-rose-400" />
 <div>
 <h2 className="text-3xl md:text-5xl font-bebas font-black text-white">💫 Mind & Soul</h2>
 <p className="text-gray-400 text-xs sm:text-sm mt-1">Deep meditation and restorative practices</p>
 <div className="w-16 h-1 bg-rose-400 rounded-full mt-1" />
 </div>
 </motion.div>
 <PortraitRow items={PORTRAIT_3} accentColor="bg-rose-500" />
 </div>
 </section>
 );
}
