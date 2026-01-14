"use client";

import type { Book } from "@/lib/types";
import Image from "next/image";
import { BookActions } from "@/components/books/BookActions";

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
        <Image
          src={book.thumbnail}
          alt={book.title}
          width={600}
          height={800}
          unoptimized
          className="h-full w-full object-cover"
        />
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="line-clamp-2 font-semibold text-black dark:text-white">{book.title}</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{book.author}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-500">{book.category}</p>
          <p className="pt-1 text-lg font-bold text-black dark:text-white">
            ${book.price.toFixed(2)}
          </p>
        </div>
        {(onView || onEdit || onDelete) && (
          <BookActions
            onViewAction={() => onView?.(book.id)}
            onEditAction={() => onEdit?.(book.id)}
            onDeleteAction={() => onDelete?.(book.id)}
          />
        )}
      </div>
    </div>
  );
}
