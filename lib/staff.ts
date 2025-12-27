// ABOUTME: Service layer for staff/agent data from Supabase staff view
// ABOUTME: Combines DB data (member_key, contact) with hardcoded bio/services

import { supabase } from "./supabase";

// Staff data from Supabase staff view
export interface StaffProfile {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  role: string | null;
  member_key: string | null; // MLS agent ID for listings lookup
  calendly_remote_url: string | null;
  calendly_in_person_url: string | null;
  calendly_phone_url: string | null;
  avatar_url: string | null;
  is_active: boolean;
}

// Combined staff data with hardcoded content
export interface StaffMember extends StaffProfile {
  slug: string;
  initials: string;
  bio: string[];
  services: { icon: string; title: string; description: string }[];
}

// Hardcoded bio/services content (will be dynamic later)
const staffContent: Record<string, {
  bio: string[];
  services: { icon: string; title: string; description: string }[];
}> = {
  "justin-brown": {
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

// Default services for agents without custom content
const defaultServices = [
  { icon: "Home", title: "Buyer Representation", description: "Navigate the home buying journey with confidence. From finding your dream home to negotiating the best terms, I'll be your advocate every step of the way." },
  { icon: "TrendingUp", title: "Seller Services", description: "Maximize your home's value with strategic marketing, professional staging advice, and expert negotiation skills that ensure you get top dollar." },
  { icon: "MapPin", title: "Relocation Services", description: "Moving to a new city? I specialize in helping relocating families find the perfect neighborhood, schools, and community to call home." },
  { icon: "Building", title: "Investment Guidance", description: "Build long-term wealth through strategic real estate investments. I'll help you identify opportunities and make informed decisions." },
];

/**
 * Generate URL slug from name (e.g., "Justin Brown" -> "justin-brown")
 */
function generateSlug(firstName: string, lastName: string): string {
  return `${firstName}-${lastName}`.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Generate initials from name (e.g., "Justin Brown" -> "JB")
 */
function generateInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Fetch all active staff members (agents/realtors)
 */
export async function getStaffMembers(): Promise<StaffMember[]> {
  const { data, error } = await supabase
    .from("staff")
    .select("id, first_name, last_name, full_name, email, phone, role, member_key, calendly_remote_url, calendly_in_person_url, calendly_phone_url, avatar_url, is_active")
    .order("last_name");

  if (error) {
    console.error("Error fetching staff:", error);
    return [];
  }

  // Filter to only staff members with content defined
  return (data as StaffProfile[])
    .map((profile) => {
      const slug = generateSlug(profile.first_name, profile.last_name);
      const content = staffContent[slug];

      return {
        ...profile,
        slug,
        initials: generateInitials(profile.first_name, profile.last_name),
        bio: content?.bio || [`${profile.first_name} is a dedicated real estate professional serving the Dallas–Fort Worth area.`],
        services: content?.services || defaultServices,
        hasContent: !!content,
      };
    })
    .filter((staff) => staff.hasContent);
}

/**
 * Fetch a single staff member by slug
 */
export async function getStaffBySlug(slug: string): Promise<StaffMember | null> {
  // Only allow slugs we have content for
  if (!staffContent[slug]) return null;

  // Parse slug to get name parts (e.g., "justin-brown" -> ["justin", "brown"])
  const parts = slug.split("-");
  if (parts.length < 2) return null;

  const firstName = parts[0];
  const lastName = parts.slice(1).join(" "); // Handle multi-part last names

  const { data, error } = await supabase
    .from("staff")
    .select("id, first_name, last_name, full_name, email, phone, role, member_key, calendly_remote_url, calendly_in_person_url, calendly_phone_url, avatar_url, is_active")
    .ilike("first_name", firstName)
    .ilike("last_name", lastName)
    .single();

  if (error || !data) {
    console.error("Error fetching staff member:", error);
    return null;
  }

  const profile = data as StaffProfile;
  const content = staffContent[slug];

  return {
    ...profile,
    slug,
    initials: generateInitials(profile.first_name, profile.last_name),
    bio: content?.bio || [`${profile.first_name} is a dedicated real estate professional serving the Dallas–Fort Worth area.`],
    services: content?.services || defaultServices,
  };
}

/**
 * Get all staff slugs for static generation
 */
export async function getStaffSlugs(): Promise<string[]> {
  const staff = await getStaffMembers();
  return staff.map((s) => s.slug);
}
