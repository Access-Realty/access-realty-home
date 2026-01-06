// ABOUTME: Privacy Policy page for Access Realty
// ABOUTME: Legal privacy policy and data handling information

import { HeroSection, Section, AccessCTA } from "@/components/layout";

export default function PrivacyPolicy() {
  return (
    <>
      <HeroSection maxWidth="4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
          Privacy Policy
        </h1>
        <p className="text-primary-foreground/80">
          <strong>Last Updated:</strong> December 8, 2025
        </p>
      </HeroSection>

      <Section variant="content" maxWidth="4xl" background="default">
        <article className="bg-card rounded-xl p-6 md:p-10 border border-border prose prose-lg max-w-none">

          <hr className="my-6" />

          <p className="text-lg"><strong>At Access Realty, we are committed to protecting your privacy.</strong> This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our real estate listing platform and services.</p>

          <hr className="my-6" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">What Information Do We Collect?</h2>
          <p>We collect information from you when you create an account, list a property, schedule showings, communicate through our platform, or use our services. The types of information we collect include:</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Personal Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Information:</strong> Name, email address, phone number, mailing address</li>
            <li><strong>Authentication Data:</strong> Password (encrypted) or OAuth tokens when signing in through Google, Apple, or Facebook</li>
            <li><strong>Profile Information:</strong> User preferences, notification settings, and account type</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Third-Party Authentication (Google, Apple, Facebook)</h3>
          <p>When you choose to sign in using Google, Apple, or Facebook, we receive the following information from the authentication provider:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Email Address:</strong> Your email address associated with your Google, Apple, or Facebook account</li>
            <li><strong>Name:</strong> Your first and last name as registered with the provider</li>
            <li><strong>Profile Picture:</strong> Your profile photo (if available and permitted by the provider)</li>
          </ul>
          <p className="mt-4"><strong>How we use this data:</strong> We use your email address and name solely to create and identify your Access Realty account. We do not access your contacts, calendar, emails, or any other data from these services beyond what is listed above.</p>
          <p className="mt-2"><strong>Storage:</strong> Your email and name are stored securely in our database. OAuth tokens are encrypted and used only to verify your identity during sign-in. We do not share this authentication data with third parties except as required to operate our service.</p>
          <p className="mt-2"><strong>Revoking access:</strong> You can disconnect your Google, Apple, or Facebook account at any time through your account settings or by contacting us. You may also revoke access directly through your Google, Apple, or Facebook account settings.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Property Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Property Details:</strong> Address, property specifications (bedrooms, bathrooms, square footage, year built, etc.)</li>
            <li><strong>Financial Information:</strong> List price, mortgage information, lien details, tax information, HOA fees</li>
            <li><strong>Legal Information:</strong> Deed details, title information, seller disclosures, insurance claims</li>
            <li><strong>Media:</strong> Property photos, videos, floor plans, virtual tours</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Transaction Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Payment Information:</strong> Credit card details (processed securely through third-party payment processors), payment history, service fees</li>
            <li><strong>Contract Data:</strong> Purchase agreements, offers, counteroffers, addendums</li>
            <li><strong>Communication Records:</strong> Emails, messages, showing feedback, and correspondence with buyers, agents, and service providers</li>
            <li><strong>Showing Feedback:</strong> Information collected from buyer agents after property showings, including interest level, comments, and concerns. We may use automated phone calls to collect this feedback to ensure you receive timely insights about each showing.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Automated Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform, search queries</li>
            <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
            <li><strong>Analytics Data:</strong> Listing performance metrics, showing statistics, engagement data</li>
            <li><strong>Cookies and Tracking:</strong> Session cookies, preference cookies, analytics cookies</li>
          </ul>

          <p className="mt-4">You may visit our site anonymously or browse certain public areas without creating an account.</p>

          <hr className="my-6" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">How Do We Use Your Information?</h2>
          <p>Any information we collect from you may be used in the following ways:</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">To Provide Our Services</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create and manage your property listings on MLS and syndication platforms</li>
            <li>Coordinate professional photography, videography, and marketing materials</li>
            <li>Schedule and manage property showings</li>
            <li>Facilitate communication between you, buyers, buyer agents, title companies, lenders, and other parties</li>
            <li>Process payments for our services securely</li>
            <li>Manage contracts and digital document signing</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">To Improve Your Experience</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide real-time analytics on listing performance, showing activity, and market trends</li>
            <li>Collect and analyze showing feedback to help you understand buyer interest</li>
            <li>Deliver personalized dashboards with relevant metrics and insights</li>
            <li>Generate unique listing-specific email addresses (ntries[ID]@access.realty) for organized communication</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">To Communicate With You</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Send transaction updates, showing confirmations, and important notifications</li>
            <li>Provide market reports and pricing recommendations</li>
            <li>Respond to inquiries and customer service requests</li>
            <li>Send periodic emails about your listing status and platform updates</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">To Enhance Platform Security and Functionality</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Authenticate your identity and prevent fraud</li>
            <li>Monitor and analyze platform usage to improve our services</li>
            <li>Troubleshoot technical issues and maintain system integrity</li>
            <li>Enforce our Terms of Service and protect our legal rights</li>
          </ul>

          <hr className="my-6" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">How Do We Protect Your Information?</h2>
          <p>We implement comprehensive security measures to maintain the safety of your personal information:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Encryption:</strong> All sensitive data is encrypted both in transit (SSL/TLS) and at rest</li>
            <li><strong>Secure Payment Processing:</strong> Credit card information is processed through PCI-compliant infrastructure and never stored on our servers</li>
            <li><strong>Access Controls:</strong> Role-based access restrictions ensure only authorized personnel can access your data</li>
            <li><strong>Authentication:</strong> Secure login systems with support for single sign-on (SSO) through trusted providers</li>
            <li><strong>Regular Audits:</strong> Ongoing security assessments and vulnerability testing</li>
            <li><strong>Data Backups:</strong> Regular backups to prevent data loss</li>
            <li><strong>Monitoring:</strong> Continuous monitoring for suspicious activity and unauthorized access attempts</li>
          </ul>
          <p className="mt-4">While we use industry-standard security measures, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security but are committed to protecting your information to the best of our ability.</p>

          <hr className="my-6" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">Information Sharing and Disclosure</h2>
          <p className="font-semibold">We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.</p>
          <p className="mt-4">However, we may share your information with trusted third parties in the following circumstances:</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Service Providers</h3>
          <p>We share information with trusted third-party service providers who assist us in operating our platform and providing services to you. These parties agree to keep your information confidential and include:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Multiple Listing Service (MLS) providers for property listing distribution</li>
            <li>Showing scheduling and coordination platforms</li>
            <li>Digital contract signing and document management services</li>
            <li>Payment processors for secure financial transactions</li>
            <li>Property syndication platforms and listing websites</li>
            <li>Email delivery and communication services</li>
            <li>Cloud hosting and data storage providers</li>
            <li>Analytics and performance monitoring tools</li>
          </ul>

          <hr className="my-6" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>If you have any questions regarding this Privacy Policy, wish to exercise your privacy rights, or need assistance with your account, please contact us:</p>
          <div className="mt-4 bg-muted p-6 rounded-lg">
            <p className="font-semibold">Access Realty</p>
            <p>5755 Rufe Snow Dr STE 120</p>
            <p>North Richland Hills, TX 76180</p>
            <p className="mt-2"><strong>Email:</strong> <a href="mailto:info@access.realty" className="text-primary hover:underline">info@access.realty</a></p>
            <p><strong>Website:</strong> <a href="https://access.realty" className="text-primary hover:underline">https://access.realty</a></p>
            <p className="mt-2"><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM CST</p>
          </div>
        </article>
      </Section>

      <AccessCTA
        heading="Have Questions?"
        subheading="Our team is here to help with any questions about our services."
      />
    </>
  );
}
