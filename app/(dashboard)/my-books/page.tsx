import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Books - Books Shop",
  description: "Manage your book collection",
};

export default function MyBooksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">My Books</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Books you&apos;ve added to the collection
        </p>
      </div>

      <div className="rounded-lg border border-black/10 bg-white p-8 text-center dark:border-white/15 dark:bg-neutral-900">
        <p className="text-neutral-600 dark:text-neutral-400">Your books will appear here...</p>
      </div>
    </div>
  );
}
