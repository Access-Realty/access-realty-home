// ABOUTME: Client component for the selling resources hub page card grid
// ABOUTME: Uses useBrandPath to generate correct links on both access.realty and direct-list.com

'use client';

import { useBrandPath } from '@/lib/BrandProvider';
import { SELLING_RESOURCES } from '../resources';
import { ResourceCard } from './ResourceCard';

export function ResourceGrid() {
  const bp = useBrandPath();

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SELLING_RESOURCES.map((resource) => (
        <ResourceCard
          key={resource.slug}
          resource={resource}
          href={bp(`/direct-list/selling-resources/${resource.slug}`)}
        />
      ))}
    </div>
  );
}
