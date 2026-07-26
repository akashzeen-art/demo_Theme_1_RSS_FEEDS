import { ReactNode } from 'react';

interface ContentCardProps {
 children: ReactNode;
 className?: string;
}

/** Frosted glass card for readable text over video backgrounds */
export function ContentCard({ children, className = '' }: ContentCardProps) {
 return (
 <div
 className={`rounded-2xl border border-white/10 px-5 sm:px-8 py-5 sm:py-6 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ${className}`}
 style={{
 background: 'rgba(8, 4, 18, 0.78)',
 boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
 }}
 >
 {children}
 </div>
 );
}

interface PolicySectionProps {
 title: string;
 children: ReactNode;
}

export function PolicySection({ title, children }: PolicySectionProps) {
 return (
 <ContentCard>
 <h2 className="text-white font-semibold text-lg sm:text-xl mb-3">{title}</h2>
 <div className="text-gray-100 leading-relaxed text-[15px]">{children}</div>
 </ContentCard>
 );
}
