import { NextRequest, NextResponse } from "next/server";
import { mockBooks } from "@/lib/mocks/books";
import { mockUser } from "@/lib/mocks/user";

// Mock my books endpoint with server-side search/sort/pagination, filtered by createdBy
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.max(1, parseInt(searchParams.get("pageSize") || "12", 10));
    const search = (searchParams.get("search") || "").toLowerCase();
    const sort = (searchParams.get("sort") === "desc" ? "desc" : "asc") as "asc" | "desc";

    // Filter books created by current user
    let data = mockBooks.filter((b) => b.createdBy === mockUser.id);

    // Apply search by title
    if (search) {
      data = data.filter((b) => b.title.toLowerCase().includes(search));
    }

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
