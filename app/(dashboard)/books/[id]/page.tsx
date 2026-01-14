"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useBookById } from "@/lib/queries/useBookById";
import { useToast } from "@/lib/toast/ToastContext";
import { Button } from "@/components/ui/Button";

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const id = params.id as string;

  const { data, isLoading, isError } = useBookById(id);

  function handleEdit() {
    addToast({ type: "info", title: "Edit", description: `Edit book ${id}` });
    // TODO: Navigate to edit page
  }

  function handleDelete() {
    addToast({ type: "info", title: "Delete", description: `Delete book ${id}` });
    // TODO: Implement delete logic
  }

  function handleView() {
    addToast({ type: "info", title: "View", description: "Already viewing book details" });
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-neutral-600 dark:text-neutral-400">Loading book details...</p>
      </div>
    );
  }

  if (isError || !data?.book) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-red-600 dark:text-red-400">Failed to load book details.</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const { book } = data;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header with Actions */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleView}>
            View
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* Book Details */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          {/* Thumbnail */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
            <Image
              src={book.thumbnail}
              alt={book.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">{book.title}</h1>
              <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">{book.author}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {book.category}
              </span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${book.price.toFixed(2)}
              </span>
            </div>

            {book.description && (
              <div>
                <h2 className="mb-2 text-lg font-semibold text-black dark:text-white">
                  Description
                </h2>
                <p className="text-neutral-700 dark:text-neutral-300">{book.description}</p>
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-neutral-200 pt-4 text-sm dark:border-neutral-700">
              <div>
                <span className="font-medium text-neutral-500 dark:text-neutral-400">Created:</span>
                <p className="mt-1 text-neutral-900 dark:text-neutral-100">
                  {new Date(book.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="font-medium text-neutral-500 dark:text-neutral-400">Updated:</span>
                <p className="mt-1 text-neutral-900 dark:text-neutral-100">
                  {new Date(book.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
