import { Link } from 'react-router-dom';

const LEGAL_LINKS = [
  { href: '/terms', label: 'Terms of Services' },
  { href: '/refund', label: 'Refund Policy' },
  { href: '/privacy', label: 'Privacy Policy' },
];

export function FooterSection() {
  return (
    <footer
      className="relative mt-20 overflow-hidden"
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div
        className="h-px w-full"
        style={{
          background:
            'linear-gradient(90deg, rgb(139, 92, 246), rgb(6, 182, 212), rgb(245, 158, 11), rgb(139, 92, 246))',
          backgroundSize: '300% 100%',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 text-center">
        <div className="flex items-center justify-center mb-3">
          <img
            src="/logo/chalchitra.png"
            alt="Chalchitra"
            className="h-10 w-auto"
            onError={(e) => {
              e.currentTarget.src = '/logo.png';
            }}
          />
        </div>

        <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
          Your gateway to premium desi thriller, crime &amp; drama content
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 mb-6">
          {LEGAL_LINKS.map((link, i) => (
            <span key={link.href} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-600">|</span>}
              <Link to={link.href} className="hover:text-cyan-400 transition">
                {link.label}
              </Link>
            </span>
          ))}
        </div>

        <p className="text-xs text-slate-500">
          Copyright © 2026, NumeroMobile Private Limited All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
