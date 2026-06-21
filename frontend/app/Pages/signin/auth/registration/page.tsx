"use client"

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Dog, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES, signinWithCallback } from "@/lib/routes";
import { getApiErrorMessage } from "@/lib/api-error";
import Image from "next/image";
import Link from "next/link";

export default function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password);
      const callback = searchParams.get("callback");
      router.replace(callback ? signinWithCallback(callback) : ROUTES.signin);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Registration failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-orange-400/40 z-10" />
        <Image
          src="/img/cat-dog.jpg"
          alt="Cats and dogs waiting for adoption"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-15 left-40 z-20 text-white max-w-xl">
          <h2 className="text-4xl font-semibold pb-6">
            &quot;Adopting Mochi changed our whole family. The screening process gave us confidence that it was the right fit.&quot;
          </h2>
          <p className="text-xl text-white/80">
            — Carmen L., Adopter since 2025
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col p-8 bg-[#FFFAF4]">
        <div className="w-full flex justify-start mb-10">
          <Link
            href={ROUTES.home}
            className="cursor-pointer text-sm text-[#7A6150] hover:text-gray-900 gap-2 flex items-center"
          >
            <ArrowLeft height="15" width="15" /> Back to home
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full">
            <div className="flex items-center w-full pb-10">
              <div>
                <div className="bg-[#ebd0c2] p-3 rounded-full mr-2">
                  <Dog className="h-6 w-6 text-[#C4622D]" />
                </div>
              </div>
              <div className="ml-0 text-start pb-2 w-full">
                <div className="text-xl text-gray-900 font-semibold">
                  Adoptify
                </div>
              </div>
            </div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Create Account</h1>
              <p className="mt-2 text-sm text-[#7A6150]">
                Register and join thousands of families who found their perfect pet.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-[#F2E8DB]"
                  placeholder="you@example.com"
                />
              </div>
              <div className="relative w-full">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="flex items-center gap-2 relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent pr-10 bg-[#F2E8DB]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 cursor-pointer text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#C4622D] text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#7A6150]">
              Already have an account?{" "}
              <a
                href={ROUTES.signin}
                className="text-[#C4622D] font-medium hover:underline cursor-pointer"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
