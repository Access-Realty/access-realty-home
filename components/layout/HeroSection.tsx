// ABOUTME: Standardized hero section with fixed header clearance
// ABOUTME: Uses flexbox centering for equal space above/below content

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

  // pt-16 clears the fixed header (~64px)
  // min-h-[200px] ensures consistent hero height
  // flex + items-center vertically centers content with equal space above/below
  return (
    <section
      className={`pt-16 min-h-[200px] flex items-center ${backgroundStyles[background]} ${className}`}
    >
      <div className={`w-full py-6 ${containerClasses}`}>{children}</div>
    </section>
  );
}
