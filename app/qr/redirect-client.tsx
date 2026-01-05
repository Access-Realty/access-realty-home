// ABOUTME: Client component that handles redirect after page renders
// ABOUTME: Allows OG tags to be served before redirecting user

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectClient() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/direct-list?utm_source=access&utm_medium=yard_sign&utm_campaign=direct_list_qr");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
}
