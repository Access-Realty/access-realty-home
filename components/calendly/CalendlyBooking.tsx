// ABOUTME: Custom Calendly booking UI that replaces the embed widget
// ABOUTME: Fetches available times from API and creates bookings without showing Calendly branding

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Calendar } from "../ui/calendar";
import {
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineVideoCamera,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import type { Matcher } from "react-day-picker";
import type {
  CalendlyBookingProps,
  CalendlyBookingResult,
  TimeSlot,
} from "./types";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

type BookingStep =
  | "calendar"
  | "times"
  | "validating"
  | "confirming"
  | "booking"
  | "success";

export function CalendlyBooking({
  eventTypeUri,
  invitee,
  leadId,
  programSource,
  onBooked,
  onError,
  onBack,
  meetingInfo,
  hostInfo,
}: CalendlyBookingProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [bookingStep, setBookingStep] = useState<BookingStep>("calendar");
  const [bookingResult, setBookingResult] =
    useState<CalendlyBookingResult | null>(null);
  const [datesWithSlots, setDatesWithSlots] = useState<Set<string>>(new Set());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [slotError, setSlotError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [locationKind, setLocationKind] = useState<string | null>(null);

  // Track component mount state
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Smooth step transition helper
  const transitionToStep = useCallback((newStep: BookingStep) => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (isMountedRef.current) {
        setBookingStep(newStep);
        setIsTransitioning(false);
      }
    }, 150);
  }, []);

  const hasFetchedRef = useRef(false);

  // Fetch event type details on mount
  useEffect(() => {
    async function fetchEventType() {
      try {
        const response = await fetch(
          `/api/calendly/event-type?uri=${encodeURIComponent(eventTypeUri)}`
        );
        if (response.ok) {
          const data = await response.json();
          if (!isMountedRef.current) return;
          if (data.duration) setDuration(data.duration);
          if (data.locations && data.locations.length > 0) {
            setLocationKind(data.locations[0].kind);
          }
        }
      } catch (error) {
        console.warn("Failed to fetch event type details:", error);
      }
    }
    fetchEventType();
  }, [eventTypeUri]);

  // Map location kind to display name
  const getLocationDisplayName = (kind: string | null): string => {
    if (!kind) return "Video call";
    const locationNames: Record<string, string> = {
      google_conference: "Google Meet",
      zoom: "Zoom",
      microsoft_teams_conference: "Microsoft Teams",
      webex_conference: "Webex",
      gotomeeting_conference: "GoToMeeting",
      outbound_call: "Phone call",
      inbound_call: "Phone call",
      physical: "In-person",
    };
    return locationNames[kind] || "Video call";
  };

  // Fetch a single 7-day window of slots
  const fetchWeekSlots = useCallback(
    async (startDate: Date): Promise<TimeSlot[]> => {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);

      const params = new URLSearchParams({
        event_type: eventTypeUri,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
      });

      const response = await fetch(`/api/calendly/available-times?${params}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch available times");
      }

      const data = await response.json();
      return data.slots || [];
    },
    [eventTypeUri]
  );

  // Fetch all 4 weeks of availability on mount
  const fetchAllSlots = useCallback(async () => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    setIsLoadingSlots(true);
    setSlotError(null);

    try {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 1);

      const weekStarts: Date[] = [];
      for (let i = 0; i < 4; i++) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() + i * 7);
        weekStarts.push(weekStart);
      }

      const results = await Promise.all(
        weekStarts.map(async (start) => {
          try {
            return await fetchWeekSlots(start);
          } catch {
            return [];
          }
        })
      );

      if (!isMountedRef.current) return;

      const allSlots: TimeSlot[] = [];
      const seenTimes = new Set<string>();
      for (const slots of results) {
        for (const slot of slots) {
          if (!seenTimes.has(slot.start_time)) {
            seenTimes.add(slot.start_time);
            allSlots.push(slot);
          }
        }
      }

      setAvailableSlots(allSlots);

      const dates = new Set<string>();
      for (const slot of allSlots) {
        const slotDate = new Date(slot.start_time);
        dates.add(slotDate.toDateString());
      }
      setDatesWithSlots(dates);
    } catch (error) {
      console.error("Error fetching slots:", error);
      const message =
        error instanceof Error ? error.message : "Failed to load available times";
      if (isMountedRef.current) {
        setSlotError(message);
      }
      onError?.(message);
    } finally {
      if (isMountedRef.current) {
        setIsLoadingSlots(false);
      }
    }
  }, [fetchWeekSlots, onError]);

  useEffect(() => {
    fetchAllSlots();
  }, [fetchAllSlots]);

  const refetchSlots = useCallback(() => {
    hasFetchedRef.current = false;
    fetchAllSlots();
  }, [fetchAllSlots]);

  const slotsForSelectedDate = selectedDate
    ? availableSlots.filter((slot) => {
        const slotDate = new Date(slot.start_time);
        return slotDate.toDateString() === selectedDate.toDateString();
      })
    : [];

  const formatTime = (isoString: string, includeTimezone = false) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    if (includeTimezone) {
      options.timeZoneName = "short";
    }
    return date.toLocaleTimeString("en-US", options);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setSlotError(null);
    if (date) {
      transitionToStep("times");
    }
  };

  // Validate slot before confirming
  const handleSlotContinue = async () => {
    if (!selectedSlot || !selectedDate) return;

    setSlotError(null);
    transitionToStep("validating");

    try {
      // Use current time (not selectedDate which could be midnight of today)
      // to avoid "start_time must be in the future" error from Calendly
      const now = new Date();
      now.setMinutes(now.getMinutes() + 1);
      const freshSlots = await fetchWeekSlots(now);
      if (!isMountedRef.current) return;

      const slotStillAvailable = freshSlots.some(
        (slot) => slot.start_time === selectedSlot.start_time
      );

      if (slotStillAvailable) {
        transitionToStep("confirming");
      } else {
        setSelectedSlot(null);
        setSlotError("That time is no longer available. Please select another.");
        transitionToStep("times");
      }
    } catch (error) {
      console.error("Error validating slot:", error);
      const message =
        error instanceof Error ? error.message : "Failed to verify availability";
      setSlotError(message);
      transitionToStep("times");
    }
  };

  // Handle booking with UTM params for webhook linking
  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;

    transitionToStep("booking");

    try {
      const response = await fetch("/api/calendly/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: eventTypeUri,
          start_time: selectedSlot.start_time,
          invitee: {
            name: invitee.name,
            email: invitee.email,
            phone: invitee.phone,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          // UTM params for webhook to link meeting to lead
          utm: {
            utm_source: programSource || "marketing_site",
            utm_campaign: "consultation",
            utm_content: leadId, // This is how webhook links to lead
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create booking");
      }

      if (!isMountedRef.current) return;

      const result: CalendlyBookingResult = await response.json();
      setBookingResult(result);
      transitionToStep("success");
      onBooked(result);
    } catch (error) {
      console.error("Booking error:", error);
      const message =
        error instanceof Error ? error.message : "Failed to create booking";

      if (message.includes("future") || message.includes("available")) {
        setSlotError("That time is no longer available. Please select another.");
        setSelectedSlot(null);
        transitionToStep("times");
      } else {
        setSlotError(message);
        transitionToStep("confirming");
      }
      onError?.(message);
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    return !datesWithSlots.has(date.toDateString());
  };

  const availableDatesMatcher: Matcher = (date: Date) => {
    return datesWithSlots.has(date.toDateString());
  };

  // Container with transition
  const StepContainer = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={cn(
        "transition-opacity duration-150",
        isTransitioning ? "opacity-0" : "opacity-100",
        className
      )}
    >
      {children}
    </div>
  );

  // Success state
  if (bookingStep === "success" && bookingResult) {
    const startTime = new Date(bookingResult.start_time);
    return (
      <StepContainer>
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-6">
          <div className="rounded-full bg-green-100 p-4">
            <HiOutlineCheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Consultation Scheduled!
            </h3>
            <p className="text-muted-foreground">
              {formatDate(startTime)} at {formatTime(bookingResult.start_time)}
            </p>
            {bookingResult.assigned_host && (
              <p className="text-muted-foreground">
                with{" "}
                <span className="font-medium text-foreground">
                  {bookingResult.assigned_host.name}
                </span>
              </p>
            )}
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            You&apos;ll receive a confirmation email at {invitee.email} with
            details and a link to join the meeting.
          </p>
        </div>
      </StepContainer>
    );
  }

  // Booking in progress state
  if (bookingStep === "booking" && selectedSlot) {
    const slotDate = new Date(selectedSlot.start_time);
    return (
      <StepContainer>
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
          <div className="relative">
            <HiOutlineCalendarDays className="h-12 w-12 text-primary/30" />
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin absolute -bottom-1 -right-1" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Scheduling your consultation...
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatShortDate(slotDate)} at {formatTime(selectedSlot.start_time)}
            </p>
          </div>
        </div>
      </StepContainer>
    );
  }

  // Validating slot state
  if (bookingStep === "validating") {
    return (
      <StepContainer>
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">
            Checking availability...
          </p>
        </div>
      </StepContainer>
    );
  }

  // Confirmation state
  if (bookingStep === "confirming" && selectedSlot) {
    const slotDate = new Date(selectedSlot.start_time);
    return (
      <StepContainer>
        <div className="space-y-6">
          {slotError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <HiOutlineExclamationCircle className="h-4 w-4 flex-shrink-0" />
              <p>{slotError}</p>
            </div>
          )}

          <div className="bg-muted/50 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <HiOutlineCalendarDays className="h-5 w-5 text-primary" />
              </div>
              <p className="font-medium text-foreground">
                {formatShortDate(slotDate)} · {formatTime(selectedSlot.start_time, true)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                {meetingInfo?.type === "in_person" || locationKind === "physical" ? (
                  <HiOutlineMapPin className="h-5 w-5 text-primary" />
                ) : meetingInfo?.type === "phone" || locationKind === "outbound_call" || locationKind === "inbound_call" ? (
                  <HiOutlinePhone className="h-5 w-5 text-primary" />
                ) : (
                  <HiOutlineVideoCamera className="h-5 w-5 text-primary" />
                )}
              </div>
              <p className="font-medium text-foreground">
                {meetingInfo?.type === "in_person" || locationKind === "physical"
                  ? "In-person"
                  : meetingInfo?.type === "phone" || locationKind === "outbound_call" || locationKind === "inbound_call"
                  ? "Phone call"
                  : getLocationDisplayName(locationKind)}
              </p>
            </div>

            {hostInfo && (
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <HiOutlineUser className="h-5 w-5 text-primary" />
                </div>
                <p className="font-medium text-foreground">
                  {hostInfo.name || (hostInfo.isTeamCalendar ? "Access Realty team member" : "Access Realty realtor")}
                </p>
              </div>
            )}

            <div className="pt-2 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Booking for{" "}
                <span className="font-medium text-foreground">
                  {invitee.name}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">{invitee.email}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                transitionToStep("times");
                setSelectedSlot(null);
              }}
              className="flex-1 py-3 px-4 border border-border rounded-lg font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <HiOutlineArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={handleConfirmBooking}
              className="flex-1 py-3 px-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </StepContainer>
    );
  }

  // Time selection state
  if (bookingStep === "times" && selectedDate) {
    return (
      <StepContainer>
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                transitionToStep("calendar");
                setSelectedSlot(null);
                setSlotError(null);
              }}
              className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <HiOutlineArrowLeft className="h-4 w-4" />
            </button>
            <p className="text-lg font-semibold text-foreground">
              {formatShortDate(selectedDate)}{duration ? ` · ${duration} min` : ""}
            </p>
          </div>

          {slotError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <HiOutlineExclamationCircle className="h-4 w-4 flex-shrink-0" />
              <p>{slotError}</p>
            </div>
          )}

          {slotsForSelectedDate.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {slotsForSelectedDate.map((slot) => (
                  <button
                    key={slot.start_time}
                    onClick={() => {
                      setSelectedSlot(slot);
                      setSlotError(null);
                    }}
                    className={cn(
                      "py-2.5 px-3 rounded-lg border font-medium transition-all",
                      selectedSlot?.start_time === slot.start_time
                        ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary ring-offset-2"
                        : "border-border text-foreground hover:border-primary hover:bg-primary/5"
                    )}
                  >
                    {formatTime(slot.start_time)}
                  </button>
                ))}
              </div>

              <div
                className={cn(
                  "transition-all duration-200",
                  selectedSlot
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 pointer-events-none"
                )}
              >
                <button
                  onClick={handleSlotContinue}
                  className="w-full py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <div className="rounded-full bg-muted p-3 w-fit mx-auto">
                <HiOutlineCalendarDays className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground">
                  No available times on this date.
                </p>
                <button
                  onClick={() => transitionToStep("calendar")}
                  className="mt-2 text-primary font-medium hover:underline"
                >
                  Choose a different date
                </button>
              </div>
            </div>
          )}
        </div>
      </StepContainer>
    );
  }

  // Calendar selection state (default)
  return (
    <StepContainer>
      <div className="space-y-5">
        <h3 className="text-lg font-semibold text-foreground text-center">
          Select a Date
        </h3>

        <div className="flex justify-center relative">
          {/* Loading overlay */}
          {isLoadingSlots && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl transition-opacity duration-150">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Loading availability...</span>
              </div>
            </div>
          )}

          <Calendar
            mode="single"
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            fromMonth={new Date()}
            toMonth={new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)}
            modifiers={{
              available: availableDatesMatcher,
            }}
            modifiersClassNames={{
              available: "font-semibold text-primary",
            }}
            className="rounded-xl border border-border p-3"
          />
        </div>

        {slotError && !isLoadingSlots && (
          <div className="flex items-center justify-center gap-2 text-sm text-red-600">
            <HiOutlineExclamationCircle className="h-4 w-4" />
            <span>{slotError}</span>
            <button
              onClick={refetchSlots}
              className="text-primary font-medium hover:underline ml-1"
            >
              Retry
            </button>
          </div>
        )}

        {onBack && (
          <div className="flex justify-start pt-2">
            <button
              onClick={onBack}
              className="py-2 px-4 border border-border rounded-lg font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-2"
            >
              <HiOutlineArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        )}
      </div>
    </StepContainer>
  );
}
