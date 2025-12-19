// ABOUTME: Hero section with headline, description, and address input form
// ABOUTME: Main landing section with CTA to get started

"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";

const Hero = () => {
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to app with address
    window.location.href = `https://app.access.realty/signup?source=home&address=${encodeURIComponent(address)}`;
  };

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Sell Your House Your Way
              </h1>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-foreground">
                Let&apos;s be honest — traditional real estate can fall short.
              </p>
              <p className="text-lg text-foreground">
                We bring top selling agents, highly rated investors, and self-service listing options
                together — so selling your home is smarter, faster, and easier.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter Your Address to Get Started"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 h-14 text-lg border-2 border-border rounded-md focus:border-secondary focus:outline-none bg-card"
                />
              </div>
              <button
                type="submit"
                className="h-14 px-8 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold rounded-md transition-colors"
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
