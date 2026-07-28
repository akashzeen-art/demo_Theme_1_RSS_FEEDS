import { motion } from 'framer-motion';

const STARS = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  x: `${(i * 37) % 100}%`,
  y: `${(i * 53) % 100}%`,
  size: 1 + (i % 3) * 1.5,
  delay: (i % 7) * 0.3,
  duration: 2.8 + (i % 4) * 0.5,
}));

const NEBULAS = [
  { top: '-10%', left: '-6%', size: 420, color: 'rgba(34,211,238,0.16)', delay: 0 },
  { top: '8%', right: '-8%', size: 360, color: 'rgba(59,130,246,0.12)', delay: 0.8 },
  { top: '48%', left: '18%', size: 300, color: 'rgba(14,165,233,0.10)', delay: 1.4 },
] as const;

const COMETS = [
  { top: '16%', left: '14%', delay: 0.3, duration: 10 },
  { top: '38%', left: '72%', delay: 2.2, duration: 12 },
  { top: '68%', left: '26%', delay: 4.1, duration: 11 },
] as const;

/** Dark cosmic background — stars, blue nebula and soft horizon glow */
export function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden comic-bg"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[#040b14]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% 8%, rgba(34,211,238,0.12), transparent 55%), radial-gradient(ellipse 70% 50% at 100% 80%, rgba(59,130,246,0.14), transparent 52%), linear-gradient(180deg, #06111c 0%, #07111f 52%, #08131f 100%)',
        }}
      />

      {NEBULAS.map((n, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            top: n.top,
            left: 'left' in n ? n.left : undefined,
            right: 'right' in n ? n.right : undefined,
            width: n.size,
            height: n.size,
            background: n.color,
          }}
          animate={{
            x: [0, 20, -10, 0],
            y: [0, -16, 12, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: 11 + i * 2,
            repeat: Infinity,
            delay: n.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {STARS.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            background: d.id % 3 === 0 ? '#ffffff' : d.id % 3 === 1 ? '#67e8f9' : '#93c5fd',
            opacity: 0.35,
            boxShadow: '0 0 10px rgba(255,255,255,0.35)',
          }}
          animate={{ y: [0, -10, 0], opacity: [0.18, 0.75, 0.18], scale: [0.8, 1.15, 0.85] }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            delay: d.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {COMETS.map((comet, i) => (
        <motion.div
          key={i}
          className="absolute h-px w-24 rounded-full"
          style={{
            top: comet.top,
            left: comet.left,
            background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(147,197,253,0.95), rgba(255,255,255,0))',
            boxShadow: '0 0 18px rgba(147,197,253,0.35)',
            transform: 'rotate(-28deg)',
            opacity: 0,
          }}
          animate={{
            x: [0, 220, 360],
            y: [0, 80, 130],
            opacity: [0, 0.95, 0],
          }}
          transition={{
            duration: comet.duration,
            repeat: Infinity,
            delay: comet.delay,
            ease: 'easeInOut',
            repeatDelay: 3.5,
          }}
        />
      ))}

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 58% at 50% 35%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 45%, transparent 72%), radial-gradient(circle at 20% 22%, rgba(34,211,238,0.08), transparent 24%), radial-gradient(circle at 78% 18%, rgba(96,165,250,0.08), transparent 22%)',
        }}
      />

      <div className="absolute inset-0 opacity-[0.10]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '120px 120px' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(2,6,23,0.42)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#07111f] via-[#07111f]/92 to-transparent" />
    </div>
  );
}

export const OttBackground = AnimatedBackground;
