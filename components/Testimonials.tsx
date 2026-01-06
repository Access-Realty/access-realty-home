// ABOUTME: Testimonials content showing customer success stories
// ABOUTME: Content-only component - wrap with Section at page level for spacing

import Image from "next/image";

const testimonials = [
  {
    name: "Charles",
    text: "Charles saved $12,255 on his listing",
    image: "/testimonials/large-charles-avatar.jpg",
  },
  {
    name: "The Kasingers",
    text: "The Kasinger's closed in 2 weeks",
    image: "/testimonials/large-kasingers-avatar.jpg",
  },
  {
    name: "Katie",
    text: "Katie Sold for the Most",
    image: "/testimonials/large-katie-avatar.jpg",
  },
];

const Testimonials = () => {
  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-12">
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-4 animate-fade-in"
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <div className="h-24 w-24 rounded-full border-4 border-secondary shadow-lg overflow-hidden">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>
          <p className="text-center text-foreground font-semibold max-w-xs">
            {testimonial.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Testimonials;
