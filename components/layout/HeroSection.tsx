// ABOUTME: Standardized hero section with fixed header clearance
// ABOUTME: pt-20 accounts for fixed header, pb-16 balances vertical spacing

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
  const sectionClasses = [
    "pt-20 pb-16", // Balanced hero spacing: header clearance + visual balance
    backgroundStyles[background],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const containerClasses = [
    "mx-auto px-4 sm:px-6 lg:px-8",
    maxWidthStyles[maxWidth],
    centered && "text-center",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={sectionClasses}>
      <div className={containerClasses}>{children}</div>
    </section>
  );
}
