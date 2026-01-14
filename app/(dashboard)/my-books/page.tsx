"use client";

import { useCallback, useMemo, useState } from "react";
import { BookCard } from "@/components/books/BookCard";
import { BookFilters } from "@/components/books/BookFilters";
import { Pagination } from "@/components/ui/Pagination";
import { useMyBooks } from "@/lib/queries/useMyBooks";
import { useToast } from "@/lib/toast/ToastContext";

export default function MyBooksPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const { addToast } = useToast();

  const { data, isLoading, isError, refetch, isFetching } = useMyBooks({
    page,
    pageSize,
    search,
    sort,
  });

  const processed = useMemo(() => {
    const items = data?.items ?? [];
    const total = data?.total ?? 0;
    return { total, pageItems: items };
  }, [data]);

  const onFiltersChange = useCallback((v: { search: string; sort: "asc" | "desc" }) => {
    setSearch(v.search);
    setSort(v.sort);
    setPage(1);
  }, []);

  function onView(id: string) {
    addToast({ type: "info", title: "View", description: `Open details for ${id}` });
  }
  function onEdit(id: string) {
    addToast({ type: "info", title: "Edit", description: `Edit book ${id}` });
  }
  function onDelete(id: string) {
    addToast({ type: "info", title: "Delete", description: `Delete book ${id}` });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">My Books</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">Manage your published books</p>
      </div>

      <div className="mb-6 rounded-lg border border-black/10 bg-white p-4 dark:border-white/15 dark:bg-neutral-900">
        <BookFilters initialSearch={search} initialSort={sort} onChangeAction={onFiltersChange} />
      </div>

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <div className="flex items-center justify-between gap-4">
            <p>Failed to load your books. Please try again.</p>
            <button
              onClick={() => refetch()}
              className="rounded border border-red-300 px-3 py-1.5 text-sm hover:bg-red-100 dark:border-red-700 dark:hover:bg-red-900/30"
            >
              Retry
            </button>
          </div>
        </div>
      ) : isLoading || isFetching ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-96 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800"
            />
          ))}
        </div>
      ) : processed.pageItems.length === 0 ? (
        <div className="rounded-lg border border-black/10 bg-white p-12 text-center dark:border-white/15 dark:bg-neutral-900">
          <p className="text-neutral-600 dark:text-neutral-400">
            You haven&apos;t published any books yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {processed.pageItems.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <div className="mt-8">
        <Pagination
          page={page}
          pageSize={pageSize}
          total={processed.total}
          onPageChangeAction={setPage}
        />
      </div>
    </div>
  );
}
