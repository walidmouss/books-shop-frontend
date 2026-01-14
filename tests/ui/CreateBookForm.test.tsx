import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateBookForm } from "@/components/forms/CreateBookForm";
import type { CreateBookFormData } from "@/lib/validators/book.schema";

describe("CreateBookForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    const onSubmit = vi.fn();
    render(<CreateBookForm onSubmit={onSubmit} />);

    expect(screen.getByLabelText(/^title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/thumbnail/i)).toBeInTheDocument();
  });

  it("calls onSubmit with valid data", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<CreateBookForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/^title/i), "Test Book");
    await user.type(screen.getByLabelText(/price/i), "29.99");
    await user.selectOptions(screen.getByLabelText(/category/i), "Science");
    await user.type(screen.getByLabelText(/description/i), "An interesting science book");
    await user.type(screen.getByLabelText(/thumbnail/i), "https://example.com/book.jpg");

    const submitButton = screen.getByRole("button", { name: /create book/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
      // Check the first argument is the data
      const callArg = onSubmit.mock.calls[0][0];
      expect(callArg).toMatchObject({
        title: "Test Book",
        price: 29.99,
        category: "Science",
        description: "An interesting science book",
        thumbnail: "https://example.com/book.jpg",
      });
    });
  });

  it("shows validation error when title is empty", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<CreateBookForm onSubmit={onSubmit} />);

    const submitButton = screen.getByRole("button", { name: /create book/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows validation error for invalid price", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<CreateBookForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/^title/i), "Test Book");
    await user.type(screen.getByLabelText(/price/i), "-5");

    const submitButton = screen.getByRole("button", { name: /create book/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/price must be greater than 0/i)).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid URL", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(<CreateBookForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/^title/i), "Test Book");
    await user.type(screen.getByLabelText(/price/i), "19.99");
    await user.selectOptions(screen.getByLabelText(/category/i), "Technology");
    await user.type(screen.getByLabelText(/description/i), "A tech book");
    await user.type(screen.getByLabelText(/thumbnail/i), "not-a-url");

    const submitButton = screen.getByRole("button", { name: /create book/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/thumbnail must be a valid url/i)).toBeInTheDocument();
    });
  });

  it("disables form when loading", () => {
    const onSubmit = vi.fn();
    render(<CreateBookForm onSubmit={onSubmit} isLoading={true} />);

    expect(screen.getByLabelText(/^title/i)).toBeDisabled();
    expect(screen.getByLabelText(/price/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /creating/i })).toBeDisabled();
  });

  it("has all category options", () => {
    const onSubmit = vi.fn();
    render(<CreateBookForm onSubmit={onSubmit} />);

    const categorySelect = screen.getByLabelText(/category/i) as HTMLSelectElement;
    const options = Array.from(categorySelect.options).map((o) => o.value);

    expect(options).toContain("Technology");
    expect(options).toContain("Science");
    expect(options).toContain("History");
    expect(options).toContain("Fantasy");
    expect(options).toContain("Biography");
  });
});
