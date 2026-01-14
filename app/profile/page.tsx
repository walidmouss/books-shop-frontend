"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { User } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the current user profile
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-neutral-600 dark:text-neutral-400">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-red-600 dark:text-red-400">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">My Profile</h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            View your account information
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Info Card */}
        <div className="rounded-lg border border-black/10 bg-white p-8 dark:border-white/15 dark:bg-neutral-900">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white dark:bg-white dark:text-black">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white">{user.name}</h2>
              <p className="text-neutral-600 dark:text-neutral-400">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4 border-t border-black/10 pt-6 dark:border-white/15">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Name
              </label>
              <p className="mt-1 text-lg text-black dark:text-white">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Email
              </label>
              <p className="mt-1 text-lg text-black dark:text-white">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Member Since
              </label>
              <p className="mt-1 text-lg text-black dark:text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Button onClick={() => router.push("/profile/edit")}>Edit Profile</Button>
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
