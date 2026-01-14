import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "@/components/ui/Pagination";

describe("Pagination", () => {
  it("disables Prev on first page and enables Next", () => {
    const onPageChangeAction = vi.fn();
    render(
      <Pagination page={1} pageSize={10} total={30} onPageChangeAction={onPageChangeAction} />,
    );

    expect(screen.getByRole("button", { name: /prev/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).not.toBeDisabled();
  });

  it("disables Next on last page", () => {
    const onPageChangeAction = vi.fn();
    render(
      <Pagination page={3} pageSize={10} total={30} onPageChangeAction={onPageChangeAction} />,
    );

    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("calls onPageChangeAction when clicking a page number", () => {
    const onPageChangeAction = vi.fn();
    render(
      <Pagination page={1} pageSize={10} total={30} onPageChangeAction={onPageChangeAction} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(onPageChangeAction).toHaveBeenCalledWith(2);
  });

  it("calls onPageChangeAction when clicking Next", () => {
    const onPageChangeAction = vi.fn();
    render(
      <Pagination page={1} pageSize={10} total={30} onPageChangeAction={onPageChangeAction} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(onPageChangeAction).toHaveBeenCalledWith(2);
  });
});
