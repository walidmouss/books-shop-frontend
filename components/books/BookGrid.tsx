"use client";

import type { Book } from "@/lib/types";
import { BookCard } from "./BookCard";

export interface BookGridProps {
  books: Book[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

export function BookGrid({ books, onView, onEdit, onDelete, isLoading }: BookGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-96 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800"
          />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="rounded-lg border border-black/10 bg-white p-12 text-center dark:border-white/15 dark:bg-neutral-900">
        <p className="text-neutral-600 dark:text-neutral-400">No books found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onView={onView} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
