import Link from "next/link";
import Footer from "~/ui/landing/Footer";
import MenuBar from "~/ui/landing/MenuBar";

export default function TermAndConditionsPage() {
  return (
    <main
      className="items-center justify-center"
      style={{ minHeight: "calc(100vh - 5rem)" }}
    >
      <MenuBar />

      <div className="card z-10 mx-auto mt-24 max-w-5xl p-5 font-mono shadow-xl">
        <h1>Andamio Terms + Conditions</h1>
        <p className="pb-5 text-xl text-secondary-foreground">Version 1.0.0</p>

        <h2>
          1. Introduction
        </h2>
        <p className="py-2">
          Welcome to Andamio, a platform that enables organizations to create
          educational onboarding materials and manage contributions and
          reputation. These Terms and Conditions (&quot;Terms&quot;) govern your
          use of our services. By accessing or using Andamio, you agree to be
          bound by these Terms. If you do not agree to these Terms, you may not
          use the services.
        </p>

        <h2>
          2. Company Information
        </h2>
        <ul className="ml-5 list-disc">
          <li className="py-1">
            <strong>Company Name:</strong> Andamio
          </li>
          <li className="py-1">
            <strong>Registered Address:</strong> 2232 Dell Range BLVD., Suite
            245 Cheyenne, WY 82009
          </li>
          <li className="py-1">
            <strong>Jurisdiction:</strong> Wyoming, USA
          </li>
        </ul>

        <h2>
          3. User Information
        </h2>

        <h3>Types of Users</h3>
        <p className="py-2">
          Andamio serves both organizations/companies and individual
          learners/contributors.
        </p>

        <h3>Age Restrictions</h3>
        <p className="py-2">
          Users must be 18 years or older and legally able to engage in
          commercial transactions and agree to terms and conditions in Wyoming.
          By using Andamio, you represent and warrant that you have the right,
          authority, and capacity to enter into this agreement and to abide by
          all of the Terms and Conditions.
        </p>

        <h2>
          4. Platform Services
        </h2>

        <h3>Services Offered</h3>
        <ul className="ml-5 list-disc">
          <li className="py-1">
            Course creation and content uploading for organizations
          </li>
          <li className="py-1">Mastery-based certification for learners.</li>
        </ul>

        <h3>
          Paid Services and Subscriptions
        </h3>
        <ul className="ml-5 list-disc">
          <li className="py-1">
            Becoming a course creator requires contacting Andamio sales.
          </li>
          <li className="py-1">
            All courses are currently free for learners. Future pricing models
            may apply.
          </li>
        </ul>

        <h2>
          5. User Conduct
        </h2>

        <h3>Rules and Guidelines</h3>
        <ul className="ml-5 list-disc">
          <li className="py-1">Only legal content is allowed.</li>
          <li className="py-1">
            Entities must verify ownership or legal rights to the content
            posted.
          </li>
          <li className="py-1">
            Andamio complies with applicable laws and removes illegal content
            when identified.
          </li>
          <li className="py-1">
            Andamio reserves the right to remove inappropriate content.
          </li>
        </ul>

        <h3>Prohibited Conduct</h3>
        <p className="py-2">Users agree not to:</p>
        <ul className="ml-5 list-disc">
          <li className="py-1">
            Violate any local, state, national, or international law or
            regulation.
          </li>
          <li className="py-1">
            Post or transmit any content that is illegal, harmful, threatening,
            abusive, harassing, defamatory, vulgar, obscene, or otherwise
            objectionable.
          </li>
          <li className="py-1">
            Impersonate any person or entity, or falsely state or otherwise
            misrepresent your affiliation with a person or entity.
          </li>
          <li className="py-1">
            Engage in any activity that interferes with or disrupts the services
            or the servers and networks that are connected to the services.
          </li>
        </ul>

        <h3>Actions for Violations</h3>
        <ul className="ml-5 list-disc">
          <li className="py-1">
            For dangerous content (violent, obscene), Andamio may disable
            content and/or suspend accounts.
          </li>
          <li className="py-1">
            Actions range from content removal to account termination based on
            the violation&apos;s severity.
          </li>
        </ul>

        <h2>
          6. Content Management
        </h2>

        <h3>Ownership</h3>
        <p className="py-2">
          Content uploaded by organizations and learners is owned by the content
          creator or client organization.
        </p>

        <h3>
          Intellectual Property Rights
        </h3>
        <p className="py-2">
          Content creators must verify their rights to post materials. Andamio
          claims no copyright on non-Andamio-created content.
        </p>

        <h2>
          7. Data Privacy
        </h2>

        <p className="py-2">
          See{" "}
          <span className="underline hover:text-indigo-800">
            <Link href="/privacy-policy">Andamio Privacy Policy</Link>
          </span>
        </p>

        <h3>Breach Notification</h3>
        <ul className="ml-5 list-disc">
          <li className="py-1">
            In case of a data breach, we will notify users and the relevant
            authorities within 72 hours of discovering the breach.
          </li>
          <li className="py-1">
            Users will be informed via email and/or platform notifications about
            the nature of the breach and the steps taken to mitigate its
            effects.
          </li>
        </ul>

        <h2>
          8. Liability and Disclaimers
        </h2>

        <h3>Content Accuracy</h3>
        <p className="py-2">
          Andamio is not responsible for content accuracy. Content creators must
          vouch for their rights to the data they post.
        </p>

        <h3>Limitation of Liability</h3>
        <p className="py-2">
          To the fullest extent permitted by law, Andamio disclaims all
          warranties, express or implied, including, but not limited to, implied
          warranties of merchantability and fitness for a particular purpose.
          Andamio does not warrant that the services will be uninterrupted or
          error-free.
        </p>
        <p className="py-2">
          Andamio shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, or any loss of profits or
          revenues, whether incurred directly or indirectly, or any loss of
          data, use, goodwill, or other intangible losses resulting from (a)
          your use or inability to use the services; (b) any unauthorized access
          to or use of our services and/or any personal information stored
          therein; (c) any interruption or cessation of transmission to or from
          our services; (d) any bugs, viruses, trojan horses, or the like that
          may be transmitted to or through our services by any third party; (e)
          any errors or omissions in any content or for any loss or damage
          incurred as a result of the use of any content posted, emailed,
          transmitted, or otherwise made available through the services; and/or
          (f) the defamatory, offensive, or illegal conduct of any third party.
          In no event shall Andamio&apos;s aggregate liability for all claims
          relating to the services exceed the greater of one hundred U.S.
          dollars (U.S. $100.00) or the amount you paid Andamio, if any, in the
          last 12 months.
        </p>

        <h2>
          9. Termination of Service
        </h2>

        <h3>Termination by Andamio</h3>
        <ul className="ml-5 list-disc">
          <li className="py-1">
            Access can be terminated at any time without cause.
          </li>
          <li className="py-1">Accounts violating terms will be terminated.</li>
          <li className="py-1">
            Legal authority requests for termination will be honored.
          </li>
        </ul>

        <h3>
          User-Requested Termination
        </h3>
        <ul className="ml-5 list-disc">
          <li className="py-1">
            Users can terminate accounts through a provided mechanism. Data will
            be deleted within 90 days, except for on-chain data, which cannot be
            removed.
          </li>
          <li className="py-1">
            Deleting an account is permanent and unrecoverable.
          </li>
        </ul>

        <h2>
          10. Dispute Resolution
        </h2>

        <h3>Method</h3>
        <p className="py-2">Preferred method: Mediation.</p>

        <h3>Jurisdiction</h3>
        <p className="py-2">Disputes resolved under Wyoming, USA law.</p>

        <h2>
          11. Updates to Terms and Conditions
        </h2>

        <h3>Notification</h3>
        <ul className="ml-5 list-disc">
          <li className="py-1">
            Users will be notified via email and prompted to re-agree to updated
            Terms on the next platform access.
          </li>
          <li className="py-1">
            The latest T&C will be posted on our community Discord and website.
          </li>
        </ul>

        <h2>
          12. Content Removal Process
        </h2>

        <h3>Reporting Violations</h3>
        <ul className="ml-5 list-disc">
          <li className="py-1">
            Users can report violations via Discord channels or support email.
          </li>
          <li className="py-1">
            Andamio will notify content creators of violations and provide 30
            days for correction. Dangerous/illegal content will be removed
            immediately.
          </li>
        </ul>

        <h2>
          13. Content Review
        </h2>

        <h3>Review Policy</h3>
        <p className="py-2">
          Andamio does not actively monitor content but reserves the right to
          remove inappropriate or illegal content.
        </p>

        <h2>
          14. Contributor Roles
        </h2>

        <h3>Role Differentiation</h3>
        <p className="py-2">
          Different permissions for contributors, course creators, and
          contribution managers.
        </p>
        <ul className="ml-5 list-disc">
          <li className="py-1">
            <strong>Current Roles:</strong>
          </li>
          <ul className="ml-5 list-disc">
            <li className="py-1">
              Course Platform: Learner, Course Creator, Course Facilitator.
            </li>
            <li className="py-1">
              Contributor Platform: Contributor, Treasury Admin, Reviewer.
            </li>
          </ul>
        </ul>

        <h2>
          15. Data Retention
        </h2>

        <h3>Retention Period</h3>
        <p className="py-2">
          User data is retained for 5 years. Inactive account data is deleted
          after 5 years unless requested for earlier deletion.
        </p>

        <h2>
          16. Data Deletion
        </h2>

        <h3>Deletion Process</h3>
        <ul className="ml-5 list-disc">
          <li className="py-1">On-chain data cannot be deleted.</li>
          <li className="py-1">
            Off-chain data will be deleted within 90 days of user request per
            GDPR and CCPA guidelines.
          </li>
        </ul>

        <h2>
          17. Third-party Services
        </h2>

        <h3>Integration</h3>
        <ul className="ml-5 list-disc">
          <li className="py-1">
            Andamio may use third-party services (e.g., payment processors and
            KYC providers). Users are subject to their terms.
          </li>
          <li className="py-1">
            Andamio is not responsible for the privacy practices or the content
            of third-party services.
          </li>
        </ul>

        <h2>
          18. User Support
        </h2>

        <h3>Support Channels</h3>
        <p className="py-2">
          Support is available via Discord server and support email.
        </p>

        <h2>
          19. Payment and Refund Policies
        </h2>

        <h3>Future Policies</h3>
        <ul className="ml-5 list-disc">
          <li className="py-1">
            Subscription cancellations are effective at the billing cycle end.
            No partial refunds for fees already paid.
          </li>
          <li className="py-1">
            Payments are non-refundable unless otherwise required by law.
          </li>
        </ul>

        <h2>
          20. Marketing and Communications
        </h2>

        <h3>Communication Opt-out</h3>
        <p className="py-2">
          Users may opt out of marketing communications. However, they cannot
          opt out of the system and transactional messages while maintaining an
          account.
        </p>

        <h2>
          21. Governing Law
        </h2>

        <h3>Agreement Governing Law</h3>
        <p className="py-2">
          The agreement is governed by the laws of Wyoming, USA.
        </p>
        <p className="py-2">
          Any legal actions or proceedings related to or arising out of these
          Terms shall be brought exclusively in the courts located in Wyoming,
          USA.
        </p>
      </div>
      <Footer />
    </main>
  );
}
