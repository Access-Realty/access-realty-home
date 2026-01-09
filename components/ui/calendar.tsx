// ABOUTME: Calendar date picker component using react-day-picker v9
// ABOUTME: Styled to match Access Realty marketing site theme

"use client";

import * as React from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { DayPicker } from "react-day-picker";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// Custom chevron component for navigation (react-day-picker v9 API)
function Chevron({ orientation }: { orientation?: "left" | "right" | "up" | "down" }) {
  const Icon = orientation === "left" ? HiChevronLeft : HiChevronRight;
  return <Icon className="size-4" />;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium text-foreground",
        nav: "flex items-center gap-1",
        button_previous: cn(
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          "inline-flex items-center justify-center rounded-md border border-border",
          "hover:bg-muted transition-colors absolute left-1"
        ),
        button_next: cn(
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          "inline-flex items-center justify-center rounded-md border border-border",
          "hover:bg-muted transition-colors absolute right-1"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-primary/10 [&:has([aria-selected])]:rounded-md"
        ),
        day_button: cn(
          "size-9 p-0 font-normal",
          "inline-flex items-center justify-center rounded-md",
          "hover:bg-muted transition-colors cursor-pointer",
          "aria-selected:opacity-100",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        ),
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-secondary/20 text-secondary-foreground font-semibold",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron,
      }}
      {...props}
    />
  );
}

export { Calendar };
