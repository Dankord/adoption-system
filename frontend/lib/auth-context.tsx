"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import api from "@/lib/api";
import { ROUTES, UserRole } from "@/lib/routes";

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

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const res = await api.get("/user");
        if (mounted) {
          setUser(res.data.user);
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
    setUser(res.data.user);
    return res.data.user as User;
  };

  const signUp = async (email: string, password: string) => {
    await api.post("/register", { email, password });
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
    setUser(res.data.user);
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
