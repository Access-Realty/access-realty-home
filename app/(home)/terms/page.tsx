// ABOUTME: Terms of Service page for Access Realty
// ABOUTME: Legal terms and conditions for platform use

import Link from "next/link";
import { HeroSection, Section, AccessCTA } from "@/components/layout";

export default function TermsOfService() {
  return (
    <>
      <HeroSection maxWidth="4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
          Terms of Service
        </h1>
        <p className="text-primary-foreground/80">
          <strong>Last Updated:</strong> October 21, 2025
        </p>
      </HeroSection>

      <Section variant="content" maxWidth="4xl" background="default">
        <article className="bg-card rounded-xl p-6 md:p-10 border border-border prose prose-lg max-w-none">

          <hr className="my-6" />

          <p className="text-lg">Welcome to Access Realty! These Terms of Service (&quot;Terms&quot;) govern your access to and use of our real estate listing platform, website, and services. By creating an account or using our services, you agree to be bound by these Terms.</p>

          <p className="mt-4">Please read these Terms carefully before using our platform. If you do not agree to these Terms, you may not access or use our services.</p>

          <hr className="my-6" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By accessing or using the Access Realty platform (&quot;Platform&quot;), you agree to comply with and be bound by these Terms of Service, our <Link href="/privacy" className="text-[#2C5282] hover:underline">Privacy Policy</Link>, and our Communications Policy.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Eligibility</h3>
          <p>You must be at least 18 years old to use our services. By using our Platform, you represent and warrant that:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You are at least 18 years of age</li>
            <li>You have the legal capacity to enter into binding contracts</li>
            <li>You are not prohibited from using our services under applicable laws</li>
            <li>All information you provide is accurate and complete</li>
          </ul>

          <hr className="my-6" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Account Registration and Security</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Creating an Account</h3>
          <p>To access features of our Platform, you must create an account. You may register using email and password or through Single Sign-On (SSO) providers including Google, Apple, or Facebook.</p>
          <p className="mt-4">When you create an account, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Keep your password secure and confidential</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Account Termination</h3>
          <p>We may suspend or terminate your account for violations of these Terms, fraudulent activity, or as otherwise necessary. You may close your account at any time by contacting us.</p>

          <hr className="my-6" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Our Services</h2>
          <p>Access Realty provides a technology platform for property sellers to list, market, and manage the sale of their real estate. Our services may include property listing management, MLS distribution, marketing coordination, showing management, communication tools, analytics, and transaction support.</p>
          <p className="mt-4"><strong>Service Agreements:</strong> Specific services, pricing, payment terms, and service levels are detailed in separate Service Agreements that you sign when engaging our services. Those agreements govern the business terms of our relationship.</p>
          <p className="mt-4"><strong>Service Changes:</strong> We reserve the right to modify, suspend, or discontinue any aspect of our services at any time with reasonable notice.</p>

          <hr className="my-6" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Listing Your Property</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Your Responsibilities</h3>
          <p>When listing your property, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate and truthful information about your property</li>
            <li>Disclose all material defects as required by law</li>
            <li>Update information promptly when circumstances change</li>
            <li>Comply with all applicable fair housing laws and regulations</li>
            <li>Not discriminate based on protected characteristics</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Property Media License</h3>
          <p>You grant Access Realty a non-exclusive, royalty-free license to use photos, videos, and other media you provide for marketing your property. This license terminates when your listing is removed, except for media used in testimonials or marketing materials with your express permission.</p>

          <hr className="my-6" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Disclaimers and Limitation of Liability</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Services Provided &quot;As Is&quot;</h3>
          <p className="uppercase font-semibold">ACCESS REALTY PROVIDES THE PLATFORM AND SERVICES ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>That your property will sell or sell at any particular price or timeframe</li>
            <li>Uninterrupted or error-free service</li>
            <li>Any specific number of showings or buyer interest</li>
            <li>Specific outcomes from using our services</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Limitation of Liability</h3>
          <p className="uppercase font-semibold">TO THE MAXIMUM EXTENT PERMITTED BY LAW, ACCESS REALTY SHALL NOT BE LIABLE FOR:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, revenue, data, or opportunities</li>
            <li>Damages resulting from unauthorized access, errors, or third-party actions</li>
          </ul>
          <p className="mt-4 uppercase font-semibold">OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM, OR $100, WHICHEVER IS GREATER.</p>

          <hr className="my-6" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">13. Real Estate-Specific Terms</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Broker Relationship</h3>
          <p>Access Realty operates as a licensed real estate brokerage. Your relationship with us, including agency duties and obligations, is governed by applicable real estate laws and detailed in your Service Agreement.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Fair Housing</h3>
          <p>You must comply with all federal, state, and local fair housing laws. Discrimination based on race, color, religion, sex, national origin, familial status, or disability is prohibited.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">MLS Compliance</h3>
          <p>By listing with us, you agree to comply with MLS rules and regulations, which are incorporated into your Service Agreement.</p>

          <hr className="my-6" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">17. Contact Information</h2>
          <div className="bg-muted p-6 rounded-lg">
            <p className="font-semibold">Access Realty</p>
            <p>5755 Rufe Snow Dr STE 120</p>
            <p>North Richland Hills, TX 76180</p>
            <p className="mt-2"><strong>Email:</strong> <a href="mailto:info@access.realty" className="text-primary hover:underline">info@access.realty</a></p>
            <p><strong>Website:</strong> <a href="https://access.realty" className="text-primary hover:underline">https://access.realty</a></p>
            <p className="mt-2"><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM CST</p>
          </div>

          <hr className="my-8" />

          <h2 className="text-2xl font-semibold mt-8 mb-4">Acknowledgment</h2>
          <p className="uppercase font-semibold">BY CREATING AN ACCOUNT OR USING OUR SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE.</p>
        </article>
      </Section>

      <AccessCTA
        heading="Have Questions?"
        subheading="Our team is here to help with any questions about our services."
      />
    </>
  );
}
