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
import HowToAttachALockboxContent from './how-to-attach-a-lockbox';
import SquareFootageContent from './square-footage';
import T47SurveyContent from './t47-survey';
import LenderDrivenRepairsContent from './lender-driven-repairs';
import AboutLeasebacksContent from './about-leasebacks';
import OpenHousePrepContent from './open-house-prep';

const contentMap: Record<string, ComponentType> = {
  'photography-prep': PhotographyPrepContent,
  'pricing-strategy': PricingStrategyContent,
  'sellers-disclosure': SellersDisclosureContent,
  'property-conveyance': PropertyConveyanceContent,
  'access-and-showings': AccessAndShowingsContent,
  'showings-with-pets': ShowingsWithPetsContent,
  'capital-gains': CapitalGainsContent,
  'how-to-attach-a-lockbox': HowToAttachALockboxContent,
  'square-footage': SquareFootageContent,
  't47-survey': T47SurveyContent,
  'lender-driven-repairs': LenderDrivenRepairsContent,
  'about-leasebacks': AboutLeasebacksContent,
  'open-house-prep': OpenHousePrepContent,
};

export function getContentComponent(slug: string): ComponentType | null {
  return contentMap[slug] || null;
}
