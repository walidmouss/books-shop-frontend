import { useQuery } from "@tanstack/react-query";
import type { Book } from "@/lib/types";

export function useBookById(id: string) {
  return useQuery<{ book: Book }>({
    queryKey: ["book", id],
    queryFn: async () => {
      const res = await fetch(`/api/books/${id}`);
      if (!res.ok) throw new Error("Failed to fetch book");
      return res.json();
    },
    enabled: !!id,
  });
}
