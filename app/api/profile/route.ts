import { NextRequest, NextResponse } from "next/server";

// Mock profile endpoint - get and update user profile
export async function GET() {
  try {
    // TODO: Get current user profile from database
    return NextResponse.json({
      user: {
        id: "1",
        email: "admin@books.com",
        name: "Admin User",
        createdAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: Validate and update user profile in database
    return NextResponse.json({
      user: {
        id: "1",
        ...body,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
