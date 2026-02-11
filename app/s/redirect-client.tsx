// ABOUTME: Client component that handles redirect after page renders
// ABOUTME: Allows OG tags to be served before redirecting user to direct-list.com

"use client";

import { useEffect } from "react";

export default function RedirectClient() {
  useEffect(() => {
    window.location.href =
      "https://direct-list.com?utm_source=metroplex_homebuyers&utm_medium=sms&utm_campaign=2026_launch&utm_content=drip1";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
}
