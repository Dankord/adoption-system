"use client";

import { useState, Suspense } from "react";
import { useAuth, type User } from "@/lib/auth-context";
import {
  ROUTES,
  canAccessPath,
  defaultAuthenticatedPath,
  isProtectedPath,
} from "@/lib/routes";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Dog, ArrowLeft } from "lucide-react";
import Link from "next/link";


function resolvePostLoginPath(callback: string | null, user: User): string {
  if (
    callback &&
    isProtectedPath(callback) &&
    canAccessPath(callback, user.role)
  ) {
    return callback;
  }

  return defaultAuthenticatedPath(
    user.role,
    Boolean(user.profile_completed_at),
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await signIn(email, password);
      const callback = searchParams.get("callback");
      router.replace(resolvePostLoginPath(callback, user));
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("401")) {
        setError("Invalid email or password");
      } else {
        setError("Something went wrong. Please try again.");
      }
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
            className="text-sm text-[#7A6150] hover:text-gray-900 gap-2 flex items-center"
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
                  Paws & Hearts
                </div>
              </div>
            </div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Welcome Back!</h1>
              <p className="mt-2 text-sm text-[#7A6150]">
                Sign in to continue your adoption journey.
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C4622D] text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a
              href={ROUTES.registration}
              className="text-[#C4622D] font-medium hover:underline"
            >
              Register here
            </a>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
