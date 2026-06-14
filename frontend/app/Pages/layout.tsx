"use client";

import { AuthGuard } from "@/lib/auth-guard";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
