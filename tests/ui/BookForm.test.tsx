import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookForm } from "@/components/forms/BookForm";

describe("BookForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders all form fields", () => {
    render(<BookForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/thumbnail url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it("displays default values when provided", () => {
    const defaultValues = {
      title: "Test Book",
      author: "Test Author",
      price: 19.99,
      category: "Programming",
      thumbnail: "https://example.com/image.jpg",
      description: "Test description",
    };

    render(<BookForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);

    expect(screen.getByDisplayValue("Test Book")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test Author")).toBeInTheDocument();
    expect(screen.getByDisplayValue("19.99")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Programming")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://example.com/image.jpg")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test description")).toBeInTheDocument();
  });

  it("shows validation errors for required fields", async () => {
    const user = userEvent.setup();
    render(<BookForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole("button", { name: /save book/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/author is required/i)).toBeInTheDocument();
    expect(screen.getByText(/category is required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("validates price is a positive number", async () => {
    const user = userEvent.setup();
    render(<BookForm onSubmit={mockOnSubmit} />);

    const priceInput = screen.getByLabelText(/price/i);
    await user.type(priceInput, "-10");

    const submitButton = screen.getByRole("button", { name: /save book/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/price must be greater than 0/i)).toBeInTheDocument();
    });
  });

  it("validates thumbnail URL format", async () => {
    const user = userEvent.setup();
    render(<BookForm onSubmit={mockOnSubmit} />);

    const thumbnailInput = screen.getByLabelText(/thumbnail url/i);
    await user.type(thumbnailInput, "not-a-valid-url");

    const submitButton = screen.getByRole("button", { name: /save book/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/thumbnail must be a valid url/i)).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    render(<BookForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/title/i), "New Book");
    await user.type(screen.getByLabelText(/author/i), "New Author");
    await user.type(screen.getByLabelText(/price/i), "29.99");
    await user.type(screen.getByLabelText(/category/i), "Fiction");
    await user.type(screen.getByLabelText(/thumbnail url/i), "https://example.com/book.jpg");
    await user.type(screen.getByLabelText(/description/i), "A great book");

    const submitButton = screen.getByRole("button", { name: /save book/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "New Book",
          author: "New Author",
          price: 29.99,
          category: "Fiction",
          thumbnail: "https://example.com/book.jpg",
          description: "A great book",
        }),
        expect.anything(),
      );
    });
  });

  it("disables form when isLoading is true", () => {
    render(<BookForm onSubmit={mockOnSubmit} isLoading={true} />);

    expect(screen.getByLabelText(/title/i)).toBeDisabled();
    expect(screen.getByLabelText(/author/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
  });

  it("uses custom submit label when provided", () => {
    render(<BookForm onSubmit={mockOnSubmit} submitLabel="Update Book" />);

    expect(screen.getByRole("button", { name: /update book/i })).toBeInTheDocument();
  });
});
