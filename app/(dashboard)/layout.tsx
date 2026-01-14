"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import type { User } from "@/lib/types";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch current user on mount
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleViewProfile = useCallback(() => {
    router.push("/profile");
  }, [router]);

  const handleEditProfile = useCallback(() => {
    router.push("/profile/edit");
  }, [router]);

  const handleMyBooks = useCallback(() => {
    router.push("/my-books");
  }, [router]);

  const handleLogout = useCallback(async () => {
    try {
      // Call logout API to clear auth token on server
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Redirect to login regardless of API success
      await router.push("/login");
    }
  }, [router]);

  return (
    <>
      <Navbar
        user={user}
        onViewProfile={handleViewProfile}
        onEditProfile={handleEditProfile}
        onMyBooks={handleMyBooks}
        onLogout={handleLogout}
      />
      <main>{children}</main>
    </>
  );
}
