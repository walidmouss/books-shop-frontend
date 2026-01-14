import { NextRequest, NextResponse } from "next/server";
import { mockBooks } from "@/lib/mocks/books";

// Mock books API endpoints
export async function GET() {
  try {
    // TODO: Fetch from real database
    // Support query params for search, filter, pagination
    return NextResponse.json({ books: mockBooks });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: Validate and create book in database
    return NextResponse.json({ book: { id: "new", ...body } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
