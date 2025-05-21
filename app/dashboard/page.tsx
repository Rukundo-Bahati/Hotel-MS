"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.role === "ADMIN") {
      router.push("/admin");
    } else if (user?.role === "USER") {
      router.push("/user");
    } else {
      router.push("/login");
    }
  }, [router, user, isAuthenticated]);

  return null; // or loading spinner here
}
