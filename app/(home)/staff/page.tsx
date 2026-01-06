// ABOUTME: Staff directory page
// ABOUTME: Lists all Access Realty team members with links to individual pages

import Link from "next/link";
import Image from "next/image";
import { getStaffMembers } from "@/lib/staff";
import { HeroSection, Section, AccessCTA } from "@/components/layout";

// Local avatar fallbacks (DB avatar_url takes precedence)
const staffAvatarFallbacks: Record<string, string> = {
  "justin-brown": "/staff/justin-brown.jpg",
  "cassidy-spilker": "/staff/cassidy-spilker.webp",
};

// Revalidate every hour for fresh data
export const revalidate = 3600;

export default async function Staff() {
  const teamMembers = await getStaffMembers();

  return (
    <>
      <HeroSection maxWidth="4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
          Our Team
        </h1>
        <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
          Meet the dedicated professionals ready to help you achieve your real estate goals.
        </p>
      </HeroSection>

      <Section variant="content" maxWidth="6xl" background="default">
        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member) => {
            const name = member.full_name || `${member.first_name} ${member.last_name}`;
            const shortBio = member.bio[0]?.slice(0, 120) + (member.bio[0]?.length > 120 ? "..." : "");
            const avatarUrl = member.avatar_url || staffAvatarFallbacks[member.slug];

            return (
              <Link
                key={member.slug}
                href={`/staff/${member.slug}`}
                className="group bg-card border-2 border-border rounded-xl p-8 text-center hover:border-secondary hover:shadow-xl transition-all"
              >
                {/* Avatar with image or initials fallback */}
                {avatarUrl ? (
                  <div className="h-32 w-32 rounded-full border-4 border-secondary mx-auto mb-6 overflow-hidden group-hover:scale-105 transition-transform">
                    <Image
                      src={avatarUrl}
                      alt={name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="h-32 w-32 rounded-full border-4 border-secondary bg-primary mx-auto mb-6 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="text-primary-foreground text-3xl font-bold">
                      {member.initials}
                    </span>
                  </div>
                )}

                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {name}
                </h2>
                <p className="text-secondary font-semibold mb-4">
                  {member.role || "Realtor®"}
                </p>
                <p className="text-muted-foreground text-sm">
                  {shortBio}
                </p>

                <span className="inline-block mt-6 text-primary font-semibold group-hover:text-secondary transition-colors">
                  View Profile →
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      <AccessCTA
        heading="Ready to Work With Our Team?"
        subheading="Whether you're buying, selling, or exploring your options, we're here to help."
      />
    </>
  );
}
