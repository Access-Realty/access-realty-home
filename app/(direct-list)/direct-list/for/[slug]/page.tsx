// ABOUTME: Dynamic route for persona landing pages
// ABOUTME: Loads persona config by slug, renders shared PersonaLandingPage component

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { personaConfigs, validSlugs } from "@/data/personas";
import { PersonaLandingPage } from "@/components/landing/PersonaLandingPage";

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

  return {
    title: config.meta.title,
    description: config.meta.description,
    openGraph: {
      title: config.meta.title,
      description: config.meta.description,
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

  return <PersonaLandingPage config={config} />;
}
