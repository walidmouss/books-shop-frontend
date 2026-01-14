"use client";

import { Navbar } from "@/components/layout/Navbar";
import { mockUser } from "@/lib/mocks/user";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // TODO: Get actual user from session/context in production
  const user = mockUser;

  return (
    <>
      <Navbar user={user} />
      <main>{children}</main>
    </>
  );
}
