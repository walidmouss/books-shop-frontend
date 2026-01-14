"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CreateBookForm } from "@/components/forms/CreateBookForm";
import { useToast } from "@/lib/toast/ToastContext";
import type { CreateBookFormData } from "@/lib/validators/book.schema";

export default function CreateBookPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(data: CreateBookFormData) {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create book");
      }

      const { book } = await response.json();

      // Invalidate all book-related caches
      await queryClient.invalidateQueries({ queryKey: ["books"], exact: false });
      await queryClient.invalidateQueries({ queryKey: ["myBooks"], exact: false });
      await queryClient.invalidateQueries({ queryKey: ["book"], exact: false });

      // Prefetch the myBooks query for page 1 to ensure fresh data is available
      // when the component mounts after redirect
      await queryClient.prefetchQuery({
        queryKey: ["myBooks", 1, 12, "", "asc"],
        queryFn: async () => {
          const res = await fetch("/api/books/my-books?page=1&pageSize=12&sort=asc");
          if (!res.ok) throw new Error("Failed to fetch books");
          return res.json();
        },
      });

      addToast({
        type: "success",
        title: "Book created",
        description: `"${book.title}" has been created successfully.`,
      });

      // Redirect to my books page
      router.push("/my-books");
    } catch (error) {
      addToast({
        type: "error",
        title: "Creation failed",
        description: error instanceof Error ? error.message : "Failed to create book",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">Create New Book</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Add a new book to your collection
        </p>
      </div>

      <div className="rounded-lg border border-black/10 bg-white p-6 dark:border-white/15 dark:bg-neutral-900">
        <CreateBookForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </div>
  );
}
