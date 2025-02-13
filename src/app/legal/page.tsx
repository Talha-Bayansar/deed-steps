import { routes } from "@/lib/routes";
import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Legal Information</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 id="terms-of-service" className="text-2xl font-semibold mb-4">
            Terms of Service
          </h2>
          <div className="prose max-w-none">
            <h3>1. Acceptance of Terms</h3>
            <p>
              By accessing or using Deed Steps, you agree to be bound by these
              Terms of Service and all applicable laws and regulations. If you
              do not agree with any part of these terms, you may not use our
              service.
            </p>

            <h3>2. Description of Service</h3>
            <p>
              Deed Steps is a platform that allows users to track and manage
              good deeds within groups, with features including deed templates,
              point systems, and push notifications.
            </p>

            <h3>3. User Accounts</h3>
            <p>
              You must create an account to use Deed Steps. You are responsible
              for maintaining the confidentiality of your account and password.
              You agree to accept responsibility for all activities that occur
              under your account.
            </p>

            <h3>4. User Conduct</h3>
            <p>
              You agree to use Deed Steps only for lawful purposes and in a way
              that does not infringe the rights of, restrict or inhibit anyone
              else&apos;s use and enjoyment of the service.
            </p>

            <h3>5. Content</h3>
            <p>
              Users are solely responsible for the content they submit to Deed
              Steps. We reserve the right to remove any content that violates
              these terms or is otherwise objectionable.
            </p>

            <h3>6. Intellectual Property</h3>
            <p>
              The Deed Steps service and its original content, features, and
              functionality are owned by Deed Steps and are protected by
              international copyright, trademark, patent, trade secret, and
              other intellectual property or proprietary rights laws.
            </p>

            <h3>7. Termination</h3>
            <p>
              We may terminate or suspend your account and bar access to the
              service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever and without limitation,
              including but not limited to a breach of the Terms.
            </p>

            <h3>8. Limitation of Liability</h3>
            <p>
              In no event shall Deed Steps, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from your access
              to or use of or inability to access or use the service.
            </p>

            <h3>9. Changes to Terms</h3>
            <p>
              We reserve the right to modify or replace these Terms at any time.
              If a revision is material, we will provide at least 30 days&apos;
              notice prior to any new terms taking effect.
            </p>

            <h3>10. Contact Us</h3>
            <p>
              If you have any questions about these Terms, please contact us.
            </p>
          </div>
        </div>
        <div>
          <h2 id="privacy-policy" className="text-2xl font-semibold mb-4">
            Privacy Policy
          </h2>
          <div className="prose max-w-none">
            <h3>1. Information We Collect</h3>
            <p>
              We collect information you provide directly to us when you create
              an account, including your name, email address, and other profile
              information. We also collect data about your usage of the app,
              including deeds completed, group memberships, and points earned.
            </p>

            <h3>2. How We Use Your Information</h3>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>
                Send you technical notices, updates, security alerts, and
                support messages
              </li>
              <li>Respond to your comments, questions, and requests</li>
              <li>
                Communicate with you about products, services, offers, and
                events
              </li>
              <li>
                Monitor and analyze trends, usage, and activities in connection
                with our services
              </li>
            </ul>

            <h3>3. Information Sharing and Disclosure</h3>
            <p>
              We do not share, sell, or transfer your personal information to
              third parties except in the following circumstances:
            </p>
            <ul>
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect and defend our rights and property</li>
              <li>
                With service providers who assist in our operations (subject to
                confidentiality agreements)
              </li>
            </ul>

            <h3>4. Data Storage and Security</h3>
            <p>
              We use industry-standard security measures to protect your data.
              This includes encryption of sensitive information and regular
              security audits. Your data is stored in secure databases and may
              include:
            </p>
            <ul>
              <li>Personal information (name, email)</li>
              <li>Group memberships and roles</li>
              <li>Deed records and templates</li>
              <li>Points and transactions</li>
              <li>Push notification subscriptions</li>
            </ul>

            <h3>5. Cookies and Similar Technologies</h3>
            <p>
              We use cookies and similar tracking technologies to track activity
              on our service and hold certain information. Cookies are files
              with small amount of data which may include an anonymous unique
              identifier. You can instruct your browser to refuse all cookies or
              to indicate when a cookie is being sent.
            </p>

            <h3>6. User Rights</h3>
            <p>
              You have the right to access, correct, or delete your personal
              information. You can do this through your account settings or by
              contacting us directly.
            </p>

            <h3>7. Children&apos;s Privacy</h3>
            <p>
              Our service is not intended for use by children under the age of
              13. We do not knowingly collect personal information from children
              under 13.
            </p>

            <h3>8. Changes to This Privacy Policy</h3>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the &quot;effective date&quot; at the top of this
              page.
            </p>

            <h3>9. Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Link
          href={routes.landingPage.root}
          className="text-blue-600 hover:underline"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
