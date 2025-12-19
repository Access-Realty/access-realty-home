// ABOUTME: Final call-to-action section encouraging users to get started
// ABOUTME: Large CTA button to drive conversions

const FinalCTA = () => {
  return (
    <section className="py-16 md:py-24" id="contact">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Let&apos;s Build Your Perfect Selling Plan
          </h2>

          <p className="text-lg md:text-xl text-foreground">
            Ready to explore your options? Fill out our quick assessment form
            and get a custom selling strategy tailored to your needs.
          </p>

          <a
            href="https://app.access.realty/signup?source=home-cta"
            className="inline-block h-16 px-12 text-lg bg-secondary hover:bg-secondary-light text-primary font-bold shadow-xl hover:shadow-2xl transition-all rounded-md leading-[4rem]"
          >
            Get My Custom Selling Plan
          </a>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
