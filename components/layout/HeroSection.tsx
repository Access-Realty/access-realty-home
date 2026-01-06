// ABOUTME: Standardized hero section with flexbox vertical centering
// ABOUTME: Uses min-height and flex to center content after header clearance

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

  // min-h-[280px] = minimum hero height for visual presence
  // pt-20 = header clearance (80px for fixed header)
  // pb-12 = bottom padding for spacing to next section
  // flex items-center = vertically center content in available space
  return (
    <section
      className={`min-h-[280px] pt-20 pb-12 flex items-center ${backgroundStyles[background]} ${className}`}
    >
      <div className={`w-full ${containerClasses}`}>{children}</div>
    </section>
  );
}
