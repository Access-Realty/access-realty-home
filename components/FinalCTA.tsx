// ABOUTME: Final call-to-action content encouraging users to get started
// ABOUTME: Content-only component - wrap with Section at page level for spacing

import Link from "next/link";

const FinalCTA = () => {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
        Let&apos;s Build Your Perfect Selling Plan
      </h2>

      <p className="text-lg md:text-xl text-muted-foreground">
        Ready to explore your options? Answer 5 quick questions
        and get a custom selling strategy tailored to your needs.
      </p>

      <Link
        href="/selling-plan"
        className="inline-block h-16 px-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-xl hover:shadow-2xl transition-all rounded-md leading-[4rem]"
      >
        Get My Custom Selling Plan
      </Link>
    </div>
  );
};

export default FinalCTA;
