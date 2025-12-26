// ABOUTME: Homepage for Access Realty marketing site
// ABOUTME: Serves as the main landing page with hero, testimonials, and CTAs

import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import FlipCards from "@/components/FlipCards";
import Benefits from "@/components/Benefits";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Testimonials />
      <FlipCards />
      <Benefits />
      <FinalCTA />
    </>
  );
}
