"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/app/components/landing/Hero";
import { HowItWorksTeaser } from "@/app/components/landing/HowItWorksTeaser";
import { AvailablePets } from "@/app/components/landing/AvailablePets";
import { Footer } from "@/components/footer";
import { ROUTES } from "@/lib/routes";
import { PetService } from "@/lib/pet-service";

export default function LandingPage() {
  const [pets, setPets] = useState<Array<{
    id: number;
    name: string;
    species: string;
    breed: string;
    age: string;
    gender: string;
    status: string;
    adoptionFee: number;
    image: string;
    vaccinated: boolean;
    neutered: boolean;
    specialNeeds?: boolean;
    temperament: string[];
  }>>([]);
  const [totalAdopted, setTotalAdopted] = useState<number | undefined>(undefined);
  const [availableNow, setAvailableNow] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiPets = await PetService.getAllPublic();
        setPets(
          apiPets.map((p) => ({
            id: p.id,
            name: p.name,
            species: p.species,
            breed: p.breed,
            age: p.age,
            gender: p.gender,
            status: p.status,
            adoptionFee: p.adoption_fee ?? 0,
            image: p.image ?? "",
            vaccinated: p.vaccinated,
            neutered: p.neutered,
            specialNeeds: !!p.special_needs,
            temperament: p.temperaments ?? [],
          }))
        );
      } catch {
        setPets([]);
      }

      try {
        const stats = await PetService.getPublicStats();
        setTotalAdopted(stats.total_adopted);
        setAvailableNow(stats.available_now);
      } catch {
        // Keep default fallback values
      }
    };

    fetchData();
  }, []);

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
        <Hero totalAdopted={totalAdopted} availableNow={availableNow} />
        <HowItWorksTeaser onNavigate={handleNavigate} />
        <AvailablePets pets={pets} />
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
