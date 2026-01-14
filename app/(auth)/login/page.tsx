"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast/ToastContext";
import { LoginForm } from "@/components/forms/LoginForm";
import { APP_NAME } from "@/lib/constants";
import type { LoginFormData } from "@/lib/validators/auth.schema";

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        addToast({
          type: "error",
          title: "Invalid credentials",
          description: "Please check your email and password",
        });
        return;
      }

      addToast({
        type: "success",
        title: "Login successful",
        description: "Redirecting to dashboard...",
      });

      // Cookie is set automatically by the server
      // Redirect to books page after a brief delay
      setTimeout(() => {
        router.push("/books");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      addToast({
        type: "error",
        title: "Something went wrong",
        description: "Please try again later",
      });
    }
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
