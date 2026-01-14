"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/forms/LoginForm";
import { APP_NAME } from "@/lib/constants";
import type { LoginFormData } from "@/lib/validators/auth.schema";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: LoginFormData) => {
    // Simulate API call
    console.debug("Login attempt with:", { email: data.email });
    await new Promise((resolve) => setTimeout(resolve, 800));

    // For now, just redirect to books page
    // In production, this would call a server action for authentication
    router.push("/books");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-black">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-black dark:text-white">📚 {APP_NAME}</h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">Sign in to your account</p>
        </div>

        <div className="rounded-lg border border-black/10 bg-white p-8 shadow-sm dark:border-white/15 dark:bg-neutral-900">
          <LoginForm onSubmit={handleLogin} />
        </div>

        <p className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          For demo purposes, use the credentials shown in the form above.
        </p>
      </div>
    </div>
  );
}
