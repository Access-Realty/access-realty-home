// ABOUTME: Article content for property conveyance selling resource page
// ABOUTME: Adapted from Descript video script — what stays and what goes

export default function PropertyConveyanceContent() {
  return (
    <>
      <p className="text-foreground leading-relaxed">
        One of the most common questions sellers have is: what stays with the house and what do I
        get to take? It sounds simple, but this is an area where misunderstandings happen all the
        time — and those misunderstandings can delay closings or create conflict with buyers.
      </p>

      <p className="text-foreground leading-relaxed mt-4">
        There is a simple rule of thumb, and once you understand it, most of the gray areas
        become clear.
      </p>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">The Upside-Down House Test</h2>
      <p className="text-foreground leading-relaxed">
        Imagine picking up your house and turning it completely upside down. Everything that falls
        out — furniture, rugs, lamps, decorations — that is your personal property. You take it
        with you. Everything that stays attached to the house — light fixtures, ceiling fans,
        built-in shelving, curtain rods — that conveys with the property and stays for the buyer.
      </p>
      <p className="text-foreground leading-relaxed mt-3">
        If it is screwed in, bolted down, wired in, or permanently attached, it generally stays.
        If you can pick it up and carry it out, it generally goes with you.
      </p>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">What Typically Stays</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground">
        <li>Light fixtures, ceiling fans, and chandeliers</li>
        <li>Built-in appliances (dishwasher, range/oven, microwave if mounted)</li>
        <li>Window blinds, shutters, and curtain rods</li>
        <li>Garage door openers and remotes</li>
        <li>Smoke detectors, doorbells, and security systems</li>
        <li>Landscaping, trees, and irrigation systems</li>
        <li>Mounted TV brackets (but not the TV itself)</li>
        <li>Built-in shelving and cabinetry</li>
      </ul>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">What Typically Goes</h2>
      <ul className="list-disc pl-6 space-y-2 text-foreground">
        <li>Furniture, rugs, and decorations</li>
        <li>Freestanding appliances (washer, dryer — unless agreed otherwise)</li>
        <li>Personal electronics (TVs, sound systems, gaming consoles)</li>
        <li>Potted plants and movable planters</li>
        <li>Curtains and drapes (rods stay, fabric goes — though this varies)</li>
      </ul>

      <div className="my-6 p-4 bg-background rounded-lg border border-secondary/30">
        <p className="text-foreground leading-relaxed text-sm">
          Want a visual breakdown?{' '}
          <a href="https://hvbicnpvactgxzprnygc.supabase.co/storage/v1/object/public/public-assets/whats-included-in-sale.png"
            target="_blank" rel="noopener noreferrer"
            className="text-secondary hover:text-secondary/80 underline font-medium">
            View the What&apos;s Included in a Home Sale guide &rarr;
          </a>
        </p>
      </div>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">The Refrigerator Question</h2>
      <p className="text-foreground leading-relaxed">
        This one comes up constantly. A refrigerator is technically a freestanding appliance — it
        plugs in and can be moved. In most Texas real estate contracts, the refrigerator does not
        automatically convey unless it is specifically included in the agreement. If you want to
        keep it or the buyer expects it to stay, make sure it is addressed in writing.
      </p>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">Sentimental Items</h2>
      <p className="text-foreground leading-relaxed">
        If there is a fixture you are attached to — a special chandelier, a custom mirror, a
        family heirloom that happens to be mounted on the wall — take it down before you list.
        Replace it with something generic. If a buyer never sees it, they will never ask for it.
        If they see it in listing photos and then it disappears at closing, you have a problem.
      </p>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">The MLS Is Not a Contract</h2>
      <p className="text-foreground leading-relaxed">
        The MLS listing might note that certain items convey, but the MLS description is not the
        contract. What actually conveys is determined by the purchase agreement — the written
        contract between you and the buyer. If something is important to either side, it needs
        to be spelled out in the contract. Verbal agreements and MLS notes are not enforceable
        the same way.
      </p>

      <h2 className="text-xl font-bold text-primary mt-8 mb-3">The Takeaway</h2>
      <p className="text-foreground leading-relaxed">
        The upside-down house test handles most situations. For anything that falls in a gray
        area, the answer is simple: put it in writing. If you want to keep something that is
        attached, disclose it early. If you want to include something extra as a sweetener for
        the buyer, add it to the contract. Clear communication up front prevents surprises at
        closing.
      </p>
    </>
  );
}
