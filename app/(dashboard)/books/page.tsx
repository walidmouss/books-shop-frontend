import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books Shop",
  description: "Browse and manage your books",
};

export default function BooksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">Books Shop</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Browse our collection of books
        </p>
      </div>

      <div className="rounded-lg border border-black/10 bg-white p-8 text-center dark:border-white/15 dark:bg-neutral-900">
        <p className="text-neutral-600 dark:text-neutral-400">
          Books grid with filters, search, and pagination coming soon...
        </p>
      </div>
    </div>
  );
}
