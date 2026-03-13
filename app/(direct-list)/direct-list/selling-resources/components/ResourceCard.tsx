// ABOUTME: Card component for selling resource hub grid and related resources section
// ABOUTME: Displays poster thumbnail, title, description, and video/written badge

import Image from 'next/image';
import Link from 'next/link';
import { assetUrl, formatDuration } from '../resources';
import type { SellingResource } from '../resources';

interface ResourceCardProps {
  resource: SellingResource;
  href: string;
}

export function ResourceCard({ resource, href }: ResourceCardProps) {
  const hasVideo = !!resource.video;

  return (
    <Link
      href={href}
      className="block rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Thumbnail area */}
      {resource.video?.posterFileName ? (
        <div className="relative aspect-video bg-primary/5">
          <Image
            src={assetUrl(resource.video.posterFileName)}
            alt={resource.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 340px"
          />
        </div>
      ) : (
        <div className="aspect-video bg-primary/10 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-primary/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-bold text-primary mb-1">{resource.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {resource.description}
        </p>
        <span className="text-xs font-medium text-secondary">
          {hasVideo
            ? `Video ${formatDuration(resource.video!.durationSeconds)} + Guide`
            : 'Written Guide'}
        </span>
      </div>
    </Link>
  );
}
