import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play,
  Loader2,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { type RssFeedConfig, type RssVideoItem } from '@/lib/rssFeeds';
import { fetchCategoryRss } from '@/lib/fetchRss';
import { StreamPlayer, isDirectVideo, isHls } from '@/components/StreamPlayer';

function formatDate(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function isImageUrl(url: string) {
  if (!url) return false;
  const clean = url.split('#')[0].split('?')[0];
  return /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(clean);
}

function isPlayableEmbed(url: string | null | undefined) {
  if (!url || isImageUrl(url)) return false;
  return (
    isDirectVideo(url) ||
    isHls(url) ||
    /youtube\.com\/(embed|watch|shorts)/i.test(url) ||
    /youtu\.be\//i.test(url)
  );
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
  const [frameReady, setFrameReady] = useState(false);

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
    if (!items.length) return;
    // Keep selection in sync with feed; default to first item
    if (!selectedId || !items.some((i) => i.id === selectedId)) {
      setSelectedId(items[0].id);
    }
  }, [items, selectedId]);

  const selected = items.find((i) => i.id === selectedId) ?? items[0] ?? null;
  const playerSrc = selected?.embedUrl || null;
  const canPlay = isPlayableEmbed(playerSrc);
  const articleHref = selected?.link || (!canPlay ? playerSrc : null);
  const articleFrameSrc = articleHref
    ? `/api/article?url=${encodeURIComponent(articleHref)}`
    : null;
  const hasContent = Boolean(selected && (canPlay || articleFrameSrc || selected.thumbnail));

  useEffect(() => {
    setFrameReady(false);
  }, [articleFrameSrc]);

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
            <h2 className="font-bebas text-[2rem] sm:text-5xl text-white tracking-wide leading-none">
              {category.title}
            </h2>
            <p className="mt-1.5 text-white/55 text-xs sm:text-sm line-clamp-2">
              {category.subtitle} · {category.channelName}
            </p>
            <div className="h-0.5 w-16 mt-2 bg-cyan-300" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={reload}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-medium uppercase tracking-wider border border-white/15 bg-white/5 text-white hover:border-cyan-400/50 transition-all"
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

        <div className="rounded-2xl border border-white/10 bg-[#0b1728]/90 overflow-hidden backdrop-blur-sm">
          <div className="grid lg:grid-cols-5 gap-0">
            <div className="lg:col-span-3 p-0 sm:p-4">
              {!visible || (loading && !hasContent) ? (
                <div className="aspect-video min-h-[200px] sm:rounded-xl border-0 sm:border border-white/10 bg-[#111827] flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-cyan-300 animate-spin" />
                </div>
              ) : error && !hasContent ? (
                <div className="aspect-video min-h-[200px] sm:rounded-xl border-0 sm:border border-red-500/40 bg-[#1a1020] flex flex-col items-center justify-center gap-3 px-6 text-center">
                  <AlertCircle className="text-red-400" size={28} />
                  <p className="text-white/80 text-sm">{error}</p>
                  <button
                    type="button"
                    onClick={reload}
                    className="px-4 py-2 rounded-lg bg-[#ff0000] text-white text-xs font-medium uppercase tracking-wider"
                  >
                    Retry Feed
                  </button>
                </div>
              ) : canPlay && playerSrc ? (
                <div className="overflow-hidden border-0 sm:border sm:border-white/10 sm:rounded-xl bg-black">
                  <StreamPlayer
                    key={playerSrc}
                    src={playerSrc}
                    title={selected?.title || category.title}
                    className="!rounded-none"
                  />
                </div>
              ) : selected && articleFrameSrc ? (
                <div className="relative overflow-hidden border-0 sm:border sm:border-white/10 sm:rounded-xl bg-[#111827]">
                  <div className="h-[min(68vh,620px)] min-h-[280px] sm:min-h-[360px] relative">
                    {!frameReady && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#111827]">
                        {selected.thumbnail ? (
                          <img
                            src={selected.thumbnail}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover opacity-30"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : null}
                        <Loader2 className="relative w-8 h-8 text-cyan-300 animate-spin" />
                        <p className="relative text-[10px] uppercase tracking-wider text-white/50">
                          Loading article…
                        </p>
                      </div>
                    )}
                    <iframe
                      key={articleFrameSrc}
                      src={articleFrameSrc}
                      title={selected.title || 'Article'}
                      className="absolute inset-0 w-full h-full border-0 bg-white"
                      loading="eager"
                      referrerPolicy="no-referrer"
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
                      onLoad={() => setFrameReady(true)}
                    />
                  </div>
                  {articleHref ? (
                    <div className="flex items-center justify-between gap-3 px-3 py-2 border-t border-white/10 bg-[#0a1422]">
                      <p className="text-[10px] text-white/40 uppercase tracking-wider truncate">
                        In-app article view
                      </p>
                      <a
                        href={articleHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 shrink-0 text-[10px] font-medium uppercase tracking-wider text-cyan-300 hover:text-cyan-200"
                      >
                        Open original
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  ) : null}
                </div>
              ) : selected ? (
                <div className="relative overflow-hidden border-0 sm:border sm:border-white/10 sm:rounded-xl bg-[#111827] aspect-video min-h-[200px]">
                  <img
                    src={selected.thumbnail || '/logo.png'}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/logo.png';
                    }}
                  />
                </div>
              ) : null}

              <div className="mt-0 px-3 sm:px-0 sm:mt-3 pt-3 sm:pt-0 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bebas text-lg sm:text-xl text-white leading-tight line-clamp-2">
                    {selected?.title || 'Select a feed item'}
                  </p>
                  <p className="text-[10px] text-white/45 font-medium mt-1 uppercase tracking-wider">
                    {selected?.isLive || selected?.provider === 'live'
                      ? 'On air · Live stream'
                      : selected
                        ? `${formatDate(selected.pubDate)} · ${selected.author || category.channelName}`
                        : 'Live feed'}
                  </p>
                  <p className="mt-2 text-[10px] leading-relaxed text-white/30 max-w-xl">
                    Entertainment-discovery feed for non-commercial demo use, leaning toward Hollywood, celebrity chatter and international pop-culture viewpoints.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l border-white/10 max-h-[240px] sm:max-h-[320px] lg:max-h-[520px] overflow-y-auto overflow-x-hidden bg-[#0a1422] overscroll-contain">
              <div className="sticky top-0 z-10 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#0d1828] border-b border-white/10 flex items-center justify-between">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">
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
                <ul className="divide-y divide-white/10">
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
                            active ? 'bg-cyan-400/10' : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="relative w-20 sm:w-28 aspect-[1350/760] rounded-md overflow-hidden shrink-0 bg-[#111827]">
                            <img
                              src={item.thumbnail}
                              alt=""
                              className="w-full h-full object-cover object-center"
                              loading="lazy"
                              onError={(e) => {
                                const t = e.currentTarget;
                                if (t.dataset.fallback === '1') return;
                                t.dataset.fallback = '1';
                                t.style.opacity = '0.35';
                              }}
                            />
                            {live && (
                              <span className="absolute top-1 left-1 text-[8px] font-bold uppercase bg-cyan-400 px-1.5 py-0.5 rounded text-[#07111f]">
                                Live
                              </span>
                            )}
                            {!live && (
                              <span className="absolute bottom-1 left-1 text-[8px] font-medium bg-black/75 px-1 rounded text-white">
                                #{i + 1}
                              </span>
                            )}
                            {active && (
                              <div className="absolute inset-0 flex items-center justify-center bg-cyan-400/25">
                                <Play size={16} className="text-white fill-white" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 py-0.5">
                            <p
                              className={`text-[13px] sm:text-sm leading-snug line-clamp-2 ${
                                active ? 'text-cyan-300 font-medium' : 'text-white/90'
                              }`}
                            >
                              {item.title}
                            </p>
                            <p className="text-[10px] text-white/40 mt-1">
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
