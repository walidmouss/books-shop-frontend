import { NextRequest, NextResponse } from "next/server";
import { mockBooks } from "@/lib/mocks/books";
import { mockUser } from "@/lib/mocks/user";

// Mock my books endpoint with server-side search/sort/pagination, filtered by author
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.max(1, parseInt(searchParams.get("pageSize") || "12", 10));
    const search = (searchParams.get("search") || "").toLowerCase();
    const sort = (searchParams.get("sort") === "desc" ? "desc" : "asc") as "asc" | "desc";
    const category = searchParams.get("category") || "";
    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "Infinity");

    // Filter books by current user ID instead of author name
    // This ensures books remain associated with the user even if they change their name
    let data = mockBooks.filter((b) => b.createdBy === mockUser.id);

    console.log(
      `[GET /api/books/my-books] Total mockBooks: ${mockBooks.length}, Current user: ${mockUser.name}, My books: ${data.length}, page: ${page}`,
    );

    // Apply search by title
    if (search) {
      data = data.filter((b) => b.title.toLowerCase().includes(search));
    }

    // Apply category filter
    if (category) {
      data = data.filter((b) => b.category === category);
    }

    // Apply price range filter
    data = data.filter((b) => b.price >= minPrice && b.price <= maxPrice);

    // Apply sort by title
    data.sort((a, b) => {
      const res = a.title.localeCompare(b.title);
      return sort === "asc" ? res : -res;
    });

    // Apply pagination
    const total = data.length;
    const start = (page - 1) * pageSize;
    const items = data.slice(start, start + pageSize);

    return NextResponse.json({ items, total, page, pageSize });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
