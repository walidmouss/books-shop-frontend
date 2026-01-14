import { NextRequest, NextResponse } from "next/server";

// Mock login endpoint - will be replaced with real authentication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: Implement actual authentication logic
    // For now, just validate demo credentials
    if (email === "admin@books.com" && password === "admin123") {
      return NextResponse.json({
        user: {
          id: "1",
          email: "admin@books.com",
          name: "Admin User",
          createdAt: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
