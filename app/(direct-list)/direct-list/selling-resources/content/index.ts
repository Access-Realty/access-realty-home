// ABOUTME: Maps resource slugs to their article content components
// ABOUTME: Direct imports since pages are statically generated at build time

import type { ComponentType } from 'react';
import PhotographyPrepContent from './photography-prep';
import PricingStrategyContent from './pricing-strategy';
import SellersDisclosureContent from './sellers-disclosure';
import PropertyConveyanceContent from './property-conveyance';
import AccessAndShowingsContent from './access-and-showings';
import ShowingsWithPetsContent from './showings-with-pets';
import CapitalGainsContent from './capital-gains';

const contentMap: Record<string, ComponentType> = {
  'photography-prep': PhotographyPrepContent,
  'pricing-strategy': PricingStrategyContent,
  'sellers-disclosure': SellersDisclosureContent,
  'property-conveyance': PropertyConveyanceContent,
  'access-and-showings': AccessAndShowingsContent,
  'showings-with-pets': ShowingsWithPetsContent,
  'capital-gains': CapitalGainsContent,
};

export function getContentComponent(slug: string): ComponentType | null {
  return contentMap[slug] || null;
}
