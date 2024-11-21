import Footer from "~/ui/landing/Footer";
import MenuBar from "~/ui/landing/MenuBar";

export default function PrivacyPolicyPage() {
  return (
    <main
      className="items-center justify-center"
      style={{ minHeight: "calc(100vh - 5rem)" }}
    >
      <MenuBar />

      <div className="card z-10 mx-auto mt-24 max-w-5xl p-5 font-mono shadow-xl">
        <h1>Andamio Privacy Policy</h1>
        <p className="pb-5 text-xl text-secondary-foreground">Version 1.0.0</p>

        <h2>
          1. Introduction
        </h2>
        <p className="py-2">
          Andamio (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed
          to protecting your privacy. This Privacy Policy explains how we
          collect, use, disclose, and safeguard your information when you use
          our services. By accessing or using Andamio, you agree to the
          collection and use of information in accordance with this policy.
        </p>

        <h2>
          2. Information We Collect
        </h2>

        <h3>Personal Information</h3>
        <p className="py-2">
          When you create an account, contact us, or participate in our
          services, we may collect personal information, including but not
          limited to:
        </p>
        <ul className="ml-5 list-disc">
          <li className="py-1">Name</li>
          <li className="py-1">Email address</li>
          <li className="py-1">Username</li>
          <li className="py-1">Discord user data</li>
          <li className="py-1">Other contact information</li>
        </ul>

        <h3>
          Course and Contribution Data
        </h3>
        <p className="py-2">
          We collect data related to your course activities and contributions,
          such as:
        </p>
        <ul className="ml-5 list-disc">
          <li className="py-1">Course content you create or contribute to</li>
          <li className="py-1">Progress and completion status</li>
          <li className="py-1">Assignments and assessments</li>
          <li className="py-1">
            Credentials acquired (publicly recorded on blockchain)
          </li>
        </ul>

        <h3>Usage Data</h3>
        <p className="py-2">
          We may collect information on how the service is accessed and used,
          including:
        </p>
        <ul className="ml-5 list-disc">
          <li className="py-1">IP address</li>
          <li className="py-1">Browser type</li>
          <li className="py-1">Device information</li>
          <li className="py-1">Pages visited and time spent</li>
        </ul>

        <h2>
          3. How We Use Your Information
        </h2>

        <h3>
          To Provide and Maintain Our Service
        </h3>
        <ul className="ml-5 list-disc">
          <li className="py-1">
            To manage user accounts and provide access to our platform
          </li>
          <li className="py-1">
            To process transactions and send confirmations
          </li>
          <li className="py-1">To provide customer support</li>
        </ul>

        <h3>To Improve Our Services</h3>
        <ul className="ml-5 list-disc">
          <li className="py-1">To understand and analyze usage trends</li>
          <li className="py-1">
            To enhance the user experience and develop new features
          </li>
        </ul>

        <h3>For Communication</h3>
        <ul className="ml-5 list-disc">
          <li className="py-1">
            To send administrative information, such as updates and changes to
            our terms and policies
          </li>
          <li className="py-1">
            To send marketing and promotional communications (with opt-out
            options)
          </li>
        </ul>

        <h3>For Legal Compliance</h3>
        <ul className="ml-5 list-disc">
          <li className="py-1">
            To comply with legal obligations and protect our rights
          </li>
          <li className="py-1">
            To prevent and address fraud, security, and technical issues
          </li>
        </ul>

        <h2>
          4. How We Share Your Information
        </h2>

        <h3>
          Third-Party Service Providers
        </h3>
        <p className="py-2">
          We may share your information with third-party service providers for
          purposes such as:
        </p>
        <ul className="ml-5 list-disc">
          <li className="py-1">Payment processing</li>
          <li className="py-1">Email and communication services</li>
          <li className="py-1">Data analysis and marketing assistance</li>
          <li className="py-1">KYC providers (Know Your Customer)</li>
        </ul>

        <h3>Legal Requirements</h3>
        <p className="py-2">
          We may disclose your information if required by law or in response to
          valid requests by public authorities (e.g., court orders or government
          agencies).
        </p>

        <h3>Business Transfers</h3>
        <p className="py-2">
          If Andamio is involved in a merger, acquisition, or asset sale, your
          information may be transferred. We will provide notice before your
          personal information is transferred and becomes subject to a different
          privacy policy.
        </p>

        <h2>
          5. Data Security
        </h2>
        <p className="py-2">
          We implement reasonable security measures to protect your data from
          unauthorized access, use, alteration, and disclosure. However, no
          method of transmission over the Internet or electronic storage is 100%
          secure, and we cannot guarantee absolute security.
        </p>

        <h2>
          6. Data Retention
        </h2>
        <p className="py-2">
          We retain your personal information for as long as necessary to
          fulfill the purposes outlined in this Privacy Policy, unless a longer
          retention period is required or permitted by law. Inactive account
          data is deleted after 5 years unless requested for earlier deletion.
        </p>

        <h2>
          7. Your Data Privacy Rights
        </h2>

        <h3>Access and Correction</h3>
        <p className="py-2">
          You have the right to access and correct your personal data. You can
          update your information through your account settings or by contacting
          us.
        </p>

        <h3>Deletion</h3>
        <p className="py-2">
          You have the right to request the deletion of your personal data. We
          will remove your data from our databases within 90 days of your
          request. Note that on-chain data cannot be deleted.
        </p>

        <h3>
          Objection and Restriction
        </h3>
        <p className="py-2">
          You have the right to object to the processing of your personal data
          and to request the restriction of processing. You can withdraw consent
          at any time, without affecting the lawfulness of processing based on
          consent before its withdrawal.
        </p>

        <h2>
          8. Children’s Privacy
        </h2>
        <p className="py-2">
          Our services are not intended for children under the age of 18. We do
          not knowingly collect personal information from children under 13. If
          we become aware that we have collected personal information from a
          child under 18 without verification of parental consent, we will take
          steps to remove that information.
        </p>

        <h2>
          9. Data Protection Officer
        </h2>
        <p className="py-2">
          To ensure compliance with GDPR and other privacy laws, we have
          appointed a Data Protection Officer (DPO). You can contact our DPO for
          any questions or concerns about your data privacy.
        </p>
        <ul className="ml-5 list-disc">
          <li className="py-1">
            <strong>Data Protection Officer:</strong> Andrew Nishigaya
          </li>
          <li className="py-1">
            <strong>Email:</strong>{" "}
            <a href="mailto:dpo@andamio.io">dpo@andamio.io</a>
          </li>
        </ul>

        <h2>
          10. Changes to This Privacy Policy
        </h2>
        <p className="py-2">
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page and
          sending an email notification if we have your email address. You are
          advised to review this Privacy Policy periodically for any changes.
        </p>

        <h2>
          11. Contact Us
        </h2>
        <p className="py-2">
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>
        <ul className="ml-5 list-disc">
          <li className="py-1">
            <strong>Email:</strong>{" "}
            <a href="mailto:support@andamio.io">support@andamio.io</a>
          </li>
        </ul>
      </div>
      <Footer />
    </main>
  );
}
