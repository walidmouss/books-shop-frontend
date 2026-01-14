import { NextRequest, NextResponse } from "next/server";
import { mockBooks } from "@/lib/mocks/books";

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
    // TODO: Validate and create book in database
    return NextResponse.json({ book: { id: "new", ...body } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
