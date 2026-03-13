// ABOUTME: Metadata registry for all selling resource pages
// ABOUTME: Defines resource entries, slugs, video info, and helper functions

const SUPABASE_ASSETS_BASE =
  'https://hvbicnpvactgxzprnygc.supabase.co/storage/v1/object/public/public-assets';

export interface SellingResource {
  slug: string;
  title: string;
  description: string;
  video?: {
    fileName: string;
    posterFileName?: string;
    durationSeconds: number;
  };
  relatedSlugs: string[];
}

export const SELLING_RESOURCES: SellingResource[] = [
  {
    slug: 'access-and-showings',
    title: 'Access and Showings Guide',
    description: 'Learn about property access options and showing scheduling for your listing.',
    video: { fileName: 'access-and-showings.mp4', posterFileName: 'access-and-showings.webp', durationSeconds: 85 },
    relatedSlugs: ['showings-with-pets', 'how-to-attach-a-lockbox', 'photography-prep'],
  },
  {
    slug: 'photography-prep',
    title: 'Photography Preparation Guide',
    description: 'Essential tips for preparing your property for professional photography and virtual staging.',
    video: { fileName: 'photography-prep.mp4', posterFileName: 'photography-prep.webp', durationSeconds: 175 },
    relatedSlugs: ['square-footage', 'property-conveyance', 'pricing-strategy'],
  },
  {
    slug: 'pricing-strategy',
    title: 'Pricing Strategy Guide',
    description: 'Understanding market pricing, competitive analysis, and strategic list price decisions.',
    video: { fileName: 'pricing-strategy.mp4', posterFileName: 'pricing-strategy.webp', durationSeconds: 67 },
    relatedSlugs: ['capital-gains', 'lender-driven-repairs', 'photography-prep'],
  },
  {
    slug: 'sellers-disclosure',
    title: "Seller's Disclosure Guide",
    description: 'Texas real estate disclosure requirements and seller obligations for transparency.',
    video: { fileName: 'sellers-disclosure.mp4', posterFileName: 'sellers-disclosure.webp', durationSeconds: 126 },
    relatedSlugs: ['t47-survey', 'property-conveyance', 'lender-driven-repairs'],
  },
  {
    slug: 'showings-with-pets',
    title: 'Showings with Pets Guide',
    description: 'Best practices for managing pets during property showings and buyer visits.',
    video: { fileName: 'showings-with-pets.mp4', posterFileName: 'showings-with-pets.webp', durationSeconds: 112 },
    relatedSlugs: ['access-and-showings', 'photography-prep', 'how-to-attach-a-lockbox'],
  },
  {
    slug: 'property-conveyance',
    title: "What's Included in a Home Sale",
    description: 'Learn what items typically stay with the property when you sell.',
    video: { fileName: 'property-conveyance.mp4', posterFileName: 'property-conveyance.webp', durationSeconds: 126 },
    relatedSlugs: ['sellers-disclosure', 'square-footage', 't47-survey'],
  },
  {
    slug: 'square-footage',
    title: 'What Counts as Square Footage',
    description: "Learn what areas can and cannot be included when calculating your property's square footage.",
    video: { fileName: 'allowable-square-footage.mp4', posterFileName: 'allowable-square-footage.webp', durationSeconds: 122 },
    relatedSlugs: ['photography-prep', 'property-conveyance', 'pricing-strategy'],
  },
  {
    slug: 't47-survey',
    title: 'Understanding Your T-47 Survey',
    description: 'Learn about your property survey and why it matters for your home sale.',
    video: { fileName: 'understanding-t47.mp4', posterFileName: 'understanding-t47.webp', durationSeconds: 97 },
    relatedSlugs: ['sellers-disclosure', 'property-conveyance', 'square-footage'],
  },
  {
    slug: 'capital-gains',
    title: 'About Capital Gains',
    description: 'Important information about potential capital gains tax implications when selling your property.',
    video: { fileName: 'about-capital-gains.mp4', posterFileName: 'about-capital-gains.webp', durationSeconds: 69 },
    relatedSlugs: ['pricing-strategy', 'lender-driven-repairs', 'sellers-disclosure'],
  },
  {
    slug: 'lender-driven-repairs',
    title: 'Lender-Driven Repairs Guide',
    description: "Understanding your obligations for repairs required by a buyer's lender for loan approval.",
    video: { fileName: 'lender-driven-repairs.mp4', posterFileName: 'lender-driven-repairs.webp', durationSeconds: 90 },
    relatedSlugs: ['pricing-strategy', 'capital-gains', 'sellers-disclosure'],
  },
  {
    slug: 'how-to-attach-a-lockbox',
    title: 'How to Attach a Lockbox',
    description: 'Step-by-step guide to installing your lockbox for secure property access during showings.',
    video: { fileName: 'lockbox-installation.mp4', posterFileName: 'lockbox-installation.webp', durationSeconds: 53 },
    relatedSlugs: ['access-and-showings', 'showings-with-pets', 'photography-prep'],
  },
  {
    slug: 'about-leasebacks',
    title: 'About Leasebacks',
    description: "Understanding seller's temporary leases and what to consider before requesting a leaseback.",
    video: { fileName: 'about-leasebacks.mp4', posterFileName: 'about-leasebacks.webp', durationSeconds: 81 },
    relatedSlugs: ['sellers-disclosure', 'pricing-strategy', 'property-conveyance'],
  },
  {
    slug: 'open-house-prep',
    title: 'How to Prepare for an Open House',
    description: 'Everything you need to do before your open house to make a great impression on buyers.',
    video: { fileName: 'open-house-prep.mp4', posterFileName: 'open-house-prep.webp', durationSeconds: 120 },
    relatedSlugs: ['photography-prep', 'showings-with-pets', 'access-and-showings'],
  },
];

/** Map of slug -> resource for quick lookups */
export const resourcesBySlug: Record<string, SellingResource> = Object.fromEntries(
  SELLING_RESOURCES.map((r) => [r.slug, r])
);

/** All valid slugs for generateStaticParams */
export const validSlugs = SELLING_RESOURCES.map((r) => r.slug);

/** Build full Supabase URL for a video or poster file */
export function assetUrl(fileName: string): string {
  return `${SUPABASE_ASSETS_BASE}/${fileName}`;
}

/** Format seconds as "M:SS" */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
