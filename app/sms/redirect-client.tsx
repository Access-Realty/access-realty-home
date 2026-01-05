// ABOUTME: Client component that handles redirect after page renders
// ABOUTME: Allows OG tags to be served before redirecting user

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectClient() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/direct-list?utm_source=metroplex_homebuyers&utm_medium=sms&utm_campaign=2026_launch&utm_content=drip1");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
}
