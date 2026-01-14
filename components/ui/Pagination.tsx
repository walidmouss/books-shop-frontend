"use client";

import { cn } from "@/lib/utils";

export function Pagination({
  page,
  pageSize,
  total,
  onPageChangeAction,
  className,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChangeAction: (page: number) => void;
  className?: string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  // Build a small page window
  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <button
        className={cn(
          "rounded-md border px-3 py-1 text-sm",
          canPrev
            ? "border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            : "cursor-not-allowed border-neutral-200 text-neutral-400 dark:border-neutral-800 dark:text-neutral-600",
        )}
        disabled={!canPrev}
        onClick={() => canPrev && onPageChangeAction(page - 1)}
      >
        Prev
      </button>
      {start > 1 ? (
        <>
          <button
            className="rounded-md border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            onClick={() => onPageChangeAction(1)}
          >
            1
          </button>
          {start > 2 ? <span className="px-1 text-neutral-400">…</span> : null}
        </>
      ) : null}
      {pages.map((p) => (
        <button
          key={p}
          className={cn(
            "rounded-md border px-3 py-1 text-sm",
            p === page
              ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900"
              : "border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800",
          )}
          onClick={() => onPageChangeAction(p)}
        >
          {p}
        </button>
      ))}
      {end < totalPages ? (
        <>
          {end < totalPages - 1 ? <span className="px-1 text-neutral-400">…</span> : null}
          <button
            className="rounded-md border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            onClick={() => onPageChangeAction(totalPages)}
          >
            {totalPages}
          </button>
        </>
      ) : null}
      <button
        className={cn(
          "rounded-md border px-3 py-1 text-sm",
          canNext
            ? "border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            : "cursor-not-allowed border-neutral-200 text-neutral-400 dark:border-neutral-800 dark:text-neutral-600",
        )}
        disabled={!canNext}
        onClick={() => canNext && onPageChangeAction(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
