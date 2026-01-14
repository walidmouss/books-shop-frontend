import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import CreateBookPage from "@/app/(dashboard)/books/new/page";
import { ToastProvider } from "@/lib/toast/ToastContext";
import * as router from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock fetch
global.fetch = vi.fn();

function renderWithProviders(component: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{component}</ToastProvider>
    </QueryClientProvider>,
  );
}

describe("CreateBookPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the create book form", () => {
    renderWithProviders(<CreateBookPage />);

    expect(screen.getByText("Create New Book")).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/thumbnail/i)).toBeInTheDocument();
  });

  it("submits the form with valid data", async () => {
    const mockPush = vi.fn();
    vi.spyOn(router, "useRouter").mockReturnValue({
      push: mockPush,
    } as any);

    const user = userEvent.setup();
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        book: {
          id: "new-123",
          title: "Test Book",
          price: 19.99,
          category: "Technology",
          description: "A test book",
          thumbnail: "https://example.com/book.jpg",
        },
      }),
    });

    renderWithProviders(<CreateBookPage />);

    await user.type(screen.getByLabelText(/^title/i), "Test Book");
    await user.type(screen.getByLabelText(/price/i), "19.99");
    await user.selectOptions(screen.getByLabelText(/category/i), "Technology");
    await user.type(screen.getByLabelText(/description/i), "A test book");
    await user.type(screen.getByLabelText(/thumbnail/i), "https://example.com/book.jpg");

    const submitButton = screen.getByRole("button", { name: /create book/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/books", expect.any(Object));
    });
  });

  it("shows validation errors for required fields", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateBookPage />);

    const submitButton = screen.getByRole("button", { name: /create book/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it("validates category selection", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateBookPage />);

    const categorySelect = screen.getByLabelText(/category/i) as HTMLSelectElement;
    expect(Array.from(categorySelect.options).map((o) => o.value)).toContain("Technology");
    expect(Array.from(categorySelect.options).map((o) => o.value)).toContain("Science");
    expect(Array.from(categorySelect.options).map((o) => o.value)).toContain("History");
    expect(Array.from(categorySelect.options).map((o) => o.value)).toContain("Fantasy");
    expect(Array.from(categorySelect.options).map((o) => o.value)).toContain("Biography");
  });
});
