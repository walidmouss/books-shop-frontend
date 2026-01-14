"use client";
import { useMemo, useState } from "react";
import { BookGrid } from "@/components/books/BookGrid";
import { BookFilters } from "@/components/books/BookFilters";
import { Pagination } from "@/components/ui/Pagination";
import { useBooks } from "@/lib/queries/useBooks";
import { useToast } from "@/lib/toast/ToastContext";

export default function BooksPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const { addToast } = useToast();

  const { data, isLoading, isError, refetch, isFetching } = useBooks({
    page,
    pageSize,
    search,
    sort,
  });

  const processed = useMemo(() => {
    // Server-side pagination/filter/sort: just use what the API returns
    const items = data?.items ?? [];
    const total = data?.total ?? 0;
    return { total, pageItems: items };
  }, [data]);

  function onFiltersChange(v: { search: string; sort: "asc" | "desc" }) {
    setSearch(v.search);
    setSort(v.sort);
    setPage(1);
  }

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
        <h1 className="text-3xl font-bold text-black dark:text-white">Books Shop</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Browse our collection of books
        </p>
      </div>

      <div className="mb-6 rounded-lg border border-black/10 bg-white p-4 dark:border-white/15 dark:bg-neutral-900">
        <BookFilters initialSearch={search} initialSort={sort} onChangeAction={onFiltersChange} />
      </div>

      {isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <div className="flex items-center justify-between gap-4">
            <p>Failed to load books. Please try again.</p>
            <button
              onClick={() => refetch()}
              className="rounded border border-red-300 px-3 py-1.5 text-sm hover:bg-red-100 dark:border-red-700 dark:hover:bg-red-900/30"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <BookGrid
          books={processed.pageItems}
          isLoading={isLoading || isFetching}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
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
