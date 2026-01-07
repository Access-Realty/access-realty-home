// ABOUTME: Homepage for Access Realty marketing site
// ABOUTME: Serves as the main landing page with hero, testimonials, and CTAs

import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import FlipCards from "@/components/FlipCards";
import Benefits from "@/components/Benefits";
import FinalCTA from "@/components/FinalCTA";
import ListingsCarousel from "@/components/listings/ListingsCarousel";
import { Section } from "@/components/layout";

// Revalidate listings every hour
export const revalidate = 3600;

export default function Home() {
  return (
    <div className="bg-background">
      <Hero />
      <Section maxWidth="6xl">
        <Testimonials />
      </Section>
      <Section maxWidth="6xl" id="solutions">
        <FlipCards />
      </Section>
      <Section maxWidth="6xl" className="overflow-hidden">
        <ListingsCarousel
          title="Our Current Listings"
          subtitle="Browse homes represented by Access Realty"
          centerTitle
        />
      </Section>
      <Section maxWidth="4xl" id="how-it-works">
        <Benefits />
      </Section>
      <Section maxWidth="4xl" id="contact">
        <FinalCTA />
      </Section>
    </div>
  );
}
