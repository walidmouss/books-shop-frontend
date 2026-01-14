import type { Book } from "@/lib/types";

export const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 12.99,
    category: "Fiction",
    thumbnail: "https://via.placeholder.com/150",
    description: "A classic American novel set in the Jazz Age.",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 14.99,
    category: "Fiction",
    thumbnail: "https://via.placeholder.com/150",
    description: "A novel about racial injustice in the American South.",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    price: 13.99,
    category: "Dystopian",
    thumbnail: "https://via.placeholder.com/150",
    description: "A dystopian social science fiction novel.",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
  },
];
