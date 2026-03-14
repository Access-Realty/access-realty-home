// ABOUTME: Article content for square footage selling resource page
// ABOUTME: Adapted from Descript video script

export default function SquareFootageContent() {
  return (
    <>
      <p className="text-foreground leading-relaxed">
        Square footage is one of the first things buyers look at when evaluating a home, and one of
        the most common sources of confusion in real estate. What counts? What does not? And where
        does that number on the listing actually come from? Understanding the rules helps you market
        your home accurately and avoid problems down the road.
      </p>

      <p className="text-foreground leading-relaxed mt-4">
        The most important thing to know upfront: always disclose your source. Whether the square
        footage comes from the appraisal district, a previous appraisal, or a professional
        measurement, buyers and agents need to know where the number originated.
      </p>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">What Counts as Square Footage in Texas</h2>
      <p className="text-foreground leading-relaxed mb-3">
        In Texas, square footage includes interior finished living areas that are heated and cooled
        as part of the main living space. Specifically, these areas count:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-foreground">
        <li>Bedrooms, bathrooms, and living areas</li>
        <li>Closets and entryways</li>
        <li>Utility rooms and laundry rooms</li>
        <li>Enclosed patios — but only if they are heated and cooled</li>
        <li>Finished attic space — if it conforms to standard ceiling height and access requirements</li>
      </ul>
      <p className="text-foreground leading-relaxed mt-3">
        The common thread is that the space must be enclosed, finished, and part of the home&apos;s
        climate-controlled living area.
      </p>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">What Does Not Count</h2>
      <p className="text-foreground leading-relaxed mb-3">
        Several areas that might feel like living space are not included in the official square
        footage number:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-foreground">
        <li>Garages — unless they have been properly converted to living space with permits, HVAC,
          and finished surfaces</li>
        <li>Screened patios and covered porches — even if they feel like part of the home</li>
        <li>Unfinished areas — basements, attics, or storage spaces without finished walls and
          climate control</li>
        <li>Open spaces above vaulted rooms — the air space above a two-story living room does not
          add to the total</li>
        <li>Detached buildings — guest houses, workshops, or casitas are measured separately and
          not included in the main home&apos;s square footage</li>
      </ul>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">Garage Conversions: A Common Question</h2>
      <p className="text-foreground leading-relaxed">
        A garage that has been converted to living space is a frequent gray area. For the converted
        space to count toward square footage, the conversion typically needs to include proper
        permitting, finished walls and flooring, and integration into the home&apos;s HVAC system.
        A garage with a window unit and some carpet does not qualify. If you have converted a garage,
        be prepared to explain the scope of the conversion and whether permits were pulled.
      </p>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">Why Accuracy Matters</h2>
      <p className="text-foreground leading-relaxed">
        Overstating square footage can create real problems. Buyers who feel misled may walk away
        from a deal. Appraisers will measure the home independently, and if the listing square
        footage does not match the appraisal, it raises questions and can complicate financing.
        Understating is less common but can also work against you by making the home appear less
        competitive in the market.
      </p>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">Where the Number Comes From</h2>
      <p className="text-foreground leading-relaxed">
        Square footage numbers typically come from one of three sources: the county appraisal
        district records, a previous appraisal report, or a professional measurement service.
        Appraisal district records are widely available but not always accurate — they may not
        reflect additions or renovations. A professional measurement gives you the most reliable
        number and is worth considering if there is any question about accuracy.
      </p>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">Bottom Line</h2>
      <p className="text-foreground leading-relaxed">
        Know what counts, know what does not, and always disclose where your number comes from.
        Accurate square footage builds buyer trust and keeps the transaction on track. If you are
        unsure about any area of your home, ask — it is better to clarify upfront than to deal with
        questions during the appraisal or inspection.
      </p>
    </>
  );
}
