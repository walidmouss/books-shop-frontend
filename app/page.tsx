import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export default function HomePage() {
  // Redirect to login by default
  // In production, check auth state and redirect accordingly
  redirect(ROUTES.LOGIN);
}
