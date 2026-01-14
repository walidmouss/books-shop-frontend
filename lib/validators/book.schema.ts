import { z } from "zod";

export const BOOK_CATEGORIES = [
  "Technology",
  "Science",
  "History",
  "Fantasy",
  "Biography",
] as const;

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  author: z
    .string()
    .min(1, "Author is required")
    .max(100, "Author must be less than 100 characters"),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0")
    .max(10000, "Price must be less than $10,000"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must be less than 50 characters"),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional(),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
});

export type BookFormData = z.infer<typeof bookSchema>;

// Schema for creating a new book (without author, as it's set by the server)
export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0")
    .max(10000, "Price must be less than $10,000"),
  category: z.enum(BOOK_CATEGORIES, {
    errorMap: () => ({ message: `Category must be one of: ${BOOK_CATEGORIES.join(", ")}` }),
  }),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
});

export type CreateBookFormData = z.infer<typeof createBookSchema>;
