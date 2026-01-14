"use client";

import { useQuery } from "@tanstack/react-query";
import type { Book } from "@/lib/types";

export type BooksQuery = {
  page: number;
  pageSize: number;
  search: string;
  sort: "asc" | "desc";
};

export type BooksResponse = {
  items: Book[];
  total: number;
  page: number;
  pageSize: number;
};

async function fetchBooks(params: BooksQuery): Promise<BooksResponse> {
  const { page, pageSize, search, sort } = params;
  const query = new URLSearchParams();
  if (search) query.set("search", search);
  query.set("page", String(page));
  query.set("pageSize", String(pageSize));
  query.set("sort", sort);

  const res = await fetch(`/api/books?${query.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  // Support both array responses and object responses while server is WIP
  const raw = await res.json();
  if (Array.isArray(raw)) {
    return { items: raw as Book[], total: raw.length, page, pageSize };
  }
  const obj = raw as Partial<BooksResponse> & { items?: Book[] };
  return {
    items: obj.items ?? [],
    total: typeof obj.total === "number" ? obj.total : (obj.items?.length ?? 0),
    page: typeof obj.page === "number" ? obj.page : page,
    pageSize: typeof obj.pageSize === "number" ? obj.pageSize : pageSize,
  };
}

export function useBooks(params: BooksQuery) {
  return useQuery<BooksResponse>({
    queryKey: ["books", params.page, params.pageSize, params.search, params.sort],
    queryFn: () => fetchBooks(params),
  });
}
