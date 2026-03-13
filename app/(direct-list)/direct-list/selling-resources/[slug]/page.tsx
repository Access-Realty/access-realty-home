// ABOUTME: Individual selling resource page with article-first layout and embedded video
// ABOUTME: Uses generateStaticParams for static generation, notFound() for unknown slugs

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { HeroSection, Section, DirectListCTA } from '@/components/layout';
import { resourcesBySlug, validSlugs, assetUrl } from '../resources';
import { VideoPlayer } from '../components/VideoPlayer';
import { RelatedResources } from '../components/RelatedResources';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = resourcesBySlug[slug];

  if (!resource) {
    return { title: 'Page Not Found | DirectList' };
  }

  const canonicalUrl = `https://direct-list.com/selling-resources/${slug}`;

  return {
    title: `${resource.title} | DirectList Selling Resources`,
    description: resource.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${resource.title} | DirectList Selling Resources`,
      description: resource.description,
      url: canonicalUrl,
      siteName: 'DirectList by Access Realty',
      type: 'article',
      locale: 'en_US',
      ...(resource.video?.posterFileName && {
        images: [assetUrl(resource.video.posterFileName)],
      }),
    },
  };
}

export default async function SellingResourcePage({ params }: PageProps) {
  const { slug } = await params;
  const resource = resourcesBySlug[slug];

  if (!resource) {
    notFound();
  }

  return (
    <>
      <HeroSection maxWidth="3xl">
        <Link
          href="/direct-list/selling-resources"
          className="text-sm text-primary-foreground/60 hover:text-primary-foreground/80 transition-colors mb-3 inline-block"
        >
          &larr; Selling Resources
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-3">
          {resource.title}
        </h1>
        <p className="text-lg text-primary-foreground/80">{resource.description}</p>
      </HeroSection>

      <Section variant="content" maxWidth="3xl">
        <div className="space-y-6">
          {/* Placeholder article content — replace with Descript script content */}
          <p className="text-base text-muted-foreground leading-relaxed">
            {resource.description} This guide walks you through everything you need to know.
          </p>

          {resource.video && (
            <div className="my-8">
              <VideoPlayer
                fileName={resource.video.fileName}
                posterFileName={resource.video.posterFileName}
                title={resource.title}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Watch the full guide ({Math.floor(resource.video.durationSeconds / 60)}:
                {(resource.video.durationSeconds % 60).toString().padStart(2, '0')})
              </p>
            </div>
          )}

          {/* Placeholder for additional article content */}
          <p className="text-base text-muted-foreground leading-relaxed">
            More detailed content will be added from the Descript video scripts.
          </p>
        </div>
      </Section>

      <Section variant="content" maxWidth="5xl">
        <RelatedResources slugs={resource.relatedSlugs} />
      </Section>

      <DirectListCTA />
    </>
  );
}
