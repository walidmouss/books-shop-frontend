import { NextResponse } from "next/server";

// Mock current user endpoint - will be replaced with real session management
export async function GET() {
  try {
    // TODO: Get user from session/token
    // For now, return mock user
    return NextResponse.json({
      user: {
        id: "1",
        email: "admin@books.com",
        name: "Admin User",
        createdAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
