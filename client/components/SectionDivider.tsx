import { motion } from 'framer-motion';

interface SectionDividerProps {
 colors?: string;
}

export function SectionDivider({
 colors = 'from-transparent via-red-500 to-transparent',
}: SectionDividerProps) {
 return (
 <motion.div
 className="relative w-full py-1"
 initial={{ opacity: 0, scaleX: 0 }}
 whileInView={{ opacity: 1, scaleX: 1 }}
 transition={{ duration: 1.2, ease: 'easeOut' }}
 viewport={{ once: true }}
 >
 <div className={`h-px bg-gradient-to-r ${colors}`} />
 <motion.div
 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-red-600 to-amber-400"
 animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
 transition={{ duration: 2, repeat: Infinity }}
 />
 </motion.div>
 );
}
