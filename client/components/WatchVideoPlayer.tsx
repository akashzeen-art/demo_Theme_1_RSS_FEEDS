import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Captions,
  Gauge,
} from 'lucide-react';

type WatchVideoPlayerProps = {
  src: string;
  title: string;
  poster?: string;
  onBack: () => void;
};

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const total = Math.floor(sec);
  const s = total % 60;
  const m = Math.floor((total / 60) % 60);
  const h = Math.floor(total / 3600);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${m}:${String(s).padStart(2, '0')}`;
}

function readDuration(v: HTMLVideoElement) {
  const d = v.duration;
  if (!Number.isFinite(d) || d <= 0) return 0;
  return d;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

/**
 * Full-screen watch experience with Netflix-style chrome:
 * back, scrubber, play/pause, ±10s, volume, title, speed, fullscreen.
 */
export function WatchVideoPlayer({
  src,
  title,
  poster,
  onBack,
}: WatchVideoPlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<number | null>(null);

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [showUi, setShowUi] = useState(true);
  const [isFs, setIsFs] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showSpeed, setShowSpeed] = useState(false);
  const [ready, setReady] = useState(false);

  const bumpUi = useCallback(() => {
    setShowUi(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowUi(false);
    }, 3200);
  }, []);

  useEffect(() => {
    bumpUi();
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, [bumpUi]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = speed;
    v.muted = muted;
    v.volume = volume;
    const play = v.play();
    if (play) play.catch(() => setPlaying(false));
  }, [src, muted, volume, speed]);

  useEffect(() => {
    const onFs = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const v = videoRef.current;
      if (!v) return;
      bumpUi();
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => undefined);
        } else {
          onBack();
        }
      }
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        if (v.paused) {
          v.play().catch(() => undefined);
          setPlaying(true);
        } else {
          v.pause();
          setPlaying(false);
        }
      }
      if (e.key === 'ArrowLeft' || e.key === 'j') {
        v.currentTime = Math.max(0, v.currentTime - 10);
      }
      if (e.key === 'ArrowRight' || e.key === 'l') {
        v.currentTime = Math.min(v.duration || 0, v.currentTime + 10);
      }
      if (e.key === 'm') setMuted((m) => !m);
      if (e.key === 'f') toggleFullscreen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bumpUi, onBack]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    bumpUi();
    if (v.paused) {
      v.play().catch(() => undefined);
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const seekBy = (delta: number) => {
    const v = videoRef.current;
    if (!v) return;
    bumpUi();
    v.currentTime = Math.min(Math.max(0, v.currentTime + delta), v.duration || 0);
  };

  const onScrub = (e: ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const next = Number(e.target.value);
    v.currentTime = next;
    setCurrent(next);
    bumpUi();
  };

  const toggleFullscreen = () => {
    const el = rootRef.current;
    if (!el) return;
    bumpUi();
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => undefined);
    } else {
      document.exitFullscreen?.().catch(() => undefined);
    }
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;
  const bufferPct = duration > 0 ? (buffered / duration) * 100 : 0;
  const remaining = Math.max(0, duration - current);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10000] bg-black text-white select-none"
      onMouseMove={bumpUi}
      onTouchStart={bumpUi}
      data-uia="watch-video"
    >
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          key={src}
          src={src}
          poster={poster}
          className="w-full h-full object-contain bg-black"
          playsInline
          autoPlay
          onClick={togglePlay}
          onLoadedMetadata={() => {
            const v = videoRef.current;
            if (!v) return;
            setDuration(readDuration(v));
            setCurrent(v.currentTime || 0);
            setReady(true);
          }}
          onDurationChange={() => {
            const v = videoRef.current;
            if (!v) return;
            setDuration(readDuration(v));
          }}
          onLoadedData={() => {
            const v = videoRef.current;
            if (!v) return;
            setDuration(readDuration(v));
            setReady(true);
          }}
          onTimeUpdate={() => {
            const v = videoRef.current;
            if (!v) return;
            setCurrent(v.currentTime || 0);
            setDuration(readDuration(v));
            if (v.buffered.length) {
              try {
                setBuffered(v.buffered.end(v.buffered.length - 1));
              } catch {
                /* ignore */
              }
            }
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onContextMenu={(e) => e.preventDefault()}
          controlsList="nodownload"
        />
      </div>

      {/* Top / bottom scrims + controls */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          showUi ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

        {/* Top bar */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-3 sm:px-6 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <button
            type="button"
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center text-white hover:text-white/80 transition-colors"
            aria-label="Back to Browse"
          >
            <ArrowLeft size={28} strokeWidth={2.2} />
          </button>
          <p className="sm:hidden font-semibold text-sm truncate max-w-[50%] text-center">
            {title}
          </p>
          <div className="w-11" aria-hidden />
        </div>

        {/* Center play hint when paused */}
        {!playing && ready && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/15 border border-white/40 flex items-center justify-center backdrop-blur-sm"
            aria-label="Play"
          >
            <Play size={32} className="fill-white text-white ml-1" />
          </button>
        )}

        {/* Bottom controls */}
        <div className="absolute bottom-0 inset-x-0 z-20 px-3 sm:px-8 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {/* Timeline */}
          <div className="relative mb-1 group/timeline">
            <div className="relative h-1 sm:h-1.5 rounded-full bg-white/30 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-white/40"
                style={{ width: `${bufferPct}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 bg-[#e50914]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(duration, 0.1)}
              step={0.1}
              value={Math.min(current, duration || 0)}
              onChange={onScrub}
              aria-label="Seek time scrubber"
              aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
              className="absolute inset-0 w-full h-4 -top-1.5 opacity-0 cursor-pointer"
            />
            <div
              className="pointer-events-none absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#e50914] shadow opacity-0 group-hover/timeline:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 0.4rem)` }}
            />
          </div>

          <div className="flex items-center justify-between gap-3 text-xs sm:text-sm text-white/90 mb-2 sm:mb-3 font-medium tabular-nums tracking-wide">
            <span aria-label="Current time / duration">
              {formatTime(current)}
              <span className="text-white/45 mx-1">/</span>
              {formatTime(duration)}
            </span>
            <span className="text-white/70" aria-label="Time remaining">
              {duration > 0 ? `-${formatTime(remaining)}` : '0:00'}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:text-white/80"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? (
                <Pause size={26} className="fill-white" />
              ) : (
                <Play size={26} className="fill-white ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => seekBy(-10)}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:text-white/80"
              aria-label="Seek Back"
            >
              <RotateCcw size={22} />
              <span className="sr-only">10</span>
            </button>

            <button
              type="button"
              onClick={() => seekBy(10)}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:text-white/80"
              aria-label="Seek Forward"
            >
              <RotateCw size={22} />
            </button>

            <div className="relative flex items-center gap-1 group/vol">
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:text-white/80"
                aria-label="Volume"
              >
                {muted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setVolume(val);
                  setMuted(val === 0);
                  bumpUi();
                }}
                className="hidden sm:block w-0 group-hover/vol:w-20 transition-all opacity-0 group-hover/vol:opacity-100 accent-white h-1"
                aria-label="Volume level"
              />
            </div>

            <p className="hidden sm:block flex-1 min-w-0 px-3 font-semibold text-base truncate">
              {title}
            </p>
            <div className="flex-1 sm:hidden" />

            <button
              type="button"
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:text-white/80 opacity-70"
              aria-label="Audio & Subtitles"
              title="Audio & Subtitles"
            >
              <Captions size={22} />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowSpeed((s) => !s);
                  bumpUi();
                }}
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:text-white/80"
                aria-label={`${speed}x`}
              >
                <Gauge size={22} />
              </button>
              {showSpeed && (
                <div className="absolute bottom-12 right-0 min-w-[7rem] rounded-md bg-[#141414] border border-white/15 shadow-xl py-1 z-30">
                  {SPEEDS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setSpeed(s);
                        setShowSpeed(false);
                        bumpUi();
                      }}
                      className={`block w-full text-left px-3 py-1.5 text-sm hover:bg-white/10 ${
                        speed === s ? 'text-white font-semibold' : 'text-white/70'
                      }`}
                    >
                      {s === 1 ? '1x (Normal)' : `${s}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center hover:text-white/80"
              aria-label={isFs ? 'Exit full screen' : 'Full screen'}
            >
              {isFs ? <Minimize size={22} /> : <Maximize size={22} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
