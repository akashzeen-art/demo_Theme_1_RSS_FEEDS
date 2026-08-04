import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FooterSection } from '@/sections/FooterSection';
import { PageLayout } from '@/components/PageLayout';
import { ContentCard, PolicySection } from '@/components/ContentCard';

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  return (
    <PageLayout title="Privacy Policy" subtitle="NumeroMobile Private Limited">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-orbitron text-xs uppercase tracking-widest mb-6"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>

        <div className="space-y-4">
          <ContentCard>
            <p className="text-gray-400 text-sm mb-4">Last Updated: 01-08-2026</p>
            <p className="text-gray-100 leading-relaxed text-[15px] mb-4">
              This Privacy Policy describes how NumeroMobile (&quot;we&quot;, &quot;us&quot;, or
              &quot;our&quot;) collects, uses, discloses, and protects your personal information when
              you visit or make a purchase from StreamNow (the &quot;Site&quot;) or use any of our
              services (collectively, the &quot;Services&quot;).
            </p>
            <p className="text-gray-100 leading-relaxed text-[15px]">
              By using our Services, you agree to the collection and use of information as outlined
              in this Privacy Policy. If you do not agree, please do not use the Services.
            </p>
          </ContentCard>

          <PolicySection title="1. Information We Collect">
            <p className="mb-2 font-medium text-white">a) Information You Provide Directly</p>
            <ul className="list-disc list-inside space-y-1.5 mb-4">
              <li>Contact details: Name, phone number, email address, postal address</li>
              <li>Order details: Product purchase history, billing/shipping information</li>
              <li>Account information: Login credentials, preferences</li>
              <li>Customer support queries and feedback</li>
            </ul>
            <p className="mb-2 font-medium text-white">b) Automatically Collected Information</p>
            <ul className="list-disc list-inside space-y-1.5 mb-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device type and operating system</li>
              <li>Pages visited, time spent, and referring URLs</li>
            </ul>
            <p className="mb-2">
              This data is gathered using technologies like cookies and other tracking tools to
              enhance your browsing experience and improve our services.
            </p>
            <p className="mb-2 font-medium text-white">c) Third-Party Sources</p>
            <ul className="list-disc list-inside space-y-1.5">
              <li>Payment gateways (e.g., to process transactions)</li>
              <li>Analytics providers (e.g., to analyze traffic and usage patterns)</li>
              <li>Advertising or marketing platforms (e.g., to optimize campaign performance)</li>
            </ul>
          </PolicySection>

          <PolicySection title="2. How We Use Your Information">
            <ul className="list-disc list-inside space-y-1.5">
              <li>Process and fulfill orders</li>
              <li>Communicate with you about orders, updates, or issues</li>
              <li>Improve the functionality and user experience of the website</li>
              <li>Respond to inquiries and provide customer support</li>
              <li>
                Send promotional emails, newsletters, and marketing offers (you can opt out anytime)
              </li>
              <li>Monitor and prevent fraudulent transactions and abuse of our Services</li>
            </ul>
          </PolicySection>

          <PolicySection title="3. How We Share Your Information">
            <p className="mb-2">Your personal information may be shared only in limited circumstances:</p>
            <ul className="list-disc list-inside space-y-1.5 mb-3">
              <li>
                With service providers such as payment processors, hosting providers, and email
                service platforms
              </li>
              <li>
                With business partners to conduct joint promotions or events (only with your consent)
              </li>
              <li>
                With legal authorities where required by law, to protect our rights or in connection
                with a legal claim
              </li>
              <li>
                With affiliates or during business restructuring, such as mergers or acquisitions
              </li>
            </ul>
            <p>
              We do not sell your personal information. We do not share sensitive personal
              information for targeted advertising purposes.
            </p>
          </PolicySection>

          <PolicySection title="4. Cookies and Tracking Technologies">
            Cookies help us provide, protect, and improve our services. They enable functionalities
            like remembering your preferences and measuring user activity. You can manage or disable
            cookies in your browser settings. However, disabling cookies may affect certain features
            or functionalities of the website.
          </PolicySection>

          <PolicySection title="5. User-Generated Content">
            If you post content (e.g., reviews or comments) on public areas of the Site, it becomes
            publicly accessible. We are not responsible for how others use this information.
          </PolicySection>

          <PolicySection title="6. External Links">
            Our website may include links to third-party sites. We are not responsible for the
            privacy or security practices of these external platforms. Please review their privacy
            policies separately.
          </PolicySection>

          <PolicySection title="7. Children's Privacy">
            Our Services are not intended for users under the age of 16. We do not knowingly collect
            personal data from children. If you believe a child has submitted personal information
            through our platform, please contact us immediately at{' '}
            <a href="mailto:bd@numeromobile.com" className="text-cyan-300 hover:underline">
              bd@numeromobile.com
            </a>{' '}
            and we will take prompt steps to delete such information from our records.
          </PolicySection>

          <PolicySection title="8. Security and Retention">
            We take reasonable precautions to protect your personal information. However, no online
            transmission or storage is completely secure. We retain your information only as long as
            necessary for our business purposes or to meet legal requirements.
          </PolicySection>

          <PolicySection title="9. Your Rights">
            <p className="mb-2">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-1.5 mb-3">
              <li>Access and update your personal information</li>
              <li>Delete your data</li>
              <li>Opt out of marketing communications</li>
              <li>Restrict or object to certain data processing</li>
              <li>Request data portability</li>
            </ul>
            <p>
              To make any such request, please contact us at:
              <br />
              📧{' '}
              <a href="mailto:bd@numeromobile.com" className="text-cyan-300 hover:underline">
                bd@numeromobile.com
              </a>
              <br />
              📧 NumeroMobile, 417, Tower A1, Sector-49, Gurgaon, Haryana, 122011
            </p>
          </PolicySection>

          <PolicySection title="10. Disclaimer">
            The content provided on this platform, including movies and shows, OTT streaming videos,
            program information, and related materials, is intended for general informational and
            educational purposes only. It is not a substitute for professional medical, dietary, or
            program advice. Users are advised to consult a qualified health professional or expert
            regarding specific dietary needs, allergies, or medical conditions before following any
            movies and shows or watchlists.
            <br />
            <br />
            By using this platform and trying the movies and shows or OTT streaming techniques, you
            acknowledge that you do so voluntarily and at your own risk. The platform and its
            creators shall not be held responsible for any allergic reactions, content-related
            illnesses, injuries, damages, or losses resulting from the use of this content.
            Individual results and experiences may vary.
          </PolicySection>

          <PolicySection title="11. Governing Law and Jurisdiction">
            These Terms shall be governed and interpreted in accordance with the laws of India. Any
            disputes arising out of or relating to the use of this website shall be subject to the
            exclusive jurisdiction of the courts located in Gurgaon, Haryana.
          </PolicySection>

          <PolicySection title="12. Updates to this Privacy Policy">
            We may update this Privacy Policy periodically to reflect changes in our practices or
            legal obligations. Updates will be posted on this page with the revised date.
          </PolicySection>
        </div>
      </div>
      <FooterSection />
    </PageLayout>
  );
}
