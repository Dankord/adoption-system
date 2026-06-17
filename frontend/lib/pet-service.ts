import api from "@/lib/api";

export interface ApiPet {
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
  special_needs: string | null;
  temperaments: string[];
  adoption_questions: Array<{ question: string }>;
  description: string | null;
  created_at?: string;
}

export interface DisplayPet {
  id: number;
  ownerId: number | null;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  status: "Available" | "Under Review" | "Reserved" | "Adopted";
  adoptionFee: number;
  image: string;
  vaccinated: boolean;
  neutered: boolean;
  specialNeeds: boolean;
  temperament: string[];
  description: string;
  requirements: string[];
  customQuestions: string[];
  adoptionQuestions: Array<{ question: string }>;
}

export const PET_DEFAULTS = {
  requirements: [
    "Valid ID and proof of residence",
    "Secure living space recommended",
    "Commitment to proper care and veterinary visits",
  ],
  customQuestions: [
    "How many hours a day will the pet be alone?",
    "Do you have experience with this type of pet?",
    "Are all family members in agreement with the adoption?",
  ],
};

const STATUS_MAP: Record<string, "Available" | "Under Review" | "Reserved" | "Adopted"> = {
  available: "Available",
  under_review: "Under Review",
  reserved: "Reserved",
  adopted: "Adopted",
};

export function mapApiPetToDisplay(apiPet: ApiPet): DisplayPet {
  return {
    id: apiPet.id,
    ownerId: apiPet.owner_id,
    name: apiPet.name,
    species: apiPet.species,
    breed: apiPet.breed,
    age: apiPet.age,
    gender: apiPet.gender,
    status: STATUS_MAP[apiPet.status.toLowerCase()] ?? "Available",
    adoptionFee: apiPet.adoption_fee ?? 0,
    image: apiPet.image ?? "https://images.unsplash.com/photo-1543466835-00a290894dff?w=400&h=300&fit=crop&auto=format",
    vaccinated: apiPet.vaccinated,
    neutered: apiPet.neutered,
    specialNeeds: !!apiPet.special_needs,
    temperament: apiPet.temperaments ?? [],
    description: apiPet.description ?? "",
    requirements: PET_DEFAULTS.requirements,
    customQuestions:
      apiPet.adoption_questions?.map((q) => q.question) ??
      PET_DEFAULTS.customQuestions,
    adoptionQuestions:
      apiPet.adoption_questions ?? [],
  };
}

export const PetService = {
  async getAllPublic(): Promise<ApiPet[]> {
    const res = await api.get("/pets");
    return res.data.pets as ApiPet[];
  },

  async getOnePublic(id: number): Promise<ApiPet> {
    const res = await api.get(`/pets/${id}`);
    return res.data.pet as ApiPet;
  },
};
