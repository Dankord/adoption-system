"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import api from "@/lib/api";
import { ROUTES, UserRole, normalizeRole } from "@/lib/routes";

export interface Customer {
  id: number;
  user_id: number;
  customer_name: string;
  housing_type: string;
  has_space: boolean;
  previous_owner: boolean;
  household_number: number;
  has_pets: boolean;
  typical_sched: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number | string;
  email: string;
  role: UserRole;
  profile_completed_at: string | null;
  customer?: Customer;
}

export interface Pet {
  id: number;
  owner_id?: number;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  status: "Available" | "Under Review" | "Reserved" | "Adopted";
  adoption_fee: number;
  image: string | null;
  vaccinated: boolean;
  neutered: boolean;
  special_needs?: string | null;
  temperaments: string[];
  adoption_questions: Array<{ question: string }>;
  created_at?: string;
}

export interface AddPetInput {
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  adoption_fee: number;
  vaccinated: boolean;
  neutered: boolean;
  special_needs: string;
  temperament: string[];
  adoptionQuestions: Array<{ question: string }>;
  image?: string;
}

export interface EditPetInput {
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  adoption_fee: number;
  vaccinated: boolean;
  neutered: boolean;
  special_needs: string;
  temperament: string[];
  adoptionQuestions: Array<{ question: string }>;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (profile: Record<string, unknown>) => Promise<User>;
  getProfile: () => Promise<User>;
  getPets: () => Promise<Pet[]>;
  addPet: (data: AddPetInput, imageFile?: File | null) => Promise<Pet>;
  updatePet: (id: number, data: EditPetInput, imageFile?: File | null) => Promise<Pet>;
  deletePet: (id: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeUser(user: User): User {
  return {
    ...user,
    role: normalizeRole(user.role),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const res = await api.get("/user");
        if (mounted) {
          setUser(normalizeUser(res.data.user));
        }
      } catch (err) {
        if (
          axios.isAxiosError(err) &&
          err.response?.status === 401
        ) {
          await api.post("/logout").catch(() => {});
        }
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await api.post("/login", { email, password });
    const user = normalizeUser(res.data.user as User);
    setUser(user);
    return user;
  };

  const signUp = async (email: string, password: string, name?: string) => {
    await api.post("/register", { email, password, name });
  };

  const signOut = async () => {
    try {
      await api.post("/logout");
    } finally {
      setUser(null);
      window.location.href = ROUTES.home;
    }
  };

  const refreshUser = async () => {
    const res = await api.get("/user");
    setUser(normalizeUser(res.data.user));
  };

  const updateProfile = async (profile: Record<string, unknown>): Promise<User> => {
    const res = await api.post("/profile", { profile });
    const updatedUser = normalizeUser(res.data.user as User);
    setUser(updatedUser);
    return updatedUser;
  };

  const getProfile = async (): Promise<User> => {
    const res = await api.get("/profile");
    const profileUser = normalizeUser(res.data.user as User);
    setUser(profileUser);
    return profileUser;
  };

  const getPets = async (): Promise<Pet[]> => {
    const res = await api.get("/pets");
    return res.data.pets as Pet[];
  };

  const addPet = async (data: AddPetInput, imageFile?: File | null): Promise<Pet> => {
    let imageUrl: string | undefined = data.image;

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      const uploadRes = await api.post("/pet-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      imageUrl = uploadRes.data.url;
    }

    const res = await api.post("/pets", {
      name: data.name,
      species: data.species,
      breed: data.breed,
      age: data.age,
      gender: data.gender,
      adoption_fee: data.adoption_fee,
      vac_status: data.vaccinated ? "Yes" : "No",
      is_neutered: data.neutered,
      special_needs: data.special_needs || null,
      temperaments: data.temperament,
      adoption_questions: data.adoptionQuestions,
      status: "under_review",
      image: imageUrl,
    });

    return res.data.pet as Pet;
  };

  const updatePet = async (id: number, data: EditPetInput, imageFile?: File | null): Promise<Pet> => {
    let imageUrl: string | undefined = data.image;

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      const uploadRes = await api.post("/pet-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      imageUrl = uploadRes.data.url;
    }

    const res = await api.put(`/pets/${id}`, {
      name: data.name,
      species: data.species,
      breed: data.breed,
      age: data.age,
      gender: data.gender,
      adoption_fee: data.adoption_fee,
      vac_status: data.vaccinated ? "Yes" : "No",
      is_neutered: data.neutered,
      special_needs: data.special_needs || null,
      temperaments: data.temperament,
      adoption_questions: data.adoptionQuestions,
      status: data.status === "Available" ? "available" : data.status === "Reserved" ? "reserved" : data.status === "Adopted" ? "adopted" : "under_review",
      image: imageUrl,
    });

    return res.data.pet as Pet;
  };

  const deletePet = async (id: number): Promise<void> => {
    await api.delete(`/pets/${id}`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshUser,
        updateProfile,
        getProfile,
        getPets,
        addPet,
        updatePet,
        deletePet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
