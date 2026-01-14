import { NextRequest, NextResponse } from "next/server";
import { mockBooks } from "@/lib/mocks/books";
import { mockUser } from "@/lib/mocks/user";
import { createBookSchema } from "@/lib/validators/book.schema";
import type { Book } from "@/lib/types";

// Mock books API endpoints with server-side search/sort/pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.max(1, parseInt(searchParams.get("pageSize") || "12", 10));
    const search = (searchParams.get("search") || "").toLowerCase();
    const sort = (searchParams.get("sort") === "desc" ? "desc" : "asc") as "asc" | "desc";

    console.log(
      `[GET /api/books] Current mockBooks count: ${mockBooks.length}, page: ${page}, search: "${search}"`,
    );
    let data = [...mockBooks];

    if (search) {
      data = data.filter((b) => b.title.toLowerCase().includes(search));
    }

    data.sort((a, b) => {
      const res = a.title.localeCompare(b.title);
      return sort === "asc" ? res : -res;
    });

    const total = data.length;
    const start = (page - 1) * pageSize;
    const items = data.slice(start, start + pageSize);

    return NextResponse.json({ items, total, page, pageSize });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = createBookSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid book data", details: validation.error.errors },
        { status: 400 },
      );
    }

    const { title, price, category, description, thumbnail } = validation.data;

    // Generate unique ID
    const id = `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    // Create new book with current user as author
    const newBook: Book = {
      id,
      title,
      author: mockUser.name,
      price,
      category,
      description: description || "",
      thumbnail,
      createdBy: mockUser.id,
      createdAt: now,
      updatedAt: now,
    };

    // Add to mock books
    mockBooks.push(newBook);
    console.log(
      `[POST /api/books] Created new book: "${title}" (id: ${id}), mockBooks count: ${mockBooks.length}, book author: ${newBook.author}`,
    );

    return NextResponse.json({ book: newBook }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/books] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
