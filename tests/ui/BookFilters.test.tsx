import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BookFilters } from "@/components/books/BookFilters";

vi.mock("next/image", () => ({
  __esModule: true,
  default: () => <span data-testid="next-image" />, // stub
}));

describe("BookFilters", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("debounces search input and calls onChangeAction", () => {
    const onChangeAction = vi.fn();
    render(<BookFilters onChangeAction={onChangeAction} />);

    const input = screen.getByPlaceholderText(/search by title/i);
    fireEvent.change(input, { target: { value: "gatsby" } });

    expect(onChangeAction).not.toHaveBeenCalled();
    vi.advanceTimersByTime(250);
    expect(onChangeAction).toHaveBeenCalledWith({
      search: "gatsby",
      sort: "asc",
      category: "",
      minPrice: 0,
      maxPrice: 1000,
    });
  });

  it("updates sort and triggers onChangeAction after debounce", () => {
    const onChangeAction = vi.fn();
    render(<BookFilters onChangeAction={onChangeAction} />);

    const select = screen.getByLabelText(/sort/i);
    fireEvent.change(select, { target: { value: "desc" } });

    vi.advanceTimersByTime(250);
    expect(onChangeAction).toHaveBeenCalledWith({
      search: "",
      sort: "desc",
      category: "",
      minPrice: 0,
      maxPrice: 1000,
    });
  });

  it("updates category filter and triggers onChangeAction", () => {
    const onChangeAction = vi.fn();
    render(<BookFilters onChangeAction={onChangeAction} />);

    const categorySelect = screen.getByLabelText(/filter by category/i);
    fireEvent.change(categorySelect, { target: { value: "Programming" } });

    vi.advanceTimersByTime(250);
    expect(onChangeAction).toHaveBeenCalledWith({
      search: "",
      sort: "asc",
      category: "Programming",
      minPrice: 0,
      maxPrice: 1000,
    });
  });

  it("updates price range and triggers onChangeAction", () => {
    const onChangeAction = vi.fn();
    render(<BookFilters onChangeAction={onChangeAction} />);

    const minPriceInput = screen.getByLabelText(/minimum price/i);
    const maxPriceInput = screen.getByLabelText(/maximum price/i);

    fireEvent.change(minPriceInput, { target: { value: "10" } });
    fireEvent.change(maxPriceInput, { target: { value: "50" } });

    vi.advanceTimersByTime(250);
    expect(onChangeAction).toHaveBeenCalledWith({
      search: "",
      sort: "asc",
      category: "",
      minPrice: 10,
      maxPrice: 50,
    });
  });

  it("combines all filters and triggers onChangeAction", () => {
    const onChangeAction = vi.fn();
    render(<BookFilters onChangeAction={onChangeAction} />);

    const searchInput = screen.getByPlaceholderText(/search by title/i);
    const sortSelect = screen.getByLabelText(/sort/i);
    const categorySelect = screen.getByLabelText(/filter by category/i);
    const minPriceInput = screen.getByLabelText(/minimum price/i);
    const maxPriceInput = screen.getByLabelText(/maximum price/i);

    fireEvent.change(searchInput, { target: { value: "react" } });
    fireEvent.change(sortSelect, { target: { value: "desc" } });
    fireEvent.change(categorySelect, { target: { value: "Programming" } });
    fireEvent.change(minPriceInput, { target: { value: "15" } });
    fireEvent.change(maxPriceInput, { target: { value: "30" } });

    vi.advanceTimersByTime(250);
    expect(onChangeAction).toHaveBeenCalledWith({
      search: "react",
      sort: "desc",
      category: "Programming",
      minPrice: 15,
      maxPrice: 30,
    });
  });
});
