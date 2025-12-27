// ABOUTME: Individual staff member profile page
// ABOUTME: Displays agent bio, services, contact info, and current listings

import { notFound } from "next/navigation";
import { HiOutlineHomeModern, HiArrowTrendingUp, HiMapPin, HiBuildingOffice2 } from "react-icons/hi2";
import CalendlyButton from "@/components/CalendlyButton";
import ListingsCarousel from "@/components/listings/ListingsCarousel";
import ClosedDealsSection from "@/components/listings/ClosedDealsSection";

// Staff data - will be replaced with Supabase data later
const staffData: Record<string, {
  name: string;
  title: string;
  initials: string;
  email: string;
  phone: string;
  calendlyUrl?: string;
  listAgentKey?: string; // MLS agent key for listings lookup
  bio: string[];
  services: { icon: string; title: string; description: string }[];
}> = {
  "justin-brown": {
    name: "Justin Brown",
    title: "Broker Associate",
    initials: "JB",
    email: "JB@access.realty",
    phone: "(972) 820-7902",
    calendlyUrl: "calendly.com/jb-access/phone-call",
    listAgentKey: "0549418",
    bio: [
      "I'm a full-time Realtor® and Broker Associate serving the Dallas–Fort Worth Metroplex, dedicated to helping clients navigate the buying and selling process with clarity, confidence, and ease. With years of local expertise, strong negotiation skills, and a client-first approach, I guide every step of the journey through clear communication and genuine care.",
      "To me, real estate is about more than contracts and closings—it's about people, families, and meaningful life moments. Many of my clients remain part of my life long after the transaction ends, becoming friends I genuinely value. Whether you're a first-time buyer, a seasoned investor, or selling to maximize value, I treat your goals as if they were my own and work tirelessly to protect your best interests.",
      "I was born and raised in the Mid-Cities area of DFW and graduated from Birdville High School before earning my degree from Johnson & Wales University in Denver, Colorado. My early career in the culinary and catering industry, followed by several years in management within the rental car industry, shaped my ability to lead, communicate effectively, manage complex details, and stay solution-focused—skills that translate directly into serving my real estate clients well. Most importantly, these roles allowed me to prioritize time with my son, reinforcing the value I place on family and balance.",
      "Helping families find a place to call home has been one of the greatest privileges of my life. I'm deeply grateful for the trust my clients place in me and take that responsibility seriously.",
      "If you're considering buying or selling, I'd be honored to guide you through the process with transparency, professionalism, and genuine support. You'll feel the difference.",
    ],
    services: [
      { icon: "Home", title: "Buyer Representation", description: "Navigate the home buying journey with confidence. From finding your dream home to negotiating the best terms, I'll be your advocate every step of the way." },
      { icon: "TrendingUp", title: "Seller Services", description: "Maximize your home's value with strategic marketing, professional staging advice, and expert negotiation skills that ensure you get top dollar." },
      { icon: "MapPin", title: "Relocation Services", description: "Moving to a new city? I specialize in helping relocating families find the perfect neighborhood, schools, and community to call home." },
      { icon: "Building", title: "Investment Guidance", description: "Build long-term wealth through strategic real estate investments. I'll help you identify opportunities and make informed decisions." },
    ],
  },
  "cassidy-spilker": {
    name: "Cassidy Spilker",
    title: "Realtor®",
    initials: "CS",
    email: "Cassidy@access.realty",
    phone: "(972) 820-7902",
    calendlyUrl: "calendly.com/cassidy-access/phone-call",
    listAgentKey: "0681230",
    bio: [
      "As a dedicated Realtor® serving the Dallas–Fort Worth area, I'm passionate about helping clients achieve their real estate dreams. My commitment to exceptional service and attention to detail ensures a smooth and successful transaction every time.",
      "Whether you're buying your first home, upgrading to your forever home, or selling to start a new chapter, I bring the expertise and dedication needed to make your real estate goals a reality.",
    ],
    services: [
      { icon: "Home", title: "Buyer Representation", description: "Navigate the home buying journey with confidence. From finding your dream home to negotiating the best terms, I'll be your advocate every step of the way." },
      { icon: "TrendingUp", title: "Seller Services", description: "Maximize your home's value with strategic marketing, professional staging advice, and expert negotiation skills that ensure you get top dollar." },
      { icon: "MapPin", title: "Relocation Services", description: "Moving to a new city? I specialize in helping relocating families find the perfect neighborhood, schools, and community to call home." },
      { icon: "Building", title: "Investment Guidance", description: "Build long-term wealth through strategic real estate investments. I'll help you identify opportunities and make informed decisions." },
    ],
  },
  "jennifer-lovett": {
    name: "Jennifer Lovett",
    title: "Realtor®",
    initials: "JL",
    email: "Jennifer@access.realty",
    phone: "(972) 820-7902",
    bio: [
      "I'm a dedicated Realtor® committed to providing exceptional service throughout your real estate journey. With a focus on clear communication and client satisfaction, I work tirelessly to ensure your experience exceeds expectations.",
      "Real estate is more than a transaction—it's about helping families find their perfect place. I'm honored to guide my clients through one of the most important decisions of their lives.",
    ],
    services: [
      { icon: "Home", title: "Buyer Representation", description: "Navigate the home buying journey with confidence. From finding your dream home to negotiating the best terms, I'll be your advocate every step of the way." },
      { icon: "TrendingUp", title: "Seller Services", description: "Maximize your home's value with strategic marketing, professional staging advice, and expert negotiation skills that ensure you get top dollar." },
      { icon: "MapPin", title: "Relocation Services", description: "Moving to a new city? I specialize in helping relocating families find the perfect neighborhood, schools, and community to call home." },
      { icon: "Building", title: "Investment Guidance", description: "Build long-term wealth through strategic real estate investments. I'll help you identify opportunities and make informed decisions." },
    ],
  },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home: HiOutlineHomeModern,
  TrendingUp: HiArrowTrendingUp,
  MapPin: HiMapPin,
  Building: HiBuildingOffice2,
};

export function generateStaticParams() {
  return Object.keys(staffData).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // Note: This is a workaround - in production you'd await params
  return {
    title: "Team Member | Access Realty",
  };
}

export default async function StaffMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const staff = staffData[slug];

  if (!staff) {
    notFound();
  }

  return (
    <div className="bg-card">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Avatar */}
          <div className="h-40 w-40 rounded-full border-4 border-secondary bg-primary mx-auto mb-6 flex items-center justify-center">
            <span className="text-primary-foreground text-5xl font-bold">
              {staff.initials}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
            {staff.name}
          </h1>
          <p className="text-xl text-secondary font-semibold mb-6">
            {staff.title}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {staff.calendlyUrl ? (
              <CalendlyButton
                url={staff.calendlyUrl}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
              >
                Schedule a Call
              </CalendlyButton>
            ) : (
              <a
                href={`mailto:${staff.email}`}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors"
              >
                Contact Me
              </a>
            )}
            <a
              href={`tel:${staff.phone.replace(/[^\d+]/g, "")}`}
              className="border-2 border-primary text-primary px-6 py-3 rounded-md font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {staff.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </section>

      {/* My Story Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </section>

      {/* Current Listings Section */}
      {staff.listAgentKey && (
        <ListingsCarousel
          title={`${staff.name.split(" ")[0]}'s Current Listings`}
          subtitle="Properties I'm currently representing"
          agentKey={staff.listAgentKey}
          limit={8}
          showViewAll={false}
        />
      )}

      {/* Closed Deals Map */}
      {staff.listAgentKey && (
        <ClosedDealsSection
          agentMlsId={staff.listAgentKey}
          agentName={staff.name}
        />
      )}

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8">
            Let&apos;s discuss your real estate goals and create a plan tailored to your needs.
          </p>
          {staff.calendlyUrl ? (
            <CalendlyButton
              url={staff.calendlyUrl}
              className="bg-secondary text-secondary-foreground px-8 py-3 rounded-md font-semibold hover:bg-secondary-light transition-colors cursor-pointer"
            >
              Schedule a Consultation
            </CalendlyButton>
          ) : (
            <a
              href={`mailto:${staff.email}`}
              className="bg-secondary text-secondary-foreground px-8 py-3 rounded-md font-semibold hover:bg-secondary-light transition-colors"
            >
              Schedule a Consultation
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
