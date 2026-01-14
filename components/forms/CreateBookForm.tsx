"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  BOOK_CATEGORIES,
  createBookSchema,
  type CreateBookFormData,
} from "@/lib/validators/book.schema";

export interface CreateBookFormProps {
  onSubmit: (data: CreateBookFormData) => Promise<void> | void;
  isLoading?: boolean;
}

export function CreateBookForm({ onSubmit, isLoading = false }: CreateBookFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBookFormData>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: "",
      price: 0,
      category: "Technology",
      description: "",
      thumbnail: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-black dark:text-white">
          Title *
        </label>
        <Input
          id="title"
          type="text"
          placeholder="Enter book title"
          {...register("title")}
          className="mt-2"
          disabled={isLoading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-black dark:text-white">
            Price *
          </label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            {...register("price")}
            className="mt-2"
            disabled={isLoading}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-black dark:text-white"
          >
            Category *
          </label>
          <select
            id="category"
            {...register("category")}
            className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:bg-neutral-900 dark:text-white dark:focus:border-white dark:focus:ring-white/5"
            disabled={isLoading}
          >
            {BOOK_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="thumbnail" className="block text-sm font-medium text-black dark:text-white">
          Thumbnail URL *
        </label>
        <Input
          id="thumbnail"
          type="url"
          placeholder="https://example.com/image.jpg"
          {...register("thumbnail")}
          className="mt-2"
          disabled={isLoading}
        />
        {errors.thumbnail && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.thumbnail.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-black dark:text-white"
        >
          Description *
        </label>
        <textarea
          id="description"
          {...register("description")}
          placeholder="Enter book description"
          rows={4}
          disabled={isLoading}
          className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-black placeholder-neutral-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:bg-neutral-900 dark:text-white dark:focus:border-white dark:focus:ring-white/5"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Book"}
        </Button>
      </div>
    </form>
  );
}
