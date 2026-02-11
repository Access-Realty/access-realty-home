// ABOUTME: Client component that handles redirect after page renders
// ABOUTME: Allows OG tags to be served before redirecting user to direct-list.com

"use client";

import { useEffect } from "react";

export default function RedirectClient() {
  useEffect(() => {
    window.location.href =
      "https://direct-list.com?utm_source=access&utm_medium=yard_sign&utm_campaign=direct_list";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
}
