import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Mail, Zap } from 'lucide-react';
import { FooterSection } from '@/sections/FooterSection';
import { PageLayout } from '@/components/PageLayout';

export default function ContactUs() {
  const navigate = useNavigate();
  return (
    <PageLayout
      title="Contact Us"
      subtitle="StreamNow · NumeroMobile Private Limited"
      badge="Get In Touch"
    >
      <div className="w-full max-w-2xl mx-auto px-6 sm:px-12 py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-red-400 hover:text-rose-300 transition-colors font-orbitron text-xs uppercase tracking-widest mb-8"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>

        <div className="glass-panel rounded-xl overflow-hidden mb-6">
          <ContactRow
            icon={<Building2 size={18} className="text-red-400" />}
            label="Company"
            value="NumeroMobile Private Limited"
          />
          <div className="border-t border-white/5" />
          <ContactRow
            icon={<Building2 size={18} className="text-red-400" />}
            label="Platform"
            value="StreamNow"
          />
          <div className="border-t border-white/5" />
          <ContactRow
            icon={<MapPin size={18} className="text-red-400" />}
            label="Address"
            value="417, Tower A1, Sector-49, Gurgaon, Haryana, 122011"
          />
          <div className="border-t border-white/5" />
          <ContactRow icon={<Mail size={18} className="text-red-400" />} label="Email">
            <a
              href="mailto:bd@numeromobile.com"
              className="text-red-400 hover:text-rose-300 hover:underline"
            >
              bd@numeromobile.com
            </a>
          </ContactRow>
          <div className="border-t border-white/5" />

          <div className="px-6 py-5">
            <a
              href="mailto:bd@numeromobile.com?subject=StreamNow%20Support"
              className="btn-neon flex items-center justify-center gap-2 w-full py-3.5 text-white font-orbitron font-bold uppercase text-sm rounded-xl"
            >
              <Mail size={16} />
              Send Us a Message
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4 glass-panel border-red-500/20 rounded-xl px-6 py-5 mb-12">
          <Zap size={20} className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-semibold text-sm mb-1">Need faster support?</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Email us at{' '}
              <a
                href="mailto:bd@numeromobile.com"
                className="text-red-400 hover:text-rose-300 hover:underline"
              >
                bd@numeromobile.com
              </a>{' '}
              for the quickest response. For refund requests, include your account information and
              subscription details.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-red-400 hover:text-rose-300 transition-colors font-orbitron text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>
      </div>

      <FooterSection />
    </PageLayout>
  );
}

function ContactRow({
  icon,
  label,
  value,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 px-6 py-5">
      <span className="mt-0.5">{icon}</span>
      <div>
        <p className="text-gray-500 font-orbitron text-[10px] uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-gray-200 text-sm leading-relaxed">{value ?? children}</p>
      </div>
    </div>
  );
}
