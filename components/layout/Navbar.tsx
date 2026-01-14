"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProfileMenu } from "./ProfileMenu";
import { APP_NAME, ROUTES } from "@/lib/constants";
import type { User } from "@/lib/types";

export interface NavbarProps {
  user: User | null;
  onViewProfile?: () => void;
  onEditProfile?: () => void;
  onLogout?: () => void;
}

export function Navbar({ user, onViewProfile, onEditProfile, onLogout }: NavbarProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleViewProfile = useCallback(() => {
    onViewProfile?.();
  }, [onViewProfile]);

  const handleEditProfile = useCallback(() => {
    onEditProfile?.();
  }, [onEditProfile]);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      // Call logout callback which will redirect to /login
      if (onLogout) {
        await Promise.resolve(onLogout());
      } else {
        // Fallback if no callback provided
        await router.push(ROUTES.LOGIN);
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoading(false);
    }
  }, [onLogout, router]);

  return (
    <header className="border-b border-black/10 bg-white dark:border-white/15 dark:bg-neutral-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href={user ? ROUTES.BOOKS : ROUTES.HOME} className="flex items-center">
          <h1 className="text-2xl font-bold text-black dark:text-white">📚 {APP_NAME}</h1>
        </Link>

        {user && !isLoading && (
          <ProfileMenu
            user={user}
            onViewProfile={handleViewProfile}
            onEditProfile={handleEditProfile}
            onLogout={handleLogout}
          />
        )}

        {isLoading && (
          <div className="text-sm text-neutral-600 dark:text-neutral-400">Logging out...</div>
        )}
      </div>
    </header>
  );
}
