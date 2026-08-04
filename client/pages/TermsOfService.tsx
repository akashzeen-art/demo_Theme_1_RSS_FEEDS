import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FooterSection } from '@/sections/FooterSection';
import { PageLayout } from '@/components/PageLayout';
import { ContentCard, PolicySection } from '@/components/ContentCard';

export default function TermsOfService() {
  const navigate = useNavigate();
  return (
    <PageLayout title="Terms and Conditions" subtitle="NumeroMobile Private Limited">
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
              At NumeroMobile Private Limited, accessible one of our main priorities is the privacy
              of our visitors. This Privacy Policy document contains types of information that is
              collected and recorded and how we use it.
            </p>
            <p className="text-gray-100 leading-relaxed text-[15px]">
              If you have additional questions or require more information about our Privacy Policy,
              do not hesitate to contact us.
            </p>
          </ContentCard>

          <PolicySection title="Consent">
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </PolicySection>

          <PolicySection title="Information We Collect">
            The personal information that you are asked to provide, and the reasons why you are
            asked to provide it, will be made clear to you at the point we ask you to provide your
            personal information.
            <br />
            <br />
            If you contact us directly, we may receive additional information about you such as your
            name, email address, phone number, the contents of the message and/or attachments you
            may send us, and any other information you may choose to provide.
          </PolicySection>

          <PolicySection title="How We Use Your Information">
            <ul className="list-disc list-inside space-y-1.5">
              <li>Provide, operate, and maintain our website</li>
              <li>Improve, personalize, and expand our website</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you for customer service and marketing purposes</li>
              <li>Send you emails</li>
              <li>Find and prevent fraud</li>
            </ul>
          </PolicySection>

          <PolicySection title="Log Files">
            StreamNow follows a standard procedure of using log files. These files log visitors when
            they visit websites. The information collected by log files include internet protocol
            (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp,
            referring/exit pages, and possibly the number of clicks.
          </PolicySection>

          <PolicySection title="Cookies and Web Beacons">
            Like any other website, StreamNow uses &apos;cookies&apos;. These cookies are used to
            store information including visitors&apos; preferences, and the pages on the website that
            the visitor accessed or visited.
          </PolicySection>

          <PolicySection title="CCPA Privacy Rights">
            Under the CCPA, among other rights, California consumers have the right to:
            <ul className="list-disc list-inside space-y-1.5 mt-2">
              <li>
                Request that a business disclose the categories and specific pieces of personal data
                collected
              </li>
              <li>Request that a business delete any personal data about the consumer</li>
              <li>Request that a business not sell the consumer&apos;s personal data</li>
            </ul>
          </PolicySection>

          <PolicySection title="GDPR Data Protection Rights">
            <ul className="list-disc list-inside space-y-1.5">
              <li>
                The right to access – You have the right to request copies of your personal data
              </li>
              <li>
                The right to rectification – You have the right to request correction of inaccurate
                information
              </li>
              <li>
                The right to erasure – You have the right to request erasure of your personal data
              </li>
              <li>
                The right to restrict processing – You have the right to request restricted
                processing
              </li>
              <li>
                The right to object to processing – You have the right to object to our processing
              </li>
              <li>
                The right to data portability – You have the right to request data transfer
              </li>
            </ul>
          </PolicySection>

          <PolicySection title="Children's Information">
            StreamNow does not knowingly collect any Personal Identifiable Information from children
            under the age of 13. If you think that your child provided this kind of information on
            our website, we strongly encourage you to contact us immediately.
          </PolicySection>

          <ContentCard>
            <h2 className="text-white font-semibold text-lg sm:text-xl mb-3">
              Terms and Conditions
            </h2>
            <p className="text-gray-100 leading-relaxed text-[15px] mb-4">
              This document is an electronic record in terms of Information Technology Act, 2000 and
              rules there under as applicable.
            </p>
            <p className="text-gray-100 leading-relaxed text-[15px]">
              The Platform is owned by NumeroMobile Private Limited, a company incorporated under the
              Companies Act, 1956. Your use of the Platform and services are governed by these Terms
              of Use.
            </p>
          </ContentCard>

          <ContentCard>
            <p className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Accessing, browsing or otherwise using the Platform indicates your agreement to all
              the terms and conditions under these Terms of Use.
            </p>
          </ContentCard>

          <PolicySection title="Key Terms">
            <ul className="list-disc list-inside space-y-1.5">
              <li>
                You agree to provide true, accurate and complete information during registration
              </li>
              <li>Your use of our Services is solely at your own risk</li>
              <li>You agree to pay charges associated with availing the Services</li>
              <li>You agree not to use the Platform for any unlawful purpose</li>
              <li>You shall indemnify and hold harmless Platform Owner from any claims</li>
            </ul>
          </PolicySection>

          <ContentCard>
            <p className="text-gray-100 leading-relaxed text-[15px]">
              All disputes arising out of or in connection with these Terms shall be subject to the
              exclusive jurisdiction of Indian courts and governed by the laws of India.
            </p>
          </ContentCard>
        </div>
      </div>
      <FooterSection />
    </PageLayout>
  );
}
