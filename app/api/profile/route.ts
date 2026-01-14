import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { mockUser } from "@/lib/mocks/user";

const updateProfileSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
});

// Mock profile endpoint - get and update user profile
export async function GET() {
  try {
    return NextResponse.json({
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = updateProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid profile data", details: validation.error.errors },
        { status: 400 },
      );
    }

    const { name, email } = validation.data;

    // Update mock user (in production, this would update the database)
    mockUser.name = name;
    mockUser.email = email;

    console.log(`[PUT /api/profile] User profile updated: name="${name}", email="${email}"`);

    return NextResponse.json(
      {
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          createdAt: mockUser.createdAt,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[PUT /api/profile] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
