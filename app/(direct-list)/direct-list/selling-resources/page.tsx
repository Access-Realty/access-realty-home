// ABOUTME: Hub page listing all selling resources in a flat card grid
// ABOUTME: Entry point linked from DirectListFooter navigation

import { Metadata } from 'next';
import { HeroSection, Section, DirectListCTA } from '@/components/layout';
import { ResourceGrid } from './components/ResourceGrid';

export const metadata: Metadata = {
  title: 'Selling Resources | DirectList',
  description:
    'Expert guides and videos to help you navigate every step of selling your home with confidence.',
};

export default function SellingResourcesPage() {
  return (
    <>
      <HeroSection maxWidth="4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          Selling Resources
        </h1>
        <p className="text-lg text-primary-foreground/80">
          Expert guides and videos to help you sell with confidence.
        </p>
      </HeroSection>

      <Section variant="content" maxWidth="5xl">
        <ResourceGrid />
      </Section>

      <DirectListCTA />
    </>
  );
}
