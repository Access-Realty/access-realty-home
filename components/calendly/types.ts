// ABOUTME: Type definitions for Calendly booking component
// ABOUTME: Shared interfaces for invitee, booking result, and component props

export interface CalendlyInvitee {
  name: string;
  email: string;
  phone?: string;
}

export interface CalendlyBookingResult {
  event_id: string;
  invitee_id: string;
  start_time: string;
  end_time?: string;
  assigned_host?: {
    name: string;
    email: string;
  };
  location?: {
    type: string; // e.g., "outbound_call", "physical", "google_conference"
    location?: string; // e.g., phone number or address
  };
  reschedule_url?: string;
  cancel_url?: string;
}

export interface MeetingInfo {
  type: "remote" | "in_person" | "phone";
  location?: string;
  description?: string;
}

export interface HostInfo {
  name: string | null;
  isTeamCalendar?: boolean;
}

export interface CalendlyBookingProps {
  eventTypeUri: string;
  invitee: CalendlyInvitee;
  leadId: string; // Required for webhook to link meeting to lead
  programSource?: string; // e.g., "price_launch" for tracking
  programName?: string; // e.g., "Price Launch" for display in calendar
  propertyAddress?: string; // e.g., "123 Main St, Dallas, TX 75001"
  onBooked: (result: CalendlyBookingResult) => void;
  onError?: (error: string) => void;
  onBack?: () => void;
  meetingInfo?: MeetingInfo;
  hostInfo?: HostInfo;
}

export interface TimeSlot {
  start_time: string;
}
