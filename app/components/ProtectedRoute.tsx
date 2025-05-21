"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!allowedRoles.includes(user?.role || "")) {
      router.push("/login"); // or "/unauthorized" if you create it
    }
  }, [isAuthenticated, user, router, allowedRoles]);

  if (!isAuthenticated || !allowedRoles.includes(user?.role || "")) {
    return null; // loading or nothing while redirecting
  }

  return <>{children}</>;
}
