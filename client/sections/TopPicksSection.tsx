// TopPicksSection — Cooking with click-to-play video modal
import { useState } from 'react';
import { SectionVideoBg } from '@/components/SectionVideoBg';
import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import { SubscriptionFlow } from './SubscriptionFlow';
import { getVideoMetaByTitle } from './desiVideos';

const TITLES = [
  'Raaz Beyond Fear',
  'The Hidden Truth',
  'Silent Chase',
  'The Missing Witness',
  'The Secret Route Ep1',
  'The Secret Route Ep2',
  'Raaz, Revenge & Mafia Ep1',
  'Raaz, Revenge & Mafia Ep2',
  'Silent Trigger',
  'Final Countdown',
  'Fatal Connections Ep2',
  'The Secret Order',
];

const items = TITLES.map((title) => {
  const meta = getVideoMetaByTitle(title);
  return {
    title: meta.title,
    rating: meta.rating,
    duration: meta.duration,
    img: meta.thumb,
    url: meta.url,
  };
});

export function TopPicksSection() {
  const [activeVideo, setActiveVideo] = useState<{
    url: string;
    title: string;
    thumb: string;
    rating: string;
    duration: string;
  } | null>(null);

  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      <SectionVideoBg />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-8 md:mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bebas font-black">
            <span className="gradient-text">Top Picks</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mb-2">
            Most-watched titles loved by our community
          </p>
          <div className="accent-bar w-20" />
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              viewport={{ once: true }}
              onClick={() =>
                setActiveVideo({
                  url: item.url,
                  title: item.title,
                  thumb: item.img,
                  rating: item.rating,
                  duration: item.duration,
                })
              }
            >
              <div
                className="relative rounded-xl overflow-hidden bg-gray-900 glow-card"
                style={{ aspectRatio: '1080/1350' }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg play-pulse"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
                  >
                    <Play size={16} className="text-white fill-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[9px] font-orbitron text-white">
                  {item.duration}
                </div>
              </div>
              <div className="mt-1.5 px-0.5">
                <p className="text-white font-bebas text-xs sm:text-sm leading-tight line-clamp-1">
                  {item.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star size={9} className="fill-yellow-400 text-yellow-400 shrink-0" />
                  <span className="text-yellow-400 text-[10px] font-orbitron">{item.rating}</span>
                  <span className="text-gray-600 text-[10px]">·</span>
                  <span className="text-gray-400 text-[10px] font-orbitron">{item.duration}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <SubscriptionFlow
        videoUrl={activeVideo?.url ?? null}
        title={activeVideo?.title}
        thumbnail={activeVideo?.thumb}
        rating={activeVideo?.rating}
        duration={activeVideo?.duration}
        onClose={() => setActiveVideo(null)}
      />
    </section>
  );
}
