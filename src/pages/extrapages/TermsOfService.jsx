import React from "react";
import { Helmet } from "react-helmet-async";
//import LenisScrollWrapper from "../../components/LenisScrollWrapper";

const TermsOfService = () => {
  return (
   // <LenisScrollWrapper>
   <>
   
   <Helmet>
  <title>Botfolio | Terms of Service</title>
  <meta
    name="description"
    content="Review Botfolio’s terms of service to know your rights, responsibilities, and usage guidelines."
  />
</Helmet>
   
   
    <div className="min-h-screen bg-white text-black px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Terms of <span className="text-[#F4A100] pacifico-regular">Service</span>
        </h1>

        <p className="mb-6 text-gray-700">
          Welcome to <strong>Botfolio</strong>. By accessing or using our platform, you agree to be bound by the following Terms of Service. Please read them carefully.
        </p>

        {/* Section 1 */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">1. Acceptance of Terms</h2>
        <p className="text-gray-700">
          By using Botfolio, you agree to comply with and be legally bound by these Terms. If you do not agree to any part of the Terms, you may not access or use our platform.
        </p>

        {/* Section 2 */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">2. User Accounts</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>You must provide accurate information when signing up.</li>
          <li>You're responsible for maintaining the confidentiality of your login credentials.</li>
          <li>We reserve the right to suspend or terminate accounts that violate our policies.</li>
        </ul>

        {/* Section 3 */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">3. Use of the Platform</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Botfolio allows users to create, manage, and showcase freelance portfolios.</li>
          <li>You may not use Botfolio for any illegal or unauthorized purpose.</li>
          <li>Any attempt to hack, harm, or misuse our systems will result in legal action.</li>
        </ul>

        {/* Section 4 */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">4. Content Ownership</h2>
        <p className="text-gray-700">
          You retain ownership of your content. However, by uploading to Botfolio, you grant us a non-exclusive license to use, display, and promote your work within the platform (e.g., public portfolios).
        </p>

        {/* Section 5 */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">5. Privacy</h2>
        <p className="text-gray-700">
          We care deeply about your privacy. Please refer to our <a href="/privacy-policy" className="text-[#F4A100] underline">Privacy Policy</a> to understand how we handle your data.
        </p>

        {/* Section 6 */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">6. Payments and Subscriptions</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Some features are available only under paid plans.</li>
          <li>Subscription fees are billed monthly/yearly and are non-refundable once charged.</li>
          <li>Upgrading/downgrading your plan will take effect immediately or at the end of the billing cycle.</li>
        </ul>

        {/* Section 7 */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">7. Termination</h2>
        <p className="text-gray-700">
          We reserve the right to suspend or terminate your account at any time for violations of these terms or for any reason deemed necessary to protect the platform or its users.
        </p>

        {/* Section 8 */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">8. Limitation of Liability</h2>
        <p className="text-gray-700">
          Botfolio is provided "as is" without warranties of any kind. We are not responsible for any damages or losses resulting from your use of the platform.
        </p>

        {/* Section 9 */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">9. Modifications</h2>
        <p className="text-gray-700">
          We may update these Terms from time to time. Users will be notified of significant changes. Continued use of Botfolio after updates means you accept the revised terms.
        </p>

        {/* Section 10 */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">10. Contact</h2>
        <p className="text-gray-700">
          If you have any questions about these Terms, please contact us at{" "}
          <a href="mailto:infobotfolio@gmail.com" className="text-[#F4A100] underline">infobotfolio@gmail.com</a>.
        </p>

        <p className="mt-12 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Botfolio. All rights reserved.
        </p>
      </div>
    </div>
    </>
//    </LenisScrollWrapper>
  );
};

export default TermsOfService;
