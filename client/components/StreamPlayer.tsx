import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Loader2 } from 'lucide-react';

function isHls(url: string) {
  return /\.m3u8(\?|$)/i.test(url);
}

function isDirectVideo(url: string) {
  return (
    isHls(url) ||
    /\.(mp4|webm)(\?|$)/i.test(url) ||
    url.includes('b-cdn.net') ||
    url.includes('stream.mux.com') ||
    url.includes('cloudflarestream.com')
  );
}

function isYoutubeEmbed(url: string) {
  return /youtube\.com\/embed\//i.test(url) || /youtube-nocookie\.com\/embed\//i.test(url);
}

function withYoutubeApi(src: string) {
  try {
    const u = new URL(src);
    u.searchParams.set('enablejsapi', '1');
    u.searchParams.set('rel', '0');
    if (typeof window !== 'undefined') {
      u.searchParams.set('origin', window.location.origin);
    }
    return u.toString();
  } catch {
    return src;
  }
}

/**
 * Brand-free HTML5 / HLS / embed player.
 * Fires onEnded when playback finishes so hero can auto-advance.
 */
export function StreamPlayer({
  src,
  title,
  className = '',
  autoPlay = true,
  muted = true,
  onEnded,
  onProgress,
}: {
  src: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  onEnded?: () => void;
  /** 0–1 playback progress when available */
  onProgress?: (ratio: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const useNativeVideo = isDirectVideo(src);
  const youtube = !useNativeVideo && isYoutubeEmbed(src);
  const iframeSrc = youtube ? withYoutubeApi(src) : src;
  const onEndedRef = useRef(onEnded);
  const onProgressRef = useRef(onProgress);
  onEndedRef.current = onEnded;
  onProgressRef.current = onProgress;

  useEffect(() => {
    setReady(false);
    onProgressRef.current?.(0);
    const video = videoRef.current;
    if (!video || !useNativeVideo) return;

    let hls: Hls | null = null;
    let cancelled = false;

    const markReady = () => {
      if (!cancelled) setReady(true);
    };

    const handleEnded = () => onEndedRef.current?.();
    const handleTime = () => {
      if (!video.duration || !Number.isFinite(video.duration)) return;
      onProgressRef.current?.(Math.min(1, video.currentTime / video.duration));
    };

    if (isHls(src)) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadeddata', markReady);
      } else if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, markReady);
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) setReady(true);
        });
      } else {
        video.src = src;
        video.addEventListener('loadeddata', markReady);
      }
    } else {
      video.src = src;
      video.addEventListener('loadeddata', markReady);
    }

    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTime);

    const failSafe = window.setTimeout(markReady, 8000);

    return () => {
      cancelled = true;
      window.clearTimeout(failSafe);
      video.removeEventListener('loadeddata', markReady);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTime);
      if (hls) {
        hls.destroy();
        hls = null;
      }
      video.removeAttribute('src');
      video.load();
    };
  }, [src, useNativeVideo]);

  // YouTube: advance when video ends (IFrame API via postMessage)
  useEffect(() => {
    if (!youtube) return;

    const onMessage = (event: MessageEvent) => {
      if (!event.origin.includes('youtube.com')) return;
      let data: { event?: string; info?: number | Record<string, unknown> } | null = null;
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      if (!data) return;

      if (data.event === 'onStateChange' && data.info === 0) {
        onEndedRef.current?.();
      }

      if (data.event === 'infoDelivery' && data.info && typeof data.info === 'object') {
        const info = data.info as { currentTime?: number; duration?: number };
        if (
          typeof info.currentTime === 'number' &&
          typeof info.duration === 'number' &&
          info.duration > 0
        ) {
          onProgressRef.current?.(Math.min(1, info.currentTime / info.duration));
        }
      }
    };

    window.addEventListener('message', onMessage);

    const ping = window.setInterval(() => {
      const win = iframeRef.current?.contentWindow;
      if (!win) return;
      try {
        win.postMessage(JSON.stringify({ event: 'listening', id: 1 }), '*');
        win.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'addEventListener',
            args: ['onStateChange'],
          }),
          '*'
        );
        win.postMessage(
          JSON.stringify({ event: 'command', func: 'getCurrentTime', args: [] }),
          '*'
        );
        win.postMessage(
          JSON.stringify({ event: 'command', func: 'getDuration', args: [] }),
          '*'
        );
      } catch {
        /* ignore cross-origin timing */
      }
    }, 1000);

    return () => {
      window.removeEventListener('message', onMessage);
      window.clearInterval(ping);
    };
  }, [youtube, iframeSrc]);

  if (!useNativeVideo) {
    return (
      <div
        className={`relative w-full aspect-video min-h-[200px] sm:min-h-0 overflow-hidden bg-black ${className}`}
      >
        {!ready && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
            <Loader2 className="w-7 h-7 text-[#ff0000] animate-spin" />
          </div>
        )}
        <iframe
          ref={iframeRef}
          key={iframeSrc}
          src={iframeSrc}
          title={title}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share"
          allowFullScreen
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setReady(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full aspect-video min-h-[200px] sm:min-h-0 overflow-hidden bg-black ${className}`}
    >
      {!ready && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <Loader2 className="w-7 h-7 text-[#ff0000] animate-spin" />
        </div>
      )}
      <video
        ref={videoRef}
        title={title}
        className="absolute inset-0 w-full h-full object-contain bg-black"
        controls
        playsInline
        autoPlay={autoPlay}
        muted={muted}
        controlsList="nodownload"
        onCanPlay={() => setReady(true)}
      />
    </div>
  );
}

export { isDirectVideo, isHls };
