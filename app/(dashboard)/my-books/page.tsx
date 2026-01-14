"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { BookCard } from "@/components/books/BookCard";
import { BookFilters } from "@/components/books/BookFilters";
import { Pagination } from "@/components/ui/Pagination";
import { useMyBooks } from "@/lib/queries/useMyBooks";
import { useToast } from "@/lib/toast/ToastContext";
import { mockUser } from "@/lib/mocks/user";

export default function MyBooksPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
    router.push(`/books/${id}`);
  }
  function onEdit(id: string) {
    router.push(`/books/${id}/edit`);
  }
  async function onDelete(id: string) {
    const book = processed.pageItems.find((b) => b.id === id);
    if (!book) return;

    // Authorization check: Only author can delete (should always be true in My Books)
    if (book.author !== mockUser.name) {
      addToast({
        type: "error",
        title: "Unauthorized",
        description: "You can only delete books that you authored.",
      });
      return;
    }

    // Confirmation dialog
    if (!window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      // Invalidate all book-related caches and force fresh data fetch
      await queryClient.invalidateQueries({ queryKey: ["books"] });
      await queryClient.invalidateQueries({ queryKey: ["myBooks"] });
      await queryClient.invalidateQueries({ queryKey: ["book"] });

      // Explicitly refetch the current page
      await refetch();

      addToast({
        type: "success",
        title: "Book deleted",
        description: "The book has been deleted successfully.",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete book",
      });
    } finally {
      setDeletingId(null);
    }
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
              isDeletingId={deletingId}
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
