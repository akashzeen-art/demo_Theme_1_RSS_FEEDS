import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Home,
  Loader2,
} from 'lucide-react';
import { BurgerMenu } from '@/components/BurgerMenu';
import { CategoryNav } from '@/components/CategoryNav';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { REELS, resolveVideo, type ReelItem } from '@/lib/catalog';

function ReelSlide({
  reel,
  active,
  muted,
  liked,
  onToggleLike,
  onToggleMute,
  onEnded,
}: {
  reel: ReelItem;
  active: boolean;
  muted: boolean;
  liked: boolean;
  onToggleLike: () => void;
  onToggleMute: () => void;
  onEnded: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const src = resolveVideo(reel);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (active) {
      const play = video.play();
      if (play) play.catch(() => undefined);
    } else {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
  }, [active, src]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || !active) return;
    if (video.paused) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
  }, [muted]);

  return (
    <article
      className="reels-slide relative w-full h-full shrink-0 snap-start snap-always overflow-hidden bg-black"
      data-reel-id={reel.id}
    >
      {!ready && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <Loader2 className="w-8 h-8 text-[#ff0000] animate-spin" />
        </div>
      )}

      <video
        ref={videoRef}
        src={src}
        poster={reel.img}
        className="absolute inset-0 w-full h-full object-cover cursor-pointer"
        playsInline
        loop={false}
        muted={muted}
        preload={active ? 'auto' : 'metadata'}
        onClick={togglePlay}
        onLoadedData={() => setReady(true)}
        onCanPlay={() => setReady(true)}
        onEnded={onEnded}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent pointer-events-none" />

      {/* Side actions */}
      <div className="absolute right-3 sm:right-4 bottom-28 sm:bottom-32 z-20 flex flex-col items-center gap-5">
        <button
          type="button"
          onClick={onToggleLike}
          className="flex flex-col items-center gap-1"
          aria-label="Like"
        >
          <span className="w-11 h-11 rounded-full bg-black/45 border border-white/20 flex items-center justify-center backdrop-blur-sm">
            <Heart
              size={22}
              className={liked ? 'text-[#ff0000] fill-[#ff0000]' : 'text-white'}
            />
          </span>
          <span className="text-[10px] font-medium text-white/90">{reel.views}</span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1 text-white" aria-label="Comments">
          <span className="w-11 h-11 rounded-full bg-black/45 border border-white/20 flex items-center justify-center">
            <MessageCircle size={22} />
          </span>
          <span className="text-[10px] font-medium text-white/80">Chat</span>
        </button>

        <button type="button" className="flex flex-col items-center gap-1 text-white" aria-label="Share">
          <span className="w-11 h-11 rounded-full bg-black/45 border border-white/20 flex items-center justify-center">
            <Share2 size={22} />
          </span>
          <span className="text-[10px] font-medium text-white/80">Share</span>
        </button>

        <button
          type="button"
          onClick={onToggleMute}
          className="w-11 h-11 rounded-full bg-black/45 border border-white/20 flex items-center justify-center text-white"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* Caption */}
      <div className="absolute left-4 right-20 bottom-6 sm:bottom-8 z-20">
        <span className="inline-block px-2 py-0.5 mb-2 text-[9px] font-bold uppercase tracking-wider bg-[#ff0000] text-white rounded">
          {reel.genre}
        </span>
        <h2 className="font-bebas text-2xl sm:text-3xl text-white leading-tight drop-shadow-md line-clamp-2">
          {reel.title}
        </h2>
        <p className="text-white/80 text-xs mt-1 font-medium">{reel.creator}</p>
        <p className="text-white/50 text-[10px] mt-1">
          {reel.duration} · {reel.views} views
        </p>
      </div>
    </article>
  );
}

/** TikTok-style vertical reels feed with snap scrolling */
export default function Reels() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const wheelLock = useRef(false);

  const scrollToIndex = useCallback((i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(REELS.length - 1, i));
    el.scrollTo({ top: clamped * el.clientHeight, behavior: 'smooth' });
    setActiveIndex(clamped);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((i) => {
      const next = Math.min(REELS.length - 1, i + 1);
      const el = scrollerRef.current;
      if (el) {
        el.scrollTo({ top: next * el.clientHeight, behavior: 'smooth' });
      }
      return next;
    });
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => {
      const prev = Math.max(0, i - 1);
      const el = scrollerRef.current;
      if (el) {
        el.scrollTo({ top: prev * el.clientHeight, behavior: 'smooth' });
      }
      return prev;
    });
  }, []);

  // Track which slide is centered
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const slides = Array.from(root.querySelectorAll('.reels-slide'));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting && e.intersectionRatio >= 0.55)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const id = Number((visible.target as HTMLElement).dataset.reelId);
        const idx = REELS.findIndex((r) => r.id === id);
        if (idx >= 0) setActiveIndex(idx);
      },
      { root, threshold: [0.55, 0.75, 0.9] }
    );

    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        goNext();
      }
      if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        goPrev();
      }
      if (e.key === 'm') setMuted((m) => !m);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  // Desktop wheel → one reel at a time
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 12) return;
      e.preventDefault();
      if (wheelLock.current) return;
      wheelLock.current = true;
      if (e.deltaY > 0) goNext();
      else goPrev();
      window.setTimeout(() => {
        wheelLock.current = false;
      }, 650);
    };

    root.addEventListener('wheel', onWheel, { passive: false });
    return () => root.removeEventListener('wheel', onWheel);
  }, [goNext, goPrev]);

  // Lock page scroll while on reels feed
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const feedTop =
    'calc(env(safe-area-inset-top, 0px) + var(--reels-header-h))';

  return (
    <div
      className="relative h-[100dvh] w-full overflow-hidden bg-black text-white [--reels-header-h:3.5rem] sm:[--reels-header-h:4rem]"
    >
      <AnimatedBackground />
      <div className="absolute inset-0 bg-black/70 pointer-events-none z-[1]" />

      <BurgerMenu />
      <CategoryNav />

      {/* Snap scroller — full height under header */}
      <div
        ref={scrollerRef}
        className="relative z-10 w-full overflow-y-auto overflow-x-hidden overscroll-y-contain touch-pan-y reels-scroller"
        style={
          {
            height:
              'calc(100dvh - env(safe-area-inset-top, 0px) - var(--reels-header-h))',
            marginTop: feedTop,
            scrollSnapType: 'y mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          } as CSSProperties
        }
      >
        {REELS.map((reel, i) => (
          <div
            key={reel.id}
            className="w-full snap-start snap-always"
            style={{ height: '100%', minHeight: '100%' }}
          >
            <div className="relative mx-auto h-full w-full max-w-lg">
              <ReelSlide
                reel={reel}
                active={i === activeIndex}
                muted={muted}
                liked={Boolean(liked[reel.id])}
                onToggleLike={() =>
                  setLiked((l) => ({ ...l, [reel.id]: !l[reel.id] }))
                }
                onToggleMute={() => setMuted((m) => !m)}
                onEnded={() => {
                  if (i < REELS.length - 1) goNext();
                  else scrollToIndex(0);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Overlay chrome (inside feed area) */}
      <div
        className="absolute left-0 right-0 z-40 flex items-center justify-between px-3 sm:px-5 pointer-events-none"
        style={{ top: `calc(${feedTop} + 0.75rem)` }}
      >
        <Link
          to="/"
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/55 border border-white/20 text-[10px] font-bold uppercase tracking-wider text-white"
        >
          <Home size={12} />
          Home
        </Link>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/75 drop-shadow">
          Reels · {activeIndex + 1}/{REELS.length}
        </p>
        <div className="w-[4.5rem]" aria-hidden />
      </div>

      {/* Desktop arrows */}
      <div className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-40 flex-col gap-2">
        <button
          type="button"
          disabled={activeIndex === 0}
          onClick={goPrev}
          className="w-11 h-11 rounded-full bg-white text-[#111] border-2 border-[#111] flex items-center justify-center disabled:opacity-30 shadow-[3px_3px_0_#ff0000]"
          aria-label="Previous reel"
        >
          <ChevronUp size={20} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          disabled={activeIndex === REELS.length - 1}
          onClick={goNext}
          className="w-11 h-11 rounded-full bg-white text-[#111] border-2 border-[#111] flex items-center justify-center disabled:opacity-30 shadow-[3px_3px_0_#ff0000]"
          aria-label="Next reel"
        >
          <ChevronDown size={20} strokeWidth={2.5} />
        </button>
      </div>

      <p className="absolute bottom-3 left-0 right-0 z-30 text-center text-[9px] uppercase tracking-[0.25em] text-white/40 pointer-events-none md:hidden">
        Swipe up for next
      </p>
    </div>
  );
}
