// ABOUTME: Standardized hero section with fixed header clearance
// ABOUTME: pb-12 matches Section py-12 for consistent gaps

import { ReactNode } from "react";

type MaxWidth = "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
type Background = "primary" | "gradient";

interface HeroSectionProps {
  children: ReactNode;
  maxWidth?: MaxWidth;
  background?: Background;
  className?: string;
  centered?: boolean;
}

const maxWidthStyles: Record<MaxWidth, string> = {
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
};

const backgroundStyles: Record<Background, string> = {
  primary: "bg-primary",
  gradient: "bg-gradient-to-br from-primary to-primary-dark",
};

export function HeroSection({
  children,
  maxWidth = "4xl",
  background = "primary",
  className = "",
  centered = true,
}: HeroSectionProps) {
  const containerClasses = [
    "mx-auto px-4 sm:px-6 lg:px-8",
    maxWidthStyles[maxWidth],
    centered && "text-center",
  ]
    .filter(Boolean)
    .join(" ");

  // pt-24 (96px) = header clearance (64px) + 32px visible space above content
  // pb-12 (48px) = matches Section's py-12 for consistent gaps
  return (
    <section
      className={`pt-24 pb-12 ${backgroundStyles[background]} ${className}`}
    >
      <div className={`w-full ${containerClasses}`}>{children}</div>
    </section>
  );
}
