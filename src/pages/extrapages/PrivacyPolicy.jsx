import React from "react";
import { Helmet } from "react-helmet-async";
//import LenisScrollWrapper from "../../components/LenisScrollWrapper";

const PrivacyPolicy = () => {
  return (
   // <LenisScrollWrapper>
   <>
   
   <Helmet>
  <title>Botfolio | Privacy Policy</title>
  <meta
    name="description"
    content="Read Botfolio’s privacy policy to understand how we collect, use, and protect your personal data."
  />
</Helmet>
   
    <div className="min-h-screen bg-white text-black px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Privacy <span className="text-[#F4A100] pacifico-regular">Policy</span>
        </h1>

        <p className="mb-6 text-gray-700">
          Your privacy is important to us. This Privacy Policy explains how Botfolio collects, uses, shares, and protects your information when you use our services.
        </p>

        {/* 1. Information We Collect */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li><strong>Personal Information:</strong> Name, email address, phone number, username.</li>
          <li><strong>Content:</strong> Portfolio links (Google Drive, YouTube), project details.</li>
          <li><strong>Technical Data:</strong> IP address, browser type, device information.</li>
          <li><strong>Cookies:</strong> We use cookies to improve your user experience.</li>
        </ul>

        {/* 2. How We Use Your Information */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>To provide and improve our services.</li>
          <li>To personalize your dashboard and portfolio page.</li>
          <li>To communicate with you about updates, offers, or important changes.</li>
          <li>To monitor and improve security and prevent fraud.</li>
        </ul>

        {/* 3. Sharing Your Information */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">3. Sharing Your Information</h2>
        <p className="text-gray-700">
          We do <strong>not</strong> sell, rent, or share your personal information with third parties for their marketing purposes.
          We may share data:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
          <li>With service providers (like hosting, analytics) under strict data agreements.</li>
          <li>To comply with legal obligations (like a court order).</li>
        </ul>

        {/* 4. Data Security */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">4. Data Security</h2>
        <p className="text-gray-700">
          We take data protection seriously. All user data is stored securely using industry best practices (e.g., encryption, HTTPS). However, no system is 100% secure. Use Botfolio responsibly.
        </p>

        {/* 5. Your Rights */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">5. Your Rights</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>You can access, update, or delete your personal information from your profile settings.</li>
          <li>You can request a full data export by contacting us.</li>
          <li>You can disable cookies in your browser settings.</li>
        </ul>

        {/* 6. Children’s Privacy */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">6. Children’s Privacy</h2>
        <p className="text-gray-700">
          Botfolio is not intended for use by individuals under 13. We do not knowingly collect data from children. If we discover such data, we will delete it immediately.
        </p>

        {/* 7. Changes to This Policy */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">7. Changes to This Policy</h2>
        <p className="text-gray-700">
          We may update this Privacy Policy from time to time. You will be notified of significant changes via email or in-app notifications. Continued use of Botfolio means you accept the updated policy.
        </p>

        {/* 8. Contact Us */}
        <h2 className="text-2xl font-semibold mt-8 mb-2">8. Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions or concerns about this Privacy Policy, please contact us at{" "}
          <a href="mailto:infobotfolio@gmail.com" className="text-[#F4A100] underline">infobotfolio@gmail.com</a>.
        </p>

        <p className="mt-12 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Botfolio. All rights reserved.
        </p>
      </div>
    </div>
    </>
   // </LenisScrollWrapper>
  );
};

export default PrivacyPolicy;
