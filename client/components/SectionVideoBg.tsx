import { useEffect, useRef } from 'react';
import { SITE_BG_VIDEO } from '@/lib/media';

interface SectionVideoBgProps {
 videoOpacity?: number;
 local?: boolean;
}

/** Per-section video layer. Default: no overlay — global video shows through. */
export function SectionVideoBg({ videoOpacity = 1, local = false }: SectionVideoBgProps) {
 const videoRef = useRef<HTMLVideoElement>(null);
 const containerRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 if (!local) return;
 const el = containerRef.current;
 const video = videoRef.current;
 if (!el || !video) return;

 const observer = new IntersectionObserver(
 ([entry]) => {
 if (entry.isIntersecting) video.play().catch(() => {});
 else video.pause();
 },
 { threshold: 0.05 }
 );
 observer.observe(el);
 return () => observer.disconnect();
 }, [local]);

 if (!local) return null;

 return (
 <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
 <video
 ref={videoRef}
 src={SITE_BG_VIDEO}
 autoPlay loop muted playsInline preload="none"
 controlsList="nodownload noremoteplayback"
 disablePictureInPicture
 onContextMenu={e => e.preventDefault()}
 className="absolute inset-0 w-full h-full object-cover"
 style={{ opacity: videoOpacity }}
 />
 </div>
 );
}

/** Fixed full-page background video */
export function GlobalVideoBg({ opacity = 1 }: { opacity?: number }) {
 return (
 <video
 autoPlay loop muted playsInline
 controlsList="nodownload noremoteplayback"
 disablePictureInPicture
 onContextMenu={e => e.preventDefault()}
 className="fixed inset-0 w-full h-full object-cover pointer-events-none z-[1]"
 style={{ opacity }}
 >
 <source src={SITE_BG_VIDEO} type="video/mp4" />
 </video>
 );
}
