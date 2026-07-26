import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FooterSection } from '@/sections/FooterSection';
import { PageLayout } from '@/components/PageLayout';
import { ContentCard, PolicySection } from '@/components/ContentCard';

export default function RefundPolicy() {
 const navigate = useNavigate();
 return (
 <PageLayout title="Refund Policy" subtitle="Alphamovil Digital Solutions LLP">
 <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
 <button
 onClick={() => navigate('/')}
 className="flex items-center gap-2 text-red-400 hover:text-rose-300 transition-colors font-orbitron text-xs uppercase tracking-widest mb-6"
 >
 <ArrowLeft size={14} /> Back to Home
 </button>

 <div className="space-y-4">
 <ContentCard>
 <p className="text-gray-400 text-sm mb-4">Last Updated: 09-07-2025</p>
 <p className="text-gray-100 leading-relaxed text-[15px]">
 Thank you for subscribing to Alphamovil's services. We hope you are satisfied with our services, but if not, we're here to help.
 </p>
 </ContentCard>

 <PolicySection title="1. Free Trial">
 Alphamovil offers no free trial for new users to experience the services before purchasing a subscription. During the trial period, users can cancel their subscription at any time without being charged.
 </PolicySection>

 <PolicySection title="2. Cancellation Policy">
 Subscribers may cancel their recurring subscription at any time. Upon cancellation, your account will remain active until the end of your current billing cycle.
 </PolicySection>

 <PolicySection title="3. Refund Eligibility">
 <p>To be eligible for a refund, you must submit a request within 2 days of your subscription start date. Refunds may be considered on a case-by-case basis and are granted at the sole discretion of Alphamovil.</p>
 <p className="mt-3">Refund requests can be made if you encounter technical issues that prevent you from using our service and that cannot be resolved by our support team. Proof of the issue may be required.</p>
 </PolicySection>

 <PolicySection title="4. Process for Requesting a Refund">
 To request a refund, please contact our customer support team at{' '}
 <a href="mailto:bd@alphamovil.com" className="text-red-300 hover:text-rose-300 hover:underline">bd@alphamovil.com</a>.
 {' '}Include your account information, subscription details, and a brief explanation of why you are requesting a refund.
 </PolicySection>

 <PolicySection title="5. Refund Processing">
 <p>Once your refund request is received and inspected, we will send you an email to notify you of the approval or rejection of your refund.</p>
 <p className="mt-3">If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 7 working days.</p>
 </PolicySection>

 <ContentCard className="space-y-4">
 <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
 Scenarios Where Refunds Would Typically Be Granted
 </h2>
 <div className="space-y-4 pt-2 border-t border-white/10">
 <div>
 <h3 className="text-white font-semibold text-base mb-2">Technical Issues</h3>
 <p className="text-gray-100 leading-relaxed text-[15px]">
 The customer experiences persistent technical issues that prevent them from using the product effectively.
 </p>
 </div>
 <div>
 <h3 className="text-white font-semibold text-base mb-2">Billing Error</h3>
 <p className="text-gray-100 leading-relaxed text-[15px]">
 The customer was incorrectly charged due to a billing error on Alphamovil's part.
 </p>
 </div>
 </div>
 </ContentCard>

 <ContentCard className="space-y-4">
 <h2 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
 Scenarios Where Refunds Would Not Typically Be Granted
 </h2>
 <div className="pt-2 border-t border-white/10">
 <h3 className="text-white font-semibold text-base mb-2">Change of Mind</h3>
 <p className="text-gray-100 leading-relaxed text-[15px]">
 The customer decides they no longer want or need the product after the refund eligibility period has passed.
 </p>
 </div>
 </ContentCard>

 <PolicySection title="7. Contact Us">
 <p className="mb-3">If you have any questions about our refund policy, please contact us:</p>
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
