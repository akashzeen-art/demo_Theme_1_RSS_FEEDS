import { motion } from 'framer-motion';

const BURSTS = [
  { top: '8%', left: '6%', size: 120, delay: 0, rotate: -12, color: '#ffcc00' },
  { top: '18%', right: '4%', size: 90, delay: 0.4, rotate: 18, color: '#ff3333' },
  { top: '62%', left: '2%', size: 100, delay: 0.8, rotate: 8, color: '#ffcc00' },
  { top: '72%', right: '8%', size: 130, delay: 1.2, rotate: -20, color: '#ff4444' },
  { top: '40%', left: '88%', size: 70, delay: 0.6, rotate: 25, color: '#111111' },
] as const;

const SPEED_LINES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  top: `${6 + i * 6.5}%`,
  delay: i * 0.12,
  width: 40 + (i % 5) * 12,
  opacity: 0.08 + (i % 3) * 0.04,
}));

const FLOAT_DOTS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: `${(i * 37) % 100}%`,
  y: `${(i * 53) % 100}%`,
  size: 4 + (i % 5) * 3,
  delay: (i % 8) * 0.35,
  duration: 4 + (i % 5),
}));

/** Comic-book action background — halftone, bursts, speed lines */
export function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden comic-bg"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[#fffaf3]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(255,220,60,0.35), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 80%, rgba(255,40,40,0.18), transparent 50%), radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,255,255,0.5), transparent 70%)',
        }}
      />

      <div className="absolute inset-0 comic-halftone opacity-[0.35]" />
      <div className="absolute inset-0 comic-halftone-red opacity-[0.2]" />
      <div className="absolute inset-0 comic-slash opacity-[0.12]" />

      <div className="absolute inset-0 overflow-hidden">
        {SPEED_LINES.map((line) => (
          <motion.div
            key={line.id}
            className="absolute h-[2px] origin-left"
            style={{
              top: line.top,
              left: '-10%',
              width: `${line.width}%`,
              background:
                'linear-gradient(90deg, transparent, #111 20%, #ff0000 55%, transparent)',
              opacity: line.opacity,
            }}
            animate={{
              x: ['0%', '130%'],
              opacity: [0, line.opacity, 0],
            }}
            transition={{
              duration: 2.8 + (line.id % 4) * 0.4,
              repeat: Infinity,
              delay: line.delay,
              ease: 'easeInOut',
              repeatDelay: 1.2,
            }}
          />
        ))}
      </div>

      {BURSTS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute comic-burst"
          style={{
            top: b.top,
            left: 'left' in b ? b.left : undefined,
            right: 'right' in b ? b.right : undefined,
            width: b.size,
            height: b.size,
            background: b.color,
            opacity: b.color === '#111111' ? 0.1 : 0.2,
          }}
          animate={{
            scale: [0.92, 1.08, 0.92],
            rotate: [b.rotate - 4, b.rotate + 6, b.rotate - 4],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            delay: b.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {FLOAT_DOTS.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            background: d.id % 3 === 0 ? '#ff0000' : d.id % 3 === 1 ? '#111' : '#ffcc00',
            opacity: 0.25,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.4, 0.15] }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            delay: d.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      <motion.div
        className="absolute top-[12%] left-[3%] font-bebas text-[clamp(3rem,10vw,7rem)] leading-none tracking-wider select-none"
        style={{
          color: 'transparent',
          WebkitTextStroke: '2px rgba(17,17,17,0.12)',
        }}
        animate={{ x: [0, 12, 0], rotate: [-6, -4, -6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        POW
      </motion.div>
      <motion.div
        className="absolute bottom-[18%] right-[2%] font-bebas text-[clamp(2.5rem,8vw,5.5rem)] leading-none tracking-wider select-none"
        style={{
          color: 'transparent',
          WebkitTextStroke: '2px rgba(255,0,0,0.16)',
        }}
        animate={{ x: [0, -10, 0], rotate: [8, 5, 8] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        BOOM
      </motion.div>
      <motion.div
        className="absolute top-[48%] right-[12%] font-bebas text-[clamp(2rem,6vw,4rem)] leading-none tracking-wider select-none"
        style={{
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(17,17,17,0.1)',
        }}
        animate={{ scale: [1, 1.06, 1], rotate: [12, 16, 12] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        ZAP
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 65% at 50% 40%, rgba(255,250,243,0.55) 0%, rgba(255,250,243,0.2) 45%, transparent 70%)',
        }}
      />

      <div className="absolute inset-3 sm:inset-5 border-2 border-black/5 rounded-sm" />
      <div className="absolute inset-5 sm:inset-8 border border-[#ff0000]/10 rounded-sm" />
    </div>
  );
}

export const OttBackground = AnimatedBackground;
