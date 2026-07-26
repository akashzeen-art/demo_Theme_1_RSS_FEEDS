import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FooterSection } from '@/sections/FooterSection';
import { PageLayout } from '@/components/PageLayout';
import { ContentCard, PolicySection } from '@/components/ContentCard';

export default function TermsOfService() {
 const navigate = useNavigate();
 return (
 <PageLayout title="Terms and Conditions" subtitle="Alphamovil Digital Solutions LLP">
 <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
 <button
 onClick={() => navigate('/')}
 className="flex items-center gap-2 text-red-400 hover:text-rose-300 transition-colors font-orbitron text-xs uppercase tracking-widest mb-6"
 >
 <ArrowLeft size={14} /> Back to Home
 </button>

 <div className="space-y-4">
 <ContentCard>
 <p className="text-gray-400 text-sm mb-4">Last Updated: 30-06-2025</p>
 <p className="text-gray-100 leading-relaxed text-[15px]">
 At Alphamovil Digital Solutions LLP, accessible one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and how we use it.
 </p>
 </ContentCard>

 <PolicySection title="Consent">
 By using our website, you hereby consent to our Privacy Policy and agree to its terms.
 </PolicySection>

 <PolicySection title="Information We Collect">
 The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
 </PolicySection>

 <PolicySection title="How We Use Your Information">
 <ul className="list-disc list-inside space-y-1.5">
 <li>Provide, operate, and maintain our website</li>
 <li>Improve, personalize, and expand our website</li>
 <li>Understand and analyze how you use our website</li>
 <li>Develop new products, services, features, and functionality</li>
 <li>Communicate with you for customer service and marketing purposes</li>
 </ul>
 </PolicySection>

 <PolicySection title="GDPR Data Protection Rights">
 <ul className="list-disc list-inside space-y-1.5">
 <li>The right to access – You have the right to request copies of your personal data</li>
 <li>The right to rectification – You have the right to request correction of inaccurate information</li>
 <li>The right to erasure – You have the right to request erasure of your personal data</li>
 <li>The right to restrict processing – You have the right to request restricted processing</li>
 <li>The right to data portability – You have the right to request data transfer</li>
 </ul>
 </PolicySection>

 <PolicySection title="Terms and Conditions">
 The Platform is owned by Alphamovil Digital Solutions LLP, a company incorporated under the Companies Act, 1956. Your use of the Platform and services are governed by these Terms of Use.
 </PolicySection>

 <PolicySection title="Disclaimer">
 The content provided on this platform, including all OTT streaming classes, videos, and related materials, is intended for general entertainment and entertainment purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Users are advised to consult a qualified viewercare professional before starting any new exercise program, especially if they have any pre-existing medical conditions, injuries, or concerns. By participating in these classes, you acknowledge that you do so voluntarily and at your own risk. The platform and its creators shall not be held responsible for any injuries, damages, or losses that may occur as a result of using this content. Individual results may vary.
 </PolicySection>

 <PolicySection title="Governing Law and Jurisdiction">
 These Terms shall be governed and interpreted in accordance with the laws of India. Any disputes arising out of or relating to the use of this website shall be subject to the exclusive jurisdiction of the courts located in Gurgaon, Haryana.
 </PolicySection>

 <PolicySection title="Contact Information">
 <ul className="list-disc list-inside space-y-1.5">
 <li>Contact Number: <a href="tel:+919667687077" className="text-red-300 hover:text-rose-300 hover:underline">9667687077</a></li>
 <li>Full Address: B-123, SUNCITY, SECTOR-54, Gurgaon, Haryana, 122011</li>
 <li>Email ID: <a href="mailto:bd@alphamovil.com" className="text-red-300 hover:text-rose-300 hover:underline">bd@alphamovil.com</a></li>
 </ul>
 </PolicySection>
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
