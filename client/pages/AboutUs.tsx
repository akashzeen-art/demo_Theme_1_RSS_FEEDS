import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FooterSection } from '@/sections/FooterSection';
import { PageLayout } from '@/components/PageLayout';
import { ContentCard } from '@/components/ContentCard';

export default function AboutUs() {
  const navigate = useNavigate();
  return (
    <PageLayout title="About Us" subtitle="StreamNow" badge="Welcome">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-orbitron text-xs uppercase tracking-widest mb-6"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>

        <div className="space-y-4">
          <ContentCard>
            <h2 className="text-white font-semibold text-xl mb-4">
              Welcome – Your Digital Gateway to Premium Entertainment
            </h2>
            <p className="text-gray-100 leading-relaxed text-[15px] mb-5">
              At StreamNow, we believe that OTT streaming should be accessible, flexible, and
              empowering. That&apos;s why we created a modern OTT streaming platform designed to
              bring the joy of OTT streaming directly to your screen anytime, anywhere.
            </p>
            <p className="text-gray-100 leading-relaxed text-[15px] mb-5">
              Our platform offers a curated collection of high-quality OTT streaming videos led by
              experienced content curators, focused on improving your entertainment skills,
              entertainment, and confidence in the platform. Whether you&apos;re a beginner or an
              advanced viewer, our diverse video library helps you stay consistent with your OTT
              streaming journey, at your own pace.
            </p>
            <p className="text-gray-100 leading-relaxed text-[15px]">
              As a OTT streaming subscription service, StreamNow bridges the gap between traditional
              OTT streaming classes and the demands of today&apos;s digital lifestyle. No more fixed
              schedules or crowded platforms — just pure, uninterrupted OTT streaming whenever you
              need it.
            </p>
          </ContentCard>

          <ContentCard>
            <h2 className="font-bebas text-3xl sm:text-4xl mb-4 tracking-wide">
              <span className="gradient-text">Our Mission</span>
            </h2>
            <p className="text-gray-100 leading-relaxed text-[15px] mb-5">
              To make OTT streaming an everyday joy for everyone by delivering affordable,
              expert-guided, and engaging content that nurtures your entertainment passion and
              skills.
            </p>
            <p className="text-gray-100 leading-relaxed text-[15px]">
              Join the StreamNow movement today — and let&apos;s viewer, experience, and grow
              together.
            </p>
          </ContentCard>

          <ContentCard>
            <h2 className="font-bebas text-3xl sm:text-4xl mb-6 tracking-wide">
              <span className="gradient-text">Platform</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { title: 'Watch anytime', desc: '' },
                { title: 'Expert Content Curators', desc: 'Certified professionals' },
                { title: 'Flexible Schedule', desc: 'Your own pace' },
                { title: 'Entertainment Passion', desc: 'Content & entertainment' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span className="text-cyan-400 text-lg leading-none mt-0.5">✓</span>
                  <div>
                    <span className="text-gray-100 text-sm leading-relaxed font-medium">
                      {item.title}
                    </span>
                    {item.desc ? (
                      <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </ContentCard>
        </div>
      </div>
      <FooterSection />
    </PageLayout>
  );
}
