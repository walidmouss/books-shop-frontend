import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    // Clear the auth token cookie
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      maxAge: 0,
      sameSite: "strict",
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
