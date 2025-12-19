// ABOUTME: Testimonials section showing customer success stories
// ABOUTME: Displays avatars with brief success highlights

const testimonials = [
  {
    name: "Charles",
    text: "Charles saved $12,255 on his listing",
    initials: "CS",
  },
  {
    name: "The Kasingers",
    text: "The Kasinger's closed in 2 weeks",
    initials: "TK",
  },
  {
    name: "Katie",
    text: "Katie Sold for the Most",
    initials: "KS",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="h-24 w-24 rounded-full border-4 border-card shadow-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-2xl font-bold">
                  {testimonial.initials}
                </span>
              </div>
              <p className="text-center text-foreground font-semibold max-w-xs">
                {testimonial.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
