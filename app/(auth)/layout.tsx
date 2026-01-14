import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Books Shop",
  description: "Sign in to your Books Shop account",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
