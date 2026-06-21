"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
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
  description?: string | null;
  temperaments: string[];
  adoption_questions: Array<{ question: string }>;
  created_at?: string;
  housing_preference?: string | null;
  good_with_other_pets?: boolean | null;
  required_experience?: string | null;
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
  description: string;
  temperament: string[];
  adoptionQuestions: Array<{ question: string }>;
  image?: string;
  housingPreference?: string;
  goodWithOtherPets?: boolean;
  requiredExperience?: string;
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
  status: "Available" | "Under Review" | "Reserved" | "Adopted";
  description: string;
  temperament: string[];
  adoptionQuestions: Array<{ question: string }>;
  image?: string;
  housingPreference?: string;
  goodWithOtherPets?: boolean;
  requiredExperience?: string;
}

export interface ApplicationAnswer {
  question: string;
  answer: string | null;
}

export interface OwnerApplication {
  id: number;
  customer_name: string;
  pet_name: string;
  pet_species: string;
  pet_breed: string;
  pet_id: number;
  submitted_at: string;
  status: string;
  answers: ApplicationAnswer[];
  created_at: string;
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
  getApplications: () => Promise<OwnerApplication[]>;
  updateApplication: (id: number, status: string) => Promise<void>;
  getDashboardStats: () => Promise<Record<string, unknown>>;
  getRecommendations: () => Promise<Array<Pet & { match_score: number; match_details: string[]; owner_name: string }>>;
  getOwnersDashboardStats: () => Promise<{
    pet_status_breakdown: Record<string, number>;
    application_status: Record<string, number>;
    key_metrics: Record<string, number>;
    species_distribution: Record<string, number>;
  }>;
  getConversations: () => Promise<ConversationItem[]>;
  getMessages: (conversationId: number) => Promise<Message[]>;
  sendMessage: (conversationId: number, body: string) => Promise<void>;
  getUnreadCount: () => Promise<number>;
  startConversation: (ownerId: number, petId?: number) => Promise<void>;
  getCareReminders: () => Promise<CareReminder[]>;
  submitSurvey: (reminderId: number, responses: Record<string, string>) => Promise<void>;
  getAdminUsers: () => Promise<AdminUser[]>;
  createAdminUser: (data: { email: string; password: string; name: string; role: string }) => Promise<AdminUser>;
  updateAdminUser: (id: number, data: Partial<{ email: string; role: string; name: string; profile_completed_at: string | null }>) => Promise<AdminUser>;
  deleteAdminUser: (id: number) => Promise<void>;
  getAdminStats: () => Promise<AdminStats>;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  body: string;
  is_read: boolean;
  sender: { customer: string | null } | { customer_name: string | null };
  created_at: string;
}

export interface ConversationItem {
  id: number;
  customer_id: number;
  owner_id: number;
  pet_id: number | null;
  last_message_at: string | null;
  latestMessage: {
    id: number;
    body: string;
    sender_id: number;
    created_at: string;
  } | null;
  messages_count: number;
  unread_count: number;
  owner: { id: number; customer: { id: number; customer_name: string | null } | null };
  customer: { id: number; customer: { id: number; customer_name: string | null } | null };
  pet: { id: number; name: string | null } | null;
}

export interface CareReminder {
  id: number;
  application_id: number;
  reminder_type: string;
  survey_type: string;
  status: string;
  scheduled_at: string;
  completed_at: string | null;
  pet_name: string;
  pet_species: string;
  pet_breed: string;
  is_overdue: boolean;
}

export interface AdminUser {
  id: number;
  email: string;
  role: string;
  profile_completed_at: string | null;
  customer_name: string | null;
  has_customer_profile: boolean;
  created_at: string;
  customer?: {
    housing_type: string;
    has_space: boolean;
    previous_owner: boolean;
    household_number: number;
    has_pets: boolean;
    typical_sched: string;
  };
}

export interface AdminStats {
  total_users: number;
  total_customers: number;
  total_owners: number;
  total_pets: number;
  total_applications: number;
  total_adoptions: number;
  pending_applications: number;
  users_this_week: number;
  adoptions_this_month: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeUser(user: User): User {
  return {
    ...user,
    role: normalizeRole(user.role),
  };
}

function parseUserFromCookie(cookieValue: string | null): User | null {
  if (!cookieValue) return null;
  try {
    const data = JSON.parse(cookieValue);
    if (!data.id || !data.role) return null;
    return normalizeUser({
      id: data.id,
      email: data.email,
      role: data.role,
      profile_completed_at: data.profile_completed_at || null,
    } as User);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Read user data from cookie set by the proxy on login
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_user_data="))
      ?.split("=")
      .slice(1)
      .join("=");

    const storedUser = parseUserFromCookie(cookieValue ? decodeURIComponent(cookieValue) : null);
    if (storedUser && mounted) {
      setUser(storedUser);
    }

    // Validate stored user by calling /user endpoint
    if (storedUser && mounted) {
      refreshUser()
        .then(() => {
          // Successfully refreshed - user is valid
        })
        .catch(() => {
          // Refresh failed - clear stale auth data
          setUser(null);
          // Delete auth cookies
          document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
          document.cookie = "auth_user_data=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        });
    }

    setIsLoading(false);

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const res = await api.post("/login", { email, password });
    const user = normalizeUser(res.data.user as User);
    setUser(user);
    setIsLoading(false);
    return user;
  };

  const signUp = async (email: string, password: string, name?: string) => {
    await api.post("/register", { email, password, name });
  };

  const signOut = async () => {
    try {
      await api.post("/logout");
    } catch {
      // ignore the fail for deployment
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
    const res = await api.get("/owner-pets");
    return res.data.pets as Pet[];
  };

  const addPet = async (data: AddPetInput, imageFile?: File | null): Promise<Pet> => {
    let imageUrl: string | undefined = data.image;

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      const uploadRes = await api.post("/pet-image", formData);
      imageUrl = uploadRes.data.path;
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
      description: data.description || null,
      temperaments: data.temperament,
      adoption_questions: data.adoptionQuestions,
      status: "available",
      image: imageUrl,
      housing_preference: data.housingPreference || null,
      good_with_other_pets: data.goodWithOtherPets ?? null,
      required_experience: data.requiredExperience || null,
    });

    return res.data.pet as Pet;
  };

  const updatePet = async (id: number, data: EditPetInput, imageFile?: File | null): Promise<Pet> => {
    let imageUrl: string | undefined = data.image;

    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      const uploadRes = await api.post("/pet-image", formData);
      imageUrl = uploadRes.data.path;
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
      description: data.description || null,
      temperaments: data.temperament,
      adoption_questions: data.adoptionQuestions,
      status: data.status === "Available" ? "available" : data.status === "Reserved" ? "reserved" : data.status === "Adopted" ? "adopted" : "under_review",
      image: imageUrl,
      housing_preference: data.housingPreference || null,
      good_with_other_pets: data.goodWithOtherPets ?? null,
      required_experience: data.requiredExperience || null,
    });

    return res.data.pet as Pet;
  };

  const deletePet = async (id: number): Promise<void> => {
    await api.delete(`/pets/${id}`);
  };

  const getApplications = async (): Promise<OwnerApplication[]> => {
    const res = await api.get("/applications");
    const apps = res.data.applications as Array<{
      id: number;
      pet_id: number;
      status: string;
      answers: Array<{ question: string; answer: string }>;
      customer: { customer_name: string | null };
      pet: { name: string | null; species: string | null; breed: string | null };
      created_at: string;
      submitted_at: string;
    }>;
    return apps.map((app) => ({
      id: app.id,
      customer_name: app.customer?.customer_name ?? "Unknown",
      pet_name: app.pet?.name ?? "Unknown",
      pet_species: app.pet?.species ?? "",
      pet_breed: app.pet?.breed ?? "",
      pet_id: app.pet_id,
      submitted_at: app.submitted_at ?? app.created_at,
      status: app.status,
      answers: (app.answers ?? []).map((a) => ({
        question: a.question,
        answer: a.answer ?? "",
      })),
      created_at: app.created_at,
    }));
  };

  const updateApplication = async (id: number, status: string): Promise<void> => {
    await api.put(`/applications/${id}`, { status });
  };

  const getDashboardStats = async (): Promise<Record<string, unknown>> => {
    const res = await api.get('/dashboard-stats');
    return res.data.data as Record<string, unknown>;
  };

  const getRecommendations = async (): Promise<Array<Pet & { match_score: number; match_details: string[]; owner_name: string }>> => {
    const res = await api.get('/recommendations');
    return res.data.pets as Array<Pet & { match_score: number; match_details: string[]; owner_name: string }>;
  };

  const getOwnersDashboardStats = async (): Promise<{
    pet_status_breakdown: Record<string, number>;
    application_status: Record<string, number>;
    key_metrics: Record<string, number>;
    species_distribution: Record<string, number>;
  }> => {
    const res = await api.get('/dashboard-owners-stats');
    return res.data as {
      pet_status_breakdown: Record<string, number>;
      application_status: Record<string, number>;
      key_metrics: Record<string, number>;
      species_distribution: Record<string, number>;
    };
  };

  const getConversations = async (): Promise<ConversationItem[]> => {
  const res = await api.get("/conversations");
  return res.data.conversations as ConversationItem[];
};

const getMessages = async (conversationId: number): Promise<Message[]> => {
  const res = await api.get(`/conversations/${conversationId}/messages`);
  return res.data.messages as Message[];
};

const sendMessage = async (conversationId: number, body: string): Promise<void> => {
  await api.post(`/conversations/${conversationId}/messages`, { body });
};

const getUnreadCount = async (): Promise<number> => {
  const res = await api.get("/unread-count");
  return res.data.count as number;
};

const startConversation = async (ownerId: number, petId?: number): Promise<void> => {
  await api.post("/conversations", { owner_id: ownerId, pet_id: petId });
};

const getCareReminders = async (): Promise<CareReminder[]> => {
  const res = await api.get("/care-reminders");
  return res.data.reminders as CareReminder[];
};

const submitSurvey = async (reminderId: number, responses: Record<string, string>): Promise<void> => {
  await api.post(`/care-reminders/${reminderId}/survey`, { responses });
};

const getAdminUsers = async (): Promise<AdminUser[]> => {
  const res = await api.get("/admin/users");
  return res.data.users as AdminUser[];
};

const createAdminUser = async (data: { email: string; password: string; name: string; role: string }): Promise<AdminUser> => {
  const res = await api.post("/admin/users", data); 
  return res.data.user as AdminUser;
};

const updateAdminUser = async (id: number, data: Partial<{ email: string; role: string; name: string; profile_completed_at: string | null }>): Promise<AdminUser> => {
  const res = await api.put(`/admin/users/${id}`, data);
  return res.data.user as AdminUser;
};

const deleteAdminUser = async (id: number): Promise<void> => {
  await api.delete(`/admin/users/${id}`);
};

const getAdminStats = async (): Promise<AdminStats> => {
  const res = await api.get("/admin/stats");
  return res.data as AdminStats;
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
        getApplications,
        updateApplication,
        getDashboardStats,
        getRecommendations,
        getOwnersDashboardStats,
        getConversations,
        getMessages,
        sendMessage,
        getUnreadCount,
        startConversation,
        getCareReminders,
        submitSurvey,
        getAdminUsers,
        createAdminUser,
        updateAdminUser,
        deleteAdminUser,
        getAdminStats
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
