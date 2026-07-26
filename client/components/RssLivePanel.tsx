import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  Loader2,
  AlertCircle,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { type RssFeedConfig, type RssVideoItem } from '@/lib/rssFeeds';
import { fetchCategoryRss } from '@/lib/fetchRss';
import { StreamPlayer } from '@/components/StreamPlayer';

function formatDate(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function useCategoryRss(categoryId: string, enabled: boolean, limit = 12) {
  const [items, setItems] = useState<RssVideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCategoryRss(categoryId, limit)
      .then((data) => {
        if (!cancelled) {
          setItems(data);
          setError(null);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setItems([]);
          setError(err.message || 'Failed to load feed');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId, enabled, limit, tick]);

  return {
    items,
    loading,
    error,
    reload: () => setTick((t) => t + 1),
  };
}

/** Live feed player — uses platformRss.config.ts (liveStreams + catalog) */
export function RssLivePanel({
  category,
  sectionId,
  showOpenLink = true,
  compact = false,
}: {
  category: RssFeedConfig;
  sectionId?: string;
  showOpenLink?: boolean;
  compact?: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);
  // Load immediately so remote RSS appears without waiting to scroll
  const [visible, setVisible] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin: '400px 0px', threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { items, loading, error, reload } = useCategoryRss(
    category.id,
    visible,
    compact ? 8 : 12
  );

  useEffect(() => {
    setSelectedId(null);
  }, [category.id]);

  useEffect(() => {
    if (!selectedId && items[0]) setSelectedId(items[0].id);
  }, [items, selectedId]);

  const selected = items.find((i) => i.id === selectedId) ?? items[0] ?? null;
  const playerSrc = selected?.embedUrl || null;

  return (
    <section
      ref={rootRef}
      id={sectionId}
      className={`relative scroll-mt-36 lg:scroll-mt-24 ${compact ? 'py-6 md:py-8' : 'py-10 md:py-14'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className={`px-2.5 py-1 rounded-full text-[9px] font-medium uppercase tracking-wider text-white bg-gradient-to-r ${category.accent}`}
              >
                {category.badge}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[#ff0000] text-[10px] font-medium uppercase tracking-[0.25em]">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff0000]" />
                </span>
                Live Feed
              </span>
            </div>
            <h2 className="font-bebas text-[2rem] sm:text-5xl text-[#0f0f0f] tracking-wide leading-none">
              {category.title}
            </h2>
            <p className="mt-1.5 text-[#606060] text-xs sm:text-sm line-clamp-2">
              {category.subtitle} · {category.channelName}
            </p>
            <div className="h-0.5 w-16 mt-2 bg-[#ff0000]" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={reload}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-medium uppercase tracking-wider border border-[#e5e5e5] bg-white text-[#0f0f0f] hover:border-[#ff0000] transition-all"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            {showOpenLink && (
              <Link
                to={category.path}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-medium uppercase tracking-wider bg-[#ff0000] text-white hover:bg-[#cc0000] transition-all"
              >
                Full page
                <ChevronRight size={12} />
              </Link>
            )}
          </div>
        </motion.div>

        <div className="rounded-2xl border border-[#e5e5e5] bg-white overflow-hidden">
          <div className="grid lg:grid-cols-5 gap-0">
            <div className="lg:col-span-3 p-0 sm:p-4">
              {!visible || (loading && !playerSrc) ? (
                <div className="aspect-video min-h-[200px] sm:rounded-xl border-0 sm:border border-[#e5e5e5] bg-[#f2f2f2] flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#ff0000] animate-spin" />
                </div>
              ) : error && !playerSrc ? (
                <div className="aspect-video min-h-[200px] sm:rounded-xl border-0 sm:border border-[#ff0000]/40 bg-[#fff5f5] flex flex-col items-center justify-center gap-3 px-6 text-center">
                  <AlertCircle className="text-[#ff0000]" size={28} />
                  <p className="text-[#0f0f0f] text-sm">{error}</p>
                  <button
                    type="button"
                    onClick={reload}
                    className="px-4 py-2 rounded-lg bg-[#ff0000] text-white text-xs font-medium uppercase tracking-wider"
                  >
                    Retry Feed
                  </button>
                </div>
              ) : playerSrc ? (
                <div className="overflow-hidden border-0 sm:border sm:border-[#e5e5e5] sm:rounded-xl bg-black">
                  <StreamPlayer
                    key={playerSrc}
                    src={playerSrc}
                    title={selected?.title || category.title}
                    className="!rounded-none"
                  />
                </div>
              ) : null}

              <div className="mt-0 px-3 sm:px-0 sm:mt-3 pt-3 sm:pt-0 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bebas text-lg sm:text-xl text-[#0f0f0f] leading-tight line-clamp-2">
                    {selected?.title || 'Select a feed item'}
                  </p>
                  <p className="text-[10px] text-[#909090] font-medium mt-1 uppercase tracking-wider">
                    {selected?.isLive || selected?.provider === 'live'
                      ? 'On air · Live stream'
                      : selected
                        ? `${formatDate(selected.pubDate)} · ${selected.author || category.channelName}`
                        : 'Live feed'}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l border-[#e5e5e5] max-h-[240px] sm:max-h-[320px] lg:max-h-[520px] overflow-y-auto overflow-x-hidden bg-white overscroll-contain">
              <div className="sticky top-0 z-10 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#f9f9f9] border-b border-[#e5e5e5] flex items-center justify-between">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#606060]">
                  Feed · {items.length || '…'}
                </p>
                {loading && <Loader2 size={14} className="text-[#ff0000] animate-spin" />}
              </div>

              {error && items.length === 0 ? (
                <div className="p-6 text-center text-[#606060] text-sm space-y-3">
                  <p>{error}</p>
                  <button
                    type="button"
                    onClick={reload}
                    className="text-[#ff0000] hover:text-[#cc0000] text-xs font-medium uppercase"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-[#e5e5e5]">
                  {items.map((item, i) => {
                    const active = selected?.id === item.id;
                    const live = item.isLive || item.provider === 'live';
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedId(item.id);
                            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                              rootRef.current?.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start',
                              });
                            }
                          }}
                          className={`w-full flex gap-3 p-3 text-left transition-colors ${
                            active ? 'bg-[#fff0f0]' : 'hover:bg-[#f9f9f9]'
                          }`}
                        >
                          <div className="relative w-20 sm:w-28 aspect-video rounded-md overflow-hidden shrink-0 bg-[#f2f2f2]">
                            <img
                              src={item.thumbnail}
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {live && (
                              <span className="absolute top-1 left-1 text-[8px] font-bold uppercase bg-[#ff0000] px-1.5 py-0.5 rounded text-white">
                                Live
                              </span>
                            )}
                            {!live && (
                              <span className="absolute bottom-1 left-1 text-[8px] font-medium bg-black/75 px-1 rounded text-white">
                                #{i + 1}
                              </span>
                            )}
                            {active && (
                              <div className="absolute inset-0 flex items-center justify-center bg-[#ff0000]/35">
                                <Play size={16} className="text-white fill-white" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 py-0.5">
                            <p
                              className={`text-sm leading-snug line-clamp-2 ${
                                active ? 'text-[#ff0000] font-medium' : 'text-[#0f0f0f]'
                              }`}
                            >
                              {item.title}
                            </p>
                            <p className="text-[10px] text-[#909090] mt-1">
                              {live
                                ? 'On air'
                                : item.provider === 'platform'
                                  ? 'StreamsIndia'
                                  : item.provider === 'youtube' || item.provider === 'rss'
                                    ? 'Live RSS'
                                    : formatDate(item.pubDate)}
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
