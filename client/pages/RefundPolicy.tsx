import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FooterSection } from '@/sections/FooterSection';
import { PageLayout } from '@/components/PageLayout';
import { ContentCard, PolicySection } from '@/components/ContentCard';

export default function RefundPolicy() {
  const navigate = useNavigate();
  return (
    <PageLayout title="Refund Policy" subtitle="NumeroMobile Private Limited">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-orbitron text-xs uppercase tracking-widest mb-6"
        >
          <ArrowLeft size={14} /> Back to Home
        </button>

        <div className="space-y-4">
          <ContentCard>
            <p className="text-gray-400 text-sm mb-4">Last Updated: 09-07-2025</p>
            <p className="text-gray-100 leading-relaxed text-[15px]">
              Thank you for subscribing to NumeroMobile&apos;s services. We hope you are satisfied
              with our services, but if not, we&apos;re here to help.
            </p>
          </ContentCard>

          <PolicySection title="1. Free Trial">
            NumeroMobile offers no free trial for new users to experience the services before
            purchasing a subscription. During the trial period, users can cancel their subscription
            at any time without being charged.
          </PolicySection>

          <PolicySection title="2. Cancellation Policy">
            Subscribers may cancel their recurring subscription at any time. Upon cancellation, your
            account will remain active until the end of your current billing cycle.
          </PolicySection>

          <PolicySection title="3. Refund Eligibility">
            <p className="mb-3">
              To be eligible for a refund, you must submit a request within 2 days of your
              subscription start date. Refunds may be considered on a case-by-case basis and are
              granted at the sole discretion of NumeroMobile.
            </p>
            <p className="mb-3">
              Refund requests can be made if you encounter technical issues that prevent you from
              using our service and that cannot be resolved by our support team. Proof of the issue
              may be required.
            </p>
            <p>
              Please note that refunds are not guaranteed and may vary depending on the
              circumstances. Refund requests due to issues beyond NumeroMobile&apos;s control (e.g.,
              changes in personal circumstances, third-party hardware or software failures) will not
              be honored.
            </p>
          </PolicySection>

          <PolicySection title="4. Process for Requesting a Refund">
            To request a refund, please contact our customer support team at{' '}
            <a href="mailto:bd@numeromobile.com" className="text-cyan-300 hover:underline">
              bd@numeromobile.com
            </a>
            . Include your account information, subscription details, and a brief explanation of why
            you are requesting a refund.
          </PolicySection>

          <PolicySection title="5. Refund Processing">
            Once your refund request is received and inspected, we will send you an email to notify
            you of the approval or rejection of your refund. If approved, your refund will be
            processed, and a credit will automatically be applied to your original method of payment
            within 7 working days. Please note that refunds can only be made back to the original
            payment method used at the time of purchase.
          </PolicySection>

          <PolicySection title="6. Changes to Refund Policy">
            NumeroMobile reserves the right to modify this refund policy at any time. Changes will
            take effect immediately upon their posting on the website. By continuing to use our
            services after changes are made, you agree to be bound by the revised policy.
          </PolicySection>

          <PolicySection title="Scenarios Where Refunds Would Typically Be Granted">
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong className="text-white">Technical Issues:</strong> Persistent technical issues
                that prevent effective use of the product despite multiple support attempts.
              </li>
              <li>
                <strong className="text-white">Billing Error:</strong> Incorrect charges due to a
                billing error on NumeroMobile&apos;s part (e.g. double billing or charge after valid
                cancellation).
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="Scenarios Where Refunds Would Not Typically Be Granted">
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong className="text-white">Change of Mind:</strong> The customer decides they no
                longer want or need the product after the refund eligibility period has passed.
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="7. Contact Us">
            If you have any questions about our refund policy, please contact us at{' '}
            <a href="mailto:bd@numeromobile.com" className="text-cyan-300 hover:underline">
              bd@numeromobile.com
            </a>
            .
          </PolicySection>
        </div>
      </div>
      <FooterSection />
    </PageLayout>
  );
}
