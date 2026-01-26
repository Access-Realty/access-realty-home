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
      "I began my real estate career in 2005 and am a multi-million-dollar producer, having successfully closed over 1200 homes throughout the DFW Metroplex. With more than three decades of local knowledge, I bring deep market insight to every transaction. I work with buyers, sellers, relocation clients, first-time homebuyers, new construction, and rental property owners. I view myself as a true financial partner in the process, focused on clear communication, honest expectations, and helping clients make confident, informed decisions. My goal is to make every buying or selling experience as smooth, transparent, and successful as possible.",
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
      "I'm a full-time Realtor® and Broker Associate serving the Dallas–Fort Worth metroplex, committed to making the home buying and selling experience smooth, informed, and successful. With years of local expertise, strong negotiation skills, and a client-first mindset, I guide every step of the journey with clear communication and genuine care.",
      "I believe real estate is more than transactions. It's people, families, and life-changing milestones. Many of my clients stay in my life long after closing, turning into friends who feel like family. Whether you're a first-time buyer, seasoned investor, or selling for top value, I advocate for your best interests and treat your goals like my own.",
      "If you're thinking about buying or selling, I'd love to guide you through the process with confidence, transparency, and support. You'll feel the difference.",
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
      "I'm a real estate agent and investor with over 14 years of hands on experience buying, renovating, and selling properties throughout the DFW Metroplex. I've personally purchased, renovated and sold more than 100 homes, giving me true insight into properties from the inside out.",
      "As an active investor, I've reviewed hundreds of contracts and worked closely with title companies, lenders, and contractors, allowing me to anticipate issues, protect my clients interests, and guide transactions smoothly from contract to closing.",
      "I approach every client's purchase or sale the same way I approach my own investments, with careful analysis and honest guidance. Whether you're buying, selling, or investing, I provide clarity, confidence, and results backed by real world experience.",
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
function generateInitials(firstName: string | null, lastName: string | null): string {
  const first = firstName?.charAt(0) || "";
  const last = lastName?.charAt(0) || "";
  return `${first}${last}`.toUpperCase();
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
