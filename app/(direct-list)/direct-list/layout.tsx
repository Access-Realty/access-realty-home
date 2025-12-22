// ABOUTME: DirectList-specific layout with dedicated header and footer
// ABOUTME: Navigation focused on DirectList flow (How It Works, pricing)

import { DirectListHeader } from "@/components/direct-list/DirectListHeader";
import { DirectListFooter } from "@/components/direct-list/DirectListFooter";

export default function DirectListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DirectListHeader />
      <main className="flex-1">{children}</main>
      <DirectListFooter />
    </div>
  );
}
