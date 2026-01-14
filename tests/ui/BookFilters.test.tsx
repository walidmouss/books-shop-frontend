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
    expect(onChangeAction).toHaveBeenCalledWith({ search: "gatsby", sort: "asc" });
  });

  it("updates sort and triggers onChangeAction after debounce", () => {
    const onChangeAction = vi.fn();
    render(<BookFilters onChangeAction={onChangeAction} />);

    const select = screen.getByLabelText(/sort/i);
    fireEvent.change(select, { target: { value: "desc" } });

    vi.advanceTimersByTime(250);
    expect(onChangeAction).toHaveBeenCalledWith({ search: "", sort: "desc" });
  });
});
