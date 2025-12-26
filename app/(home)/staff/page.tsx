// ABOUTME: Staff directory page
// ABOUTME: Lists all Access Realty team members with links to individual pages

import Link from "next/link";

const teamMembers = [
  {
    name: "Justin Brown",
    slug: "justin-brown",
    title: "Broker Associate",
    initials: "JB",
    shortBio: "Full-time Realtor® serving the Dallas–Fort Worth Metroplex with years of local expertise and a client-first approach.",
  },
  {
    name: "Cassidy Spilker",
    slug: "cassidy-spilker",
    title: "Realtor®",
    initials: "CS",
    shortBio: "Dedicated to helping clients navigate the home buying journey with confidence and care.",
  },
  {
    name: "Jennifer Lovett",
    slug: "jennifer-lovett",
    title: "Realtor®",
    initials: "JL",
    shortBio: "Committed to providing exceptional service and guidance throughout your real estate journey.",
  },
];

export default function Staff() {
  return (
    <div className="pt-24 pb-16 bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Team</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the dedicated professionals ready to help you achieve your real estate goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Link
              key={member.slug}
              href={`/staff/${member.slug}`}
              className="group bg-card border-2 border-border rounded-xl p-8 text-center hover:border-secondary hover:shadow-xl transition-all"
            >
              {/* Placeholder avatar with initials */}
              <div className="h-32 w-32 rounded-full border-4 border-secondary bg-primary mx-auto mb-6 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-primary-foreground text-3xl font-bold">
                  {member.initials}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-1">
                {member.name}
              </h2>
              <p className="text-secondary font-semibold mb-4">
                {member.title}
              </p>
              <p className="text-muted-foreground text-sm">
                {member.shortBio}
              </p>

              <span className="inline-block mt-6 text-primary font-semibold group-hover:text-secondary transition-colors">
                View Profile →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
