"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { Button } from "@/components/ui/Button";
import type { User } from "@/lib/types";

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch current user profile
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
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
          <h1 className="text-3xl font-bold text-black dark:text-white">Edit Profile</h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">Update your name and email</p>
        </div>
      </div>

      <div className="rounded-lg border border-black/10 bg-white p-8 dark:border-white/15 dark:bg-neutral-900">
        <ProfileForm
          initialData={{
            name: user.name,
            email: user.email,
          }}
        />

        <div className="mt-6 border-t border-black/10 pt-6 dark:border-white/15">
          <Button variant="ghost" onClick={() => router.back()} className="w-full">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
