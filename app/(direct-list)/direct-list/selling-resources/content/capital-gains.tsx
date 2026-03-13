// ABOUTME: Article content for capital gains selling resource page
// ABOUTME: Adapted from Descript video script — general info, not tax advice

export default function CapitalGainsContent() {
  return (
    <>
      <p className="text-foreground leading-relaxed">
        If you are selling a home you have owned for less than two years, or if you have not
        used it as your primary residence for at least two of the last five years, capital gains
        tax is something you should be aware of before you close. It does not apply to every
        seller, but if it applies to you, the financial impact can be significant.
      </p>

      <p className="text-foreground leading-relaxed mt-4 italic text-muted-foreground">
        Important: This is general information to help you understand the topic. It is not legal
        or tax advice. Every situation is different, and you should consult a qualified tax
        professional or CPA for guidance specific to your circumstances.
      </p>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">What Are Capital Gains?</h2>
      <p className="text-foreground leading-relaxed">
        Capital gains are the profit you make when you sell an asset for more than you paid for
        it. In real estate, that means the difference between your purchase price (plus qualifying
        improvements and selling costs) and your sale price. If you bought a home for $300,000
        and sell it for $400,000, you have a capital gain of roughly $100,000, minus eligible
        deductions.
      </p>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">The IRS 2-of-5-Year Rule</h2>
      <p className="text-foreground leading-relaxed">
        The IRS offers a significant exclusion on capital gains from the sale of your primary
        residence — up to $250,000 for single filers and $500,000 for married couples filing
        jointly. But to qualify, you must have owned the home and used it as your primary
        residence for at least two of the five years before the sale.
      </p>
      <p className="text-foreground leading-relaxed mt-3">
        The two years do not need to be consecutive. If you lived in the home for 2019 and 2021,
        for example, that would qualify. But if you have owned the home for less than two years
        total, or if it was an investment property or second home for most of that time, you
        likely will not qualify for the full exclusion.
      </p>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">Short-Term vs. Long-Term Rates</h2>
      <p className="text-foreground leading-relaxed">
        How long you have owned the property also affects the tax rate on any gains that are not
        excluded:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-foreground mt-3">
        <li>
          <span className="font-medium">Short-term capital gains</span> (owned less than one year) —
          taxed as ordinary income, which means your regular income tax rate applies. Depending on
          your tax bracket, this could be 22%, 32%, or higher.
        </li>
        <li>
          <span className="font-medium">Long-term capital gains</span> (owned one year or more) —
          taxed at preferential rates, typically 0%, 15%, or 20% depending on your income level.
          This is a meaningful difference.
        </li>
      </ul>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">Texas and State Income Tax</h2>
      <p className="text-foreground leading-relaxed">
        One piece of good news if you are selling in Texas: there is no state income tax. That
        means capital gains are only subject to federal tax. In states with income tax, sellers
        can face both federal and state capital gains taxes, so this is a genuine advantage of
        selling in Texas.
      </p>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">Partial Exclusions</h2>
      <p className="text-foreground leading-relaxed">
        Even if you do not meet the full 2-of-5-year requirement, you may qualify for a partial
        exclusion if the sale is due to certain circumstances, such as:
      </p>
      <ul className="list-disc pl-6 space-y-2 text-foreground mt-3">
        <li>A job relocation (typically 50+ miles)</li>
        <li>Health-related reasons</li>
        <li>Certain unforeseen circumstances (divorce, natural disaster, etc.)</li>
      </ul>
      <p className="text-foreground leading-relaxed mt-3">
        The partial exclusion is calculated based on the percentage of the two-year requirement
        you met. For example, if you lived in the home for one year (50% of the requirement),
        you may be able to exclude 50% of the maximum amount.
      </p>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">The Takeaway</h2>
      <p className="text-foreground leading-relaxed">
        If you have owned and lived in your home for at least two of the last five years, you
        are likely in good shape — the exclusion amounts are generous. If you have not, it is
        worth talking to a tax professional before you sell so you know exactly what to expect
        and can plan accordingly. This is not something you want to discover after closing.
      </p>
    </>
  );
}
