// ABOUTME: Standardized section wrapper for consistent vertical spacing
// ABOUTME: All variants use py-12 (48px each) = 96px gaps between sections

import { ReactNode } from "react";

type SectionVariant = "content" | "tight" | "cta";
type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "full";
type Background = "default" | "muted" | "card" | "primary" | "secondary";

interface SectionProps {
  children: ReactNode;
  variant?: SectionVariant;
  maxWidth?: MaxWidth;
  background?: Background;
  className?: string;
  borderTop?: boolean;
  id?: string;
}

// GLOBAL SPACING: All sections use py-12 (3rem = 48px each direction)
// This creates consistent 96px gaps between any two sections
const variantStyles: Record<SectionVariant, string> = {
  content: "py-12",
  tight: "py-8",
  cta: "py-12",
};

const maxWidthStyles: Record<MaxWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  full: "max-w-full",
};

const backgroundStyles: Record<Background, string> = {
  default: "", // transparent - inherits from page wrapper
  muted: "bg-muted",
  card: "bg-card",
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
};

export function Section({
  children,
  variant = "content",
  maxWidth = "4xl",
  background = "default",
  className = "",
  borderTop = false,
  id,
}: SectionProps) {
  const sectionClasses = [
    variantStyles[variant],
    backgroundStyles[background],
    borderTop && "border-t border-border",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const containerClasses = [
    "mx-auto px-4 sm:px-6 lg:px-8",
    maxWidthStyles[maxWidth],
  ].join(" ");

  return (
    <section className={sectionClasses} id={id}>
      <div className={containerClasses}>{children}</div>
    </section>
  );
}
