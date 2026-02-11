// ABOUTME: Home pages layout with Header and AccessFooter
// ABOUTME: Used for homepage, solutions, services, privacy, terms, how-it-works, staff

import { AccessHeader } from "@/components/AccessHeader";
import { AccessFooter } from "@/components/AccessFooter";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AccessHeader />
      <main className="flex-1 flex flex-col">{children}</main>
      <AccessFooter />
    </div>
  );
}
