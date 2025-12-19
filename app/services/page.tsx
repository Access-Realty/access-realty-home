// ABOUTME: Services page with pricing comparison table
// ABOUTME: Displays Direct List, Direct List+, and Full Service tiers

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      {/* TODO: Add header component */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">Choose Your Level of Service</h1>

        {/* TODO: Add pricing table component - see README.md for pricing data */}
        <p className="text-center text-muted-foreground">Page under construction</p>

        {/*
          Three tiers:
          - Direct List: $2,995 ($495 upfront)
          - Direct List +: $4,495 ($995 upfront) - "BEST VALUE" badge
          - Full Service: 3% (No upfront) - "MOST POPULAR" badge

          See README.md for complete feature comparison data
        */}
      </main>

      {/* TODO: Add footer component */}
    </div>
  );
}
