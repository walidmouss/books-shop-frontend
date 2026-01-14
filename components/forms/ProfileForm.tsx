"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/lib/toast/ToastContext";

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Please enter a valid email"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialData: ProfileFormData;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      addToast({
        type: "success",
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      // Reload the page to get updated user data
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      addToast({
        type: "error",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-black dark:text-white">
          Name *
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Your name"
          {...register("name")}
          className="mt-1"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-black dark:text-white">
          Email *
        </label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          {...register("email")}
          className="mt-1"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  );
}
