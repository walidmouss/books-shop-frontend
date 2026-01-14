import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type React from "react";
import BooksPage from "@/app/(dashboard)/books/page";
import { ToastProvider } from "@/lib/toast/ToastContext";
import type { Book } from "@/lib/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: () => <span data-testid="next-image" />,
}));

const mockUseBooks = vi.fn();
vi.mock("@/lib/queries/useBooks", () => ({
  useBooks: (params: { page: number; pageSize: number; search: string; sort: "asc" | "desc" }) =>
    mockUseBooks(params),
}));

describe("BooksPage", () => {
  const items: Book[] = [
    {
      id: "1",
      title: "Book One",
      author: "Author A",
      price: 10,
      category: "Cat",
      thumbnail: "https://example.com/a.jpg",
      createdBy: "u1",
      description: "",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-02",
    },
    {
      id: "2",
      title: "Book Two",
      author: "Author B",
      price: 12,
      category: "Cat",
      thumbnail: "https://example.com/b.jpg",
      createdBy: "u2",
      description: "",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-02",
    },
  ];

  beforeEach(() => {
    mockUseBooks.mockReset();
    mockUseBooks.mockReturnValue({
      data: { items, total: 20, page: 1, pageSize: 12 },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isFetching: false,
    });
  });

  it("renders books and pagination", () => {
    render(
      <ToastProvider>
        <BooksPage />
      </ToastProvider>,
    );

    expect(screen.getByText(/books shop/i)).toBeInTheDocument();
    expect(screen.getByText(/Book One/)).toBeInTheDocument();
    expect(screen.getByText(/Book Two/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("calls useBooks with updated page when clicking Next", () => {
    render(
      <ToastProvider>
        <BooksPage />
      </ToastProvider>,
    );

    const next = screen.getByRole("button", { name: /next/i });
    fireEvent.click(next);

    const lastCallArgs = mockUseBooks.mock.calls[mockUseBooks.mock.calls.length - 1][0];
    expect(lastCallArgs.page).toBe(2);
  });
});
