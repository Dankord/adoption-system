"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PawPrint, Heart, MapPin, Users, MessageCircle } from "lucide-react";
import { ApplyModal } from "@/app/components/landing/ApplyModal";
import { getApiErrorMessage } from "@/lib/api-error";
import { toast } from "sonner";

const HOUSING_LABELS: Record<string, string> = {
  any: "Any Housing",
  "apartment-friendly": "Apartment Friendly",
  yard_needed: "Yard Needed",
  large_space: "Large Space",
};

// const EXPERIENCE_LABELS: Record<string, string> = {
//   first_time_friendly: "First-Time Friendly",
//   intermediate: "Intermediate",
//   experienced_only: "Experienced Only",
// };

interface RecommendedPet {
  id: number;
  owner_id: number | null;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  status: string;
  adoption_fee: number;
  image: string | null;
  vaccinated: boolean;
  neutered: boolean;
  special_needs: string | null | undefined;
  temperaments: string[];
  adoption_questions: Array<{ question: string }>;
  description: string | null | undefined;
  housing_preference: string | null | undefined;
  good_with_other_pets: boolean | null | undefined;
  required_experience: string | null | undefined;
  match_score: number;
  match_details: string[];
  owner_name: string;
}

const CustomerForYouCard = () => {
  const { getRecommendations, user, startConversation } = useAuth();
  const [pets, setPets] = useState<RecommendedPet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [appliedPetIds, setAppliedPetIds] = useState<Set<number>>(new Set());
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<{ id: number; name: string; questions: Array<{ question: string }>; ownerId: number | null } | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendations();
        setPets(data as unknown as RecommendedPet[]);
      } catch {
        setPets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [getRecommendations]);

  const handleApply = (pet: RecommendedPet) => {
    setSelectedPet({
      id: pet.id,
      name: pet.name,
      questions: pet.adoption_questions ?? [],
      ownerId: pet.owner_id,
    });
    setApplyModalOpen(true);
  };

  const handleApplicationSubmitted = async () => {
    if (selectedPet) {
      setAppliedPetIds((prev) => new Set([...prev, selectedPet.id]));
    }
    if (selectedPet?.ownerId) {
      try {
        await startConversation(selectedPet.ownerId, selectedPet.id);
        toast.success("Application submitted! Opening chat with owner...");
      } catch {
        toast.success("Application submitted successfully!");
      }
    }
    window.location.href = "/Pages/customer/dashboard?tab=messages";
  };

  const handleMessageOwner = async (pet: RecommendedPet) => {
    if (!pet.owner_id) return;
    try {
      await startConversation(pet.owner_id, pet.id);
      window.location.href = "/Pages/customer/dashboard?tab=messages";
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to start conversation."));
    }
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>
          Pets that match your profile
        </h2>
        <p className="text-s text-[#7A6150] pb-5">Based on your housing and experience.</p>
        <div className="text-center py-12">
          <p className="text-[#7A6150]">Finding pets that match you...</p>
        </div>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>
          Pets that match your profile
        </h2>
        <p className="text-s text-[#7A6150] pb-5">Based on your housing and experience.</p>
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🐾</p>
          <p className="text-[#7A6150]">No matching pets found right now.</p>
          <p className="text-xs text-[#7A6150]/60 mt-1">New pets are added regularly. Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>
        Pets that match your profile
      </h2>
      <p className="text-s text-[#7A6150] pb-5">Based on your housing and experience.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((pet) => {
          const hasApplied = appliedPetIds.has(pet.id);
          return (
            <Card key={pet.id} className="w-full overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative">
                {pet.image ? (
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-[#F2E8DB] flex items-center justify-center">
                    <PawPrint className="w-12 h-12 text-[#7A6150]/30" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className="bg-[#C4622D] text-white text-xs px-2 py-1 rounded-full font-medium">
                    {Math.round((pet.match_score / 10) * 100)}% Match
                  </span>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg" style={{ fontFamily: "var(--font-dm-serif)" }}>
                      {pet.name}
                    </h3>
                    <p className="text-xs text-[#7A6150]">
                      {pet.species} {pet.breed && `· ${pet.breed}`}
                    </p>
                  </div>
                  <Heart className="w-4 h-4 text-[#C4622D]" />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {pet.temperaments.slice(0, 3).map((temp) => (
                    <span
                      key={temp}
                      className="text-xs px-2 py-0.5 rounded-full bg-[#F2E8DB] text-[#7A6150]"
                    >
                      {temp}
                    </span>
                  ))}
                </div>

                <div className="space-y-1.5 text-xs text-[#7A6150] mb-3">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{pet.age} · {pet.gender}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Owner: {pet.owner_name}</span>
                  </div>
                  {pet.housing_preference && (
                    <div className="text-[#7A6150]/70">
                      Best for: {HOUSING_LABELS[pet.housing_preference] || pet.housing_preference}
                    </div>
                  )}
                </div>

                {pet.match_details.length > 0 && (
                  <div className="mb-3 p-2 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs font-medium text-green-700 mb-1">Why you&apos;re a match:</p>
                    <ul className="text-xs text-green-600 space-y-0.5">
                      {pet.match_details.slice(0, 2).map((detail, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-green-500">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-[#dabcac]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#C4622D]">
                      ₱{pet.adoption_fee.toLocaleString()}
                    </span>
                    <Button
                      onClick={() => handleMessageOwner(pet)}
                      variant="outline"
                      className="border-[#C4622D] text-[#C4622D] hover:bg-[#C4622D]/5 text-sm flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message Owner
                    </Button>
                  </div>
                  {pet.owner_id && !hasApplied && (
                    
                    <Button
                      onClick={() => handleApply(pet)}
                      disabled={hasApplied}
                      className={`bg-[#C4622D] hover:bg-amber-700 w-full text-sm ${hasApplied ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {hasApplied ? "Applied" : "Apply Now"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedPet && (
        <ApplyModal
          isOpen={applyModalOpen}
          onClose={() => {
            setApplyModalOpen(false);
            setSelectedPet(null);
          }}
          petId={selectedPet.id}
          petName={selectedPet.name}
          questions={selectedPet.questions}
          onSubmitted={handleApplicationSubmitted}
        />
      )}
    </div>
  );
};

export default CustomerForYouCard;
