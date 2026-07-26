import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FooterSection } from '@/sections/FooterSection';
import { PageLayout } from '@/components/PageLayout';
import { ContentCard, PolicySection } from '@/components/ContentCard';

export default function PrivacyPolicy() {
 const navigate = useNavigate();
 return (
 <PageLayout title="Privacy Policy" subtitle="Alphamovil Digital Solution LLP">
 <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
 <button
 onClick={() => navigate('/')}
 className="flex items-center gap-2 text-red-400 hover:text-rose-300 transition-colors font-orbitron text-xs uppercase tracking-widest mb-6"
 >
 <ArrowLeft size={14} /> Back to Home
 </button>

 <div className="space-y-4">
 <ContentCard>
 <p className="text-gray-400 text-sm mb-4">Last Updated: 14-07-2025</p>
 <p className="text-gray-100 leading-relaxed text-[15px] mb-4">
 This Privacy Policy describes how Alphamovil Digital Solution LLP ("we", "us", or "our") collects, uses, discloses, and protects your personal information when you visit or make a purchase from{' '}
 <a href="https://streamsindia.com" className="text-red-300 hover:text-rose-300 hover:underline">https://streamsindia.com</a> (the "Site") or use any of our services (collectively, the "Services").
 </p>
 <p className="text-gray-100 leading-relaxed text-[15px]">
 By using our Services, you agree to the collection and use of information as outlined in this Privacy Policy. If you do not agree, please do not use the Services.
 </p>
 </ContentCard>

 <PolicySection title="1. Information We Collect">
 <SubSection label="a) Information You Provide Directly">
 <ul className="list-disc list-inside space-y-1.5 mt-2">
 <li>Contact details: Name, phone number, email address, postal address</li>
 <li>Order details: Product purchase history, billing/shipping information</li>
 <li>Account information: Login credentials, preferences</li>
 <li>Customer support queries and feedback</li>
 </ul>
 </SubSection>
 <SubSection label="b) Automatically Collected Information">
 <ul className="list-disc list-inside space-y-1.5 mt-2">
 <li>IP address</li>
 <li>Browser type and version</li>
 <li>Device type and operating system</li>
 <li>Pages visited, time spent, and referring URLs</li>
 </ul>
 </SubSection>
 </PolicySection>

 <PolicySection title="2. How We Use Your Information">
 <ul className="list-disc list-inside space-y-1.5">
 <li>Process and fulfill orders</li>
 <li>Communicate with you about orders, updates, or issues</li>
 <li>Improve the functionality and user experience of the website</li>
 <li>Respond to inquiries and provide customer support</li>
 <li>Send promotional emails, newsletters, and marketing offers (you can opt out anytime)</li>
 <li>Monitor and prevent fraudulent transactions and abuse of our Services</li>
 </ul>
 </PolicySection>

 <PolicySection title="3. How We Share Your Information">
 <p className="mb-3">Your personal information may be shared only in limited circumstances:</p>
 <ul className="list-disc list-inside space-y-1.5">
 <li>With service providers such as payment processors, hosting providers, and email service platforms</li>
 <li>With business partners to conduct joint promotions or events (only with your consent)</li>
 <li>With legal authorities where required by law</li>
 <li>With affiliates or during business restructuring, such as mergers or acquisitions</li>
 </ul>
 <p className="mt-3">We do not sell your personal information. We do not share sensitive personal information for targeted advertising purposes.</p>
 </PolicySection>

 <PolicySection title="4. Cookies and Tracking Technologies">
 Cookies help us provide, protect, and improve our services. You can manage or disable cookies in your browser settings. However, disabling cookies may affect certain features or functionalities of the website.
 </PolicySection>

 <PolicySection title="Children's Privacy">
 Our Services are not intended for users under the age of 16. We do not knowingly collect personal data from children. If you believe a child has submitted personal information through our platform, please contact us immediately at{' '}
 <a href="mailto:bd@alphamovil.com" className="text-red-300 hover:text-rose-300 hover:underline">bd@alphamovil.com</a>{' '}
 and we will take prompt steps to delete such information from our records.
 </PolicySection>

 <PolicySection title="9. Your Rights">
 <p className="mb-3">Depending on your jurisdiction, you may have the right to:</p>
 <ul className="list-disc list-inside space-y-1.5">
 <li>Access and update your personal information</li>
 <li>Delete your data</li>
 <li>Opt out of marketing communications</li>
 <li>Restrict or object to certain data processing</li>
 <li>Request data portability</li>
 </ul>
 </PolicySection>

 <PolicySection title="Governing Law and Jurisdiction">
 These Terms shall be governed and interpreted in accordance with the laws of India. Any disputes arising out of or relating to the use of this website shall be subject to the exclusive jurisdiction of the courts located in Gurgaon, Haryana.
 </PolicySection>

 <PolicySection title="Contact Information">
 <p className="mb-3">To make any such request, or for privacy-related inquiries, please contact us:</p>
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

function SubSection({ label, children }: { label: string; children: React.ReactNode }) {
 return (
 <div className="mb-5 last:mb-0">
 <p className="text-white font-medium mb-1">{label}</p>
 {children}
 </div>
 );
}
