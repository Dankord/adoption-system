"use client";

import { useAuth } from "@/lib/auth-context";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/app/components/landing/Hero";
import { HowItWorksTeaser } from "@/app/components/landing/HowItWorksTeaser";
import { AvailablePets } from "@/app/components/landing/AvailablePets";
import { Footer } from "@/components/footer";
import { ROUTES } from "@/lib/routes";
import { SAMPLE_PETS } from "@/lib/pets";

export default function LandingPage() {
  const handleNavigate = (page: string) => {
    if (page === "how-it-works") {
      window.location.href = ROUTES.howItWorks;
    } else if (page === "register") {
      window.location.href = ROUTES.registration;
    } else if (page === "sign-in") {
      window.location.href = ROUTES.signin;
    } else if (page === "home") {
      window.location.href = ROUTES.home;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorksTeaser onNavigate={handleNavigate} />
        <AvailablePets pets={SAMPLE_PETS} />
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
