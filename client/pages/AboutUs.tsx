import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FooterSection } from '@/sections/FooterSection';
import { PageLayout } from '@/components/PageLayout';
import { ContentCard } from '@/components/ContentCard';

export default function AboutUs() {
 const navigate = useNavigate();
 return (
 <PageLayout title="About Us" subtitle="StreamsIndia" badge="Welcome">
 <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
 <button
 onClick={() => navigate('/')}
 className="flex items-center gap-2 text-red-400 hover:text-rose-300 transition-colors font-orbitron text-xs uppercase tracking-widest mb-6"
 >
 <ArrowLeft size={14} /> Back to Home
 </button>

 <div className="space-y-4">
 <ContentCard>
 <h2 className="text-white font-semibold text-xl mb-4">
 Your digital gateway to premium entertainment
 </h2>
 <p className="text-gray-100 leading-relaxed text-[15px] mb-5">
 StreamsIndia is a modern OTT platform built for India — movies, web series, live streams, sports and short-form reels, all in one place.
 </p>
 <p className="text-gray-100 leading-relaxed text-[15px] mb-5">
 We curate thrillers, crime dramas, action blockbusters and binge-worthy originals so you can watch what you love, whenever you want — on any screen.
 </p>
 <p className="text-gray-100 leading-relaxed text-[15px]">
 No fixed schedules. No crowded theatres. Just unlimited streaming, powered by Alphamovil Digital Solutions LLP.
 </p>
 </ContentCard>

 <ContentCard>
 <h2 className="font-bebas text-3xl sm:text-4xl mb-4 tracking-wide">
 <span className="gradient-text">Our Mission</span>
 </h2>
 <p className="text-gray-100 leading-relaxed text-[15px] mb-5">
 To make premium entertainment accessible and affordable for everyone — with a catalog that spans cinema, sports, live events and short-form storytelling.
 </p>
 <p className="text-gray-100 leading-relaxed text-[15px]">
 Join StreamsIndia today and start watching in seconds.
 </p>
 </ContentCard>

 <ContentCard>
 <h2 className="font-bebas text-3xl sm:text-4xl mb-6 tracking-wide">
 <span className="gradient-text">Why StreamsIndia</span>
 </h2>
 <div className="grid sm:grid-cols-2 gap-3">
 {[
 'Movies & blockbusters',
 'Binge-worthy web series',
 'Live streams & events',
 'Sports highlights',
 'Short-form reels',
 'Watch anytime, anywhere',
 ].map((item) => (
 <div key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
 <span className="text-red-500 text-lg leading-none mt-0.5">✓</span>
 <span className="text-gray-100 text-sm leading-relaxed">{item}</span>
 </div>
 ))}
 </div>
 </ContentCard>

 <ContentCard>
 <h2 className="font-bebas text-3xl sm:text-4xl mb-6 tracking-wide">
 <span className="gradient-text">Contact Information</span>
 </h2>
 <div className="space-y-4">
 <DetailRow label="Company" value="Alphamovil Digital Solutions LLP" />
 <DetailRow label="Address" value="B-123, SUNCITY, SECTOR-54, Gurgaon, Haryana, 122011" />
 <DetailRow label="Phone">
 <a href="tel:+919667687077" className="text-red-300 hover:text-rose-300 hover:underline">9667687077</a>
 </DetailRow>
 <DetailRow label="Email">
 <a href="mailto:bd@alphamovil.com" className="text-red-300 hover:text-rose-300 hover:underline">bd@alphamovil.com</a>
 </DetailRow>
 </div>
 </ContentCard>
 </div>

 <button
 onClick={() => navigate('/')}
 className="flex items-center gap-2 text-red-400 hover:text-rose-300 transition-colors mt-8 font-orbitron text-xs uppercase tracking-widest"
 >
 <ArrowLeft size={14} /> Back to Home
 </button>
 </div>

 <FooterSection />
 </PageLayout>
 );
}

function DetailRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
 return (
 <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6 pb-4 border-b border-white/10 last:border-0 last:pb-0">
 <span className="text-gray-400 font-orbitron text-xs uppercase tracking-widest min-w-[140px]">{label}</span>
 <span className="text-gray-100 text-sm leading-relaxed">{value ?? children}</span>
 </div>
 );
}
