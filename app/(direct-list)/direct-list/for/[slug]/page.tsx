// ABOUTME: Dynamic route for persona landing pages
// ABOUTME: Loads persona config by slug, renders shared PersonaLandingPage component

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { personaConfigs, validSlugs } from "@/data/personas";
import { PersonaLandingPage } from "@/components/landing/PersonaLandingPage";
import { PersonaSchema } from "@/components/landing/PersonaSchema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = personaConfigs[slug];

  if (!config) {
    return { title: "Page Not Found | Access Realty" };
  }

  const canonicalUrl = `https://direct-list.com/for/${slug}`;

  return {
    title: config.meta.title,
    description: config.meta.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: config.meta.title,
      description: config.meta.description,
      url: canonicalUrl,
      siteName: "DirectList by Access Realty",
      type: "website",
      locale: "en_US",
      ...(config.meta.ogImage && { images: [config.meta.ogImage] }),
    },
  };
}

export default async function PersonaPage({ params }: PageProps) {
  const { slug } = await params;
  const config = personaConfigs[slug];

  if (!config) {
    notFound();
  }

  return (
    <>
      <PersonaSchema config={config} />
      <PersonaLandingPage config={config} />
    </>
  );
}
