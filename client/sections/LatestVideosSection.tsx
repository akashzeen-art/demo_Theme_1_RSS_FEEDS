import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import { SubscriptionFlow } from './SubscriptionFlow';
import { LATEST_VIDEOS, type DesiVideoEntry } from './desiVideos';

type VideoRowMeta = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  badge?: string;
  genre: string;
  items: DesiVideoEntry[];
};

/** Split full catalog into themed rows of ~8 (last row gets remainder). */
function buildSections(): VideoRowMeta[] {
  const metas: Omit<VideoRowMeta, 'items'>[] = [
    {
      id: 'midnight-drop',
      eyebrow: 'New Drop',
      title: 'Midnight Thrillers',
      subtitle: 'Dark cases, black horizons and empire intrigue',
      badge: 'NEW',
      genre: 'Thriller',
    },
    {
      id: 'hidden-fear',
      eyebrow: 'Series Desk',
      title: 'Hidden Fear Saga',
      subtitle: 'Fear, chase and escape across every episode',
      genre: 'Suspense',
    },
    {
      id: 'shadow-wanted',
      eyebrow: 'Action Lane',
      title: 'Shadow & Wanted',
      subtitle: 'Shadow Game, warriors and revenge missions',
      badge: 'HOT',
      genre: 'Action',
    },
    {
      id: 'dangerous-minds',
      eyebrow: 'Crime Wave',
      title: 'Dangerous Minds',
      subtitle: 'Territory, networks and final countdowns',
      genre: 'Crime',
    },
    {
      id: 'secret-routes',
      eyebrow: 'Plot Twists',
      title: 'Secret Routes',
      subtitle: 'Orders, mafia ties and silent triggers',
      genre: 'Mystery',
    },
    {
      id: 'forbidden-files',
      eyebrow: 'Deep Cut',
      title: 'Forbidden Files',
      subtitle: 'Hidden enemies, diary secrets and missing links',
      genre: 'Thriller',
    },
    {
      id: 'escape-beyond',
      eyebrow: 'On the Run',
      title: 'Escape Beyond Fear',
      subtitle: 'Nightfalls, destinations and last chances',
      badge: 'HOT',
      genre: 'Action',
    },
    {
      id: 'chase-syndicate',
      eyebrow: 'Editor Picks',
      title: 'Chase & Syndicate',
      subtitle: 'Danger epilogues and border-crossing finales',
      badge: 'TOP',
      genre: 'Drama',
    },
  ];

  const rowCount = metas.length;
  const size = Math.max(1, Math.ceil(LATEST_VIDEOS.length / rowCount));
  let cursor = 0;
  return metas
    .map((meta) => {
      const slice = LATEST_VIDEOS.slice(cursor, cursor + size);
      cursor += size;
      return { ...meta, items: slice };
    })
    .filter((s) => s.items.length > 0);
}

export const VIDEO_ROW_SECTIONS = buildSections();

function VideoSliderRow({
  section,
  showNewBadge,
}: {
  section: VideoRowMeta;
  showNewBadge?: boolean;
}) {
  const [activeVideo, setActiveVideo] = useState<{
    url: string;
    title: string;
    thumb: string;
    genre: string;
    rating: string;
    duration: string;
  } | null>(null);

  return (
    <section id={section.id} className="relative py-6 md:py-9">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-4 md:mb-5"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true }}
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-cyan-300 mb-1">
            {section.eyebrow}
          </p>
          <h2 className="text-[1.45rem] sm:text-3xl md:text-[2.05rem] font-bebas tracking-wide text-white leading-none">
            {section.title}
          </h2>
          <p className="text-white/55 text-[11px] sm:text-sm mt-1 leading-relaxed">
            {section.subtitle}
          </p>
          <div className="h-0.5 w-14 mt-2 bg-cyan-300" />
        </motion.div>

        <div
          className="overflow-x-auto pb-2 -mx-1 px-1 touch-pan-x"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          <div className="flex gap-3 sm:gap-4">
            {section.items.map((item, i) => (
              <motion.button
                key={`${section.id}-${item.title}-${i}`}
                type="button"
                className="relative flex-shrink-0 group text-left w-28 sm:w-36 md:w-40"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.35) }}
                viewport={{ once: true }}
                onClick={() =>
                  setActiveVideo({
                    url: item.url,
                    title: item.title,
                    thumb: item.thumb,
                    genre: section.genre,
                    rating: item.rating,
                    duration: item.duration,
                  })
                }
              >
                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0b1728] aspect-[4/5]">
                  <img
                    src={item.thumb}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/logo.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center"
                      style={{ background: '#22d3ee' }}
                    >
                      <Play size={16} className="text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-[9px] font-orbitron text-white">
                    {item.duration}
                  </div>
                  {(showNewBadge || section.badge) && i < 2 && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[9px] font-orbitron uppercase tracking-wider rounded bg-white/90 text-[#07111f] border border-white/20">
                      {section.badge || 'NEW'}
                    </span>
                  )}
                </div>
                <div className="mt-2 px-0.5">
                  <p className="text-white font-bebas text-[13px] sm:text-sm leading-tight line-clamp-2 min-h-[2.2rem]">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star size={9} className="text-cyan-300 fill-cyan-300 shrink-0" />
                    <span className="text-cyan-300 text-[9px] sm:text-[10px] font-medium">
                      {item.rating}
                    </span>
                    <span className="text-white/25 text-[9px]">·</span>
                    <span className="text-white/55 text-[9px] sm:text-[10px]">
                      {item.duration}
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <SubscriptionFlow
        videoUrl={activeVideo?.url ?? null}
        title={activeVideo?.title}
        thumbnail={activeVideo?.thumb}
        genre={activeVideo?.genre}
        rating={activeVideo?.rating}
        duration={activeVideo?.duration}
        onClose={() => setActiveVideo(null)}
      />
    </section>
  );
}

/** Six themed CDN video rows at top of home */
export function LatestVideosSection() {
  return (
    <div id="latest-videos" className="relative">
      {VIDEO_ROW_SECTIONS.map((section, idx) => (
        <VideoSliderRow
          key={section.id}
          section={section}
          showNewBadge={idx === 0}
        />
      ))}
    </div>
  );
}
