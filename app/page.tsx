// ABOUTME: Homepage for Access Realty marketing site
// ABOUTME: Serves as the main landing page with hero, testimonials, and CTAs

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import FlipCards from "@/components/FlipCards";
import Benefits from "@/components/Benefits";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Testimonials />
      <FlipCards />
      <Benefits />
      <FinalCTA />
      <Footer />
    </div>
  );
}
