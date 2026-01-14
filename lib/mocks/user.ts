import type { User } from "@/lib/types";

export const mockUser: User = {
  id: "1",
  email: "admin@books.com",
  name: "Admin User",
  createdAt: new Date().toISOString(),
};
