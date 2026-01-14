import { NextRequest, NextResponse } from "next/server";
import { mockBooks } from "@/lib/mocks/books";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    // TODO: Fetch from real database
    const book = mockBooks.find((b) => b.id === id);

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ book });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const bookIndex = mockBooks.findIndex((b) => b.id === id);

    if (bookIndex === -1) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const body = await request.json();
    const existingBook = mockBooks[bookIndex];

    // Update the book in the mock array (simulating database update)
    const updatedBook = {
      ...existingBook,
      ...body,
      id, // Ensure id doesn't change
      updatedAt: new Date().toISOString(),
    };

    mockBooks[bookIndex] = updatedBook;

    return NextResponse.json({ book: updatedBook });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    console.log(
      `[DELETE] Deleting book with id: ${id}, mockBooks length before: ${mockBooks.length}`,
    );
    const bookIndex = mockBooks.findIndex((b) => b.id === id);

    if (bookIndex === -1) {
      console.log(`[DELETE] Book not found with id: ${id}`);
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Remove the book from the mock array (simulating database deletion)
    const deletedBook = mockBooks[bookIndex];
    mockBooks.splice(bookIndex, 1);
    console.log(
      `[DELETE] Successfully deleted book: ${deletedBook.title}, mockBooks length after: ${mockBooks.length}`,
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
