// ABOUTME: Hero section with headline, description, and Google Places address input
// ABOUTME: Stores address in localStorage and navigates to get-started wizard

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AddressInput, AddressData } from "@/components/direct-list/AddressInput";
import { saveAddress } from "@/lib/addressStorage";

const Hero = () => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null);

  const handleAddressSelect = useCallback((address: AddressData) => {
    setSelectedAddress(address);
    // Save immediately so it's available when navigating
    saveAddress(address);
  }, []);

  const navigateToWizard = useCallback(() => {
    router.push("/selling-plan");
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Address already saved in handleAddressSelect if selected
    navigateToWizard();
  };

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
                Sell Your House Your Way
              </h1>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-primary-foreground/90">
                Let&apos;s be honest — traditional real estate can fall short.
              </p>
              <p className="text-lg text-primary-foreground/90">
                We bring top selling agents, highly rated investors, and self-service listing options
                together — so selling your home is smarter, faster, and easier.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <AddressInput
                  onAddressSelect={handleAddressSelect}
                  onAutoSubmit={navigateToWizard}
                  placeholder="Enter Your Address to Get Started"
                  inputClassName="!h-14 !py-0 !text-lg !border-2 !rounded-md !bg-card focus:!border-secondary"
                />
              </div>
              <button
                type="submit"
                className="h-14 px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-md transition-colors"
              >
                Get Started
              </button>
            </form>
          </div>

          <div className="relative animate-fade-in">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-secondary">
              <Image
                src="/hero-house.jpg"
                alt="Beautiful Texas home with stone accents"
                width={800}
                height={600}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
