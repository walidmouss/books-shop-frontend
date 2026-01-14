import { NextResponse } from "next/server";
import { mockBooks } from "@/lib/mocks/books";

// Mock my books endpoint - returns books authored by current user
export async function GET() {
  try {
    // TODO: Get current user ID and filter books by author
    return NextResponse.json({ books: mockBooks });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
