import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = ["/books", "/my-books", "/profile"];
// Routes only for guests (unauthenticated)
const AUTH_ROUTES = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookies (will be set on successful login)
  const token = request.cookies.get("auth-token")?.value;
  const isAuthenticated = !!token;

  // Redirect authenticated users away from login page
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route)) && isAuthenticated) {
    return NextResponse.redirect(new URL("/books", request.url));
  }

  // Redirect unauthenticated users to login when accessing protected routes
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
