"use client";

import type { Book } from "@/lib/types";

export interface BookCardProps {
  book: Book;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function BookCard({ book, onView, onEdit, onDelete }: BookCardProps) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-4 dark:border-white/15 dark:bg-neutral-900">
      <div className="aspect-[3/4] overflow-hidden rounded bg-neutral-100 dark:bg-neutral-800">
        <img src={book.thumbnail} alt={book.title} className="h-full w-full object-cover" />
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="font-semibold text-black dark:text-white">{book.title}</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{book.author}</p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{book.category}</p>
        <p className="text-lg font-bold text-black dark:text-white">${book.price.toFixed(2)}</p>
      </div>

      <div className="mt-4 flex gap-2">
        {onView && (
          <button
            onClick={() => onView(book.id)}
            className="flex-1 rounded border border-black/10 px-3 py-1.5 text-sm text-black hover:bg-neutral-50 dark:border-white/15 dark:text-white dark:hover:bg-neutral-800"
          >
            View
          </button>
        )}
        {onEdit && (
          <button
            onClick={() => onEdit(book.id)}
            className="flex-1 rounded border border-black/10 px-3 py-1.5 text-sm text-black hover:bg-neutral-50 dark:border-white/15 dark:text-white dark:hover:bg-neutral-800"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(book.id)}
            className="flex-1 rounded border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
