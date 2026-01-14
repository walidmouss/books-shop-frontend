"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema, type LoginFormData } from "@/lib/validators/auth.schema";
import { DEMO_CREDENTIALS } from "@/lib/constants";

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void> | void;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-black dark:text-white">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          placeholder={DEMO_CREDENTIALS.EMAIL}
          {...register("email")}
          className="mt-2"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-black dark:text-white">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          className="mt-2"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
        <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">Demo Credentials</p>
        <p className="mt-1 text-xs text-blue-800 dark:text-blue-200">
          Email: <code className="font-mono">{DEMO_CREDENTIALS.EMAIL}</code>
        </p>
        <p className="text-xs text-blue-800 dark:text-blue-200">
          Password: <code className="font-mono">{DEMO_CREDENTIALS.PASSWORD}</code>
        </p>
      </div>
    </form>
  );
}
