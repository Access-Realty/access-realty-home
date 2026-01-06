// ABOUTME: Individual staff member profile page
// ABOUTME: Displays agent bio, services, contact info, and current listings

import { notFound } from "next/navigation";
import Image from "next/image";
import { HiOutlineHomeModern, HiArrowTrendingUp, HiMapPin, HiBuildingOffice2, HiCalendarDays } from "react-icons/hi2";
import ListingsCarousel from "@/components/listings/ListingsCarousel";
import ClosedDealsSection from "@/components/listings/ClosedDealsSection";
import ContactSection from "@/components/staff/ContactSection";
import { getStaffBySlug, getStaffSlugs } from "@/lib/staff";
import { Section } from "@/components/layout";

// Local avatar fallbacks (DB avatar_url takes precedence)
const staffAvatarFallbacks: Record<string, string> = {
  "justin-brown": "/staff/justin-brown.jpg",
  "cassidy-spilker": "/staff/cassidy-spilker.webp",
};

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home: HiOutlineHomeModern,
  TrendingUp: HiArrowTrendingUp,
  MapPin: HiMapPin,
  Building: HiBuildingOffice2,
};

// Revalidate every hour for fresh data
export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getStaffSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const staff = await getStaffBySlug(slug);

  if (!staff) {
    return { title: "Team Member | Access Realty" };
  }

  const name = staff.full_name || `${staff.first_name} ${staff.last_name}`;
  return {
    title: `${name} - ${staff.role || "Realtor"} | Access Realty`,
    description: staff.bio[0]?.slice(0, 160),
  };
}

export default async function StaffMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const staff = await getStaffBySlug(slug);

  if (!staff) {
    notFound();
  }

  const name = staff.full_name || `${staff.first_name} ${staff.last_name}`;
  const title = staff.role || "Realtor®";
  const phone = staff.phone || "9728207902";
  const formattedPhone = formatPhone(phone);
  const telPhone = phone.replace(/\D/g, "");
  const avatarUrl = staff.avatar_url || staffAvatarFallbacks[slug];
  const hasCalendly = staff.calendly_phone_url || staff.calendly_remote_url;
  const calendlyUrl = staff.calendly_phone_url || staff.calendly_remote_url;

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <Section variant="content" maxWidth="4xl" background="default" className="pt-24 text-center">
        {/* Avatar */}
        {avatarUrl ? (
          <div className="h-40 w-40 rounded-full border-4 border-secondary mx-auto mb-6 overflow-hidden">
            <Image
              src={avatarUrl}
              alt={name}
              width={160}
              height={160}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        ) : (
          <div className="h-40 w-40 rounded-full border-4 border-secondary bg-primary mx-auto mb-6 flex items-center justify-center">
            <span className="text-primary-foreground text-5xl font-bold">
              {staff.initials}
            </span>
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
          {name}
        </h1>
        <p className="text-xl text-secondary font-semibold mb-6">
          {title}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={`mailto:${staff.email}`}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors"
          >
            Contact Me
          </a>
          <a
            href={`tel:+1${telPhone}`}
            className="border-2 border-primary text-primary px-6 py-3 rounded-md font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {formattedPhone}
          </a>
          {hasCalendly && (
            <a
              href={calendlyUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-primary text-primary px-6 py-3 rounded-md font-semibold hover:bg-primary hover:text-primary-foreground transition-colors inline-flex items-center gap-2"
            >
              <HiCalendarDays className="h-5 w-5" />
              Book Online
            </a>
          )}
        </div>
      </Section>

      {/* Services Section */}
      <Section variant="content" maxWidth="6xl" background="card">
        <div className="grid md:grid-cols-2 gap-6">
          {staff.services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || HiOutlineHomeModern;
            return (
              <div
                key={index}
                className="bg-muted rounded-xl p-8"
              >
                <IconComponent className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* My Story Section */}
      <Section variant="content" maxWidth="4xl" background="default">
        <p className="text-sm font-semibold text-muted-foreground tracking-widest mb-2">
          MY STORY
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
          More Than Just Transactions
        </h2>

        <div className="space-y-6 text-foreground">
          {staff.bio.map((paragraph, index) => (
            <p key={index} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      {/* Current Listings Section */}
      {staff.member_key && (
        <Section variant="content" maxWidth="6xl" background="default" className="overflow-hidden">
          <ListingsCarousel
            title={`${staff.first_name}'s Current Listings`}
            subtitle="Properties I'm currently representing"
            agentKey={staff.member_key}
            limit={8}
            showViewAll={false}
          />
        </Section>
      )}

      {/* Closed Deals Map */}
      {staff.member_key && (
        <ClosedDealsSection
          agentMlsId={staff.member_key}
          agentName={name}
        />
      )}

      {/* Contact Section */}
      <ContactSection
        agentName={staff.first_name}
        phone={staff.phone}
        email={staff.email}
        calendlyPhoneUrl={staff.calendly_phone_url}
        calendlyRemoteUrl={staff.calendly_remote_url}
      />
    </div>
  );
}
