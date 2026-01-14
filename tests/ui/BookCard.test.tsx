import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type React from "react";
import { BookCard } from "@/components/books/BookCard";
import type { Book } from "@/lib/types";
import { mockUser } from "@/lib/mocks/user";

vi.mock("next/image", () => ({
  __esModule: true,
  default: () => <span data-testid="next-image" />,
}));

const mockBook: Book = {
  id: "1",
  title: "Test Book",
  author: mockUser.name,
  price: 10,
  category: "Fiction",
  thumbnail: "https://example.com/cover.jpg",
  createdBy: mockUser.id,
  description: "desc",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-02",
};

describe("BookCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders book details", () => {
    render(<BookCard book={mockBook} />);
    expect(screen.getByText(/Test Book/i)).toBeInTheDocument();
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(/Fiction/i)).toBeInTheDocument();
    expect(screen.getByText("$10.00")).toBeInTheDocument();
  });

  it("calls action handlers from the actions menu", () => {
    const onView = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <BookCard
        book={mockBook}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        isDeletingId={null}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /actions/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /view/i }));
    expect(onView).toHaveBeenCalledWith("1");

    fireEvent.click(screen.getByRole("button", { name: /actions/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith("1");

    fireEvent.click(screen.getByRole("button", { name: /actions/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith("1");
  });
});
