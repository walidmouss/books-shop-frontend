import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EditBookPage from "@/app/(dashboard)/books/[id]/edit/page";
import * as useBookByIdModule from "@/lib/queries/useBookById";
import type { Book } from "@/lib/types";
import type { UseQueryResult } from "@tanstack/react-query";
import { mockUser } from "@/lib/mocks/user";

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "u-1" }),
  useRouter: () => ({
    back: vi.fn(),
    push: vi.fn(),
  }),
}));

vi.mock("@/lib/toast/ToastContext", () => ({
  useToast: () => ({
    addToast: vi.fn(),
  }),
}));

const mockBookByCurrentUser: Book = {
  id: "u-1",
  title: "Test Book",
  author: mockUser.name,
  price: 19.99,
  category: "Programming",
  thumbnail: "https://example.com/image.jpg",
  createdBy: mockUser.id,
  description: "A test book",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-02T00:00:00Z",
};

const mockBookByOtherUser: Book = {
  ...mockBookByCurrentUser,
  author: "Other Author",
  createdBy: "other-user-id",
};

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe("EditBookPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    vi.spyOn(useBookByIdModule, "useBookById").mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as UseQueryResult<{ book: Book }>);

    renderWithQueryClient(<EditBookPage />);
    expect(screen.getByText(/loading book/i)).toBeInTheDocument();
  });

  it("shows error state when book fetch fails", () => {
    vi.spyOn(useBookByIdModule, "useBookById").mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as UseQueryResult<{ book: Book }>);

    renderWithQueryClient(<EditBookPage />);
    expect(screen.getByText(/failed to load book/i)).toBeInTheDocument();
  });

  it("shows unauthorized message when user is not the author", () => {
    vi.spyOn(useBookByIdModule, "useBookById").mockReturnValue({
      data: { book: mockBookByOtherUser },
      isLoading: false,
      isError: false,
    } as UseQueryResult<{ book: Book }>);

    renderWithQueryClient(<EditBookPage />);

    expect(screen.getByText(/unauthorized/i)).toBeInTheDocument();
    expect(screen.getByText(/you can only edit books that you authored/i)).toBeInTheDocument();
  });

  it("renders edit form when user is the author", async () => {
    vi.spyOn(useBookByIdModule, "useBookById").mockReturnValue({
      data: { book: mockBookByCurrentUser },
      isLoading: false,
      isError: false,
    } as UseQueryResult<{ book: Book }>);

    renderWithQueryClient(<EditBookPage />);

    await waitFor(() => {
      expect(screen.getByText(/edit book/i)).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("Test Book")).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue("19.99")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Programming")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /update book/i })).toBeInTheDocument();
  });
});
