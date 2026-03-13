// ABOUTME: "You might also find helpful" section for individual resource pages
// ABOUTME: Renders 3 related ResourceCards based on hand-curated relatedSlugs

'use client';

import { useBrandPath } from '@/lib/BrandProvider';
import { resourcesBySlug } from '../resources';
import { ResourceCard } from './ResourceCard';

interface RelatedResourcesProps {
  slugs: string[];
}

export function RelatedResources({ slugs }: RelatedResourcesProps) {
  const bp = useBrandPath();

  const resources = slugs
    .map((slug) => resourcesBySlug[slug])
    .filter(Boolean);

  if (resources.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-primary mb-6 text-center">
        You Might Also Find Helpful
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.slug}
            resource={resource}
            href={bp(`/direct-list/selling-resources/${resource.slug}`)}
          />
        ))}
      </div>
    </div>
  );
}
