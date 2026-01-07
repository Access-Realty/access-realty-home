// ABOUTME: Layout for Solutions pages with branded headers
// ABOUTME: No standard Access Realty header - pages provide their own branded nav

import { AccessFooter } from "@/components/AccessFooter";

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex flex-col">{children}</main>
      <AccessFooter />
    </div>
  );
}
