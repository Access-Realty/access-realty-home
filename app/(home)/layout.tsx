// ABOUTME: Home pages layout with full Header and Footer
// ABOUTME: Used for homepage, solutions, services, privacy, terms, how-it-works, staff

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
