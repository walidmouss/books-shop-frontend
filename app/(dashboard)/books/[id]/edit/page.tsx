"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useBookById } from "@/lib/queries/useBookById";
import { useToast } from "@/lib/toast/ToastContext";
import { BookForm } from "@/components/forms/BookForm";
import { Button } from "@/components/ui/Button";
import type { BookFormData } from "@/lib/validators/book.schema";
import { mockUser } from "@/lib/mocks/user";

export default function EditBookPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const id = params.id as string;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, isError } = useBookById(id);

  const handleSubmit = async (formData: BookFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update book");
      }
      // Invalidate and refetch book data
      await queryClient.invalidateQueries({ queryKey: ["book", id] });
      await queryClient.invalidateQueries({ queryKey: ["books"] });
      await queryClient.invalidateQueries({ queryKey: ["myBooks"] });

      addToast({
        type: "success",
        title: "Book updated",
        description: "Your book has been updated successfully.",
      });

      router.push(`/books/${id}`);
    } catch (error) {
      addToast({
        type: "error",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update book",
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-neutral-600 dark:text-neutral-400">Loading book...</p>
      </div>
    );
  }

  if (isError || !data?.book) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-red-600 dark:text-red-400">Failed to load book.</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const { book } = data;

  // Authorization: Only the author can edit
  if (book.createdBy !== mockUser.id) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-100">Unauthorized</h2>
          <p className="mt-2 text-red-700 dark:text-red-200">
            You can only edit books that you created.
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">Edit Book</h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Update the details of your book
          </p>
        </div>
        <Button variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <BookForm
          onSubmit={handleSubmit}
          defaultValues={{
            title: book.title,
            author: book.author,
            price: book.price,
            category: book.category,
            description: book.description || "",
            thumbnail: book.thumbnail,
          }}
          submitLabel="Update Book"
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
