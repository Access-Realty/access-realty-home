// ABOUTME: Contact Us page with inquiry form
// ABOUTME: Captures first name, last name, email, and inquiry message

"use client";

import { useState } from "react";
import { HiPaperAirplane, HiCheckCircle, HiExclamationCircle } from "react-icons/hi2";
import { HeroSection, Section, AccessCTA } from "@/components/layout";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    inquiry: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setStatus("success");
      setFormData({ firstName: "", lastName: "", email: "", inquiry: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <HeroSection maxWidth="2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Contact Us</h1>
        <p className="text-lg text-primary-foreground/80">
          Have a question about selling your home or our services? We&apos;d love to hear from you.
        </p>
      </HeroSection>

      <Section variant="content" maxWidth="2xl">

        {/* Success Message */}
        {status === "success" && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl flex items-start gap-4">
            <HiCheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-800">Message Sent!</h3>
              <p className="text-green-700 mt-1">
                Thank you for reaching out. A member of our team will review your inquiry and get back to you shortly.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {status === "error" && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl flex items-start gap-4">
            <HiExclamationCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Something went wrong</h3>
              <p className="text-red-700 mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-lg p-8 border border-border">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="John"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mt-6">
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="john@example.com"
            />
          </div>

          {/* Inquiry */}
          <div className="mt-6">
            <label htmlFor="inquiry" className="block text-sm font-medium text-foreground mb-2">
              How can we help you?
            </label>
            <textarea
              id="inquiry"
              name="inquiry"
              required
              rows={5}
              value={formData.inquiry}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
              placeholder="Tell us about your question or how we can help..."
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? (
                <>
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <HiPaperAirplane className="h-5 w-5" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </form>

      </Section>

      <AccessCTA
        heading="Prefer to Talk?"
        subheading="Our team is ready to answer your questions and help you explore your options."
        buttonText="Call Us Now"
        buttonHref="tel:+19728207902"
        showPhone
      />
    </>
  );
}
