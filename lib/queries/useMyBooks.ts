"use client";

import { useQuery } from "@tanstack/react-query";
import type { Book } from "@/lib/types";

export type MyBooksQuery = {
  page: number;
  pageSize: number;
  search: string;
  sort: "asc" | "desc";
  category?: string;
  minPrice?: number;
  maxPrice?: number;
};

export type BooksResponse = {
  items: Book[];
  total: number;
  page: number;
  pageSize: number;
};

async function fetchMyBooks(params: MyBooksQuery): Promise<BooksResponse> {
  const { page, pageSize, search, sort, category, minPrice, maxPrice } = params;
  const query = new URLSearchParams();
  if (search) query.set("search", search);
  if (category) query.set("category", category);
  if (minPrice !== undefined) query.set("minPrice", String(minPrice));
  if (maxPrice !== undefined) query.set("maxPrice", String(maxPrice));
  query.set("page", String(page));
  query.set("pageSize", String(pageSize));
  query.set("sort", sort);

  const res = await fetch(`/api/books/my-books?${query.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch my books");
  }

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

export function useMyBooks(params: MyBooksQuery) {
  return useQuery<BooksResponse>({
    queryKey: [
      "myBooks",
      params.page,
      params.pageSize,
      params.search,
      params.sort,
      params.category,
      params.minPrice,
      params.maxPrice,
    ],
    queryFn: () => fetchMyBooks(params),
  });
}
