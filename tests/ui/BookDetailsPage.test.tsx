import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BookDetailsPage from "@/app/(dashboard)/books/[id]/page";
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

vi.mock("next/image", () => ({
  __esModule: true,
  default: () => <span data-testid="next-image" />,
}));

vi.mock("@/lib/toast/ToastContext", () => ({
  useToast: () => ({
    addToast: vi.fn(),
  }),
}));

const mockBook: Book = {
  id: "u-1",
  title: "Test Book",
  author: mockUser.name,
  price: 19.99,
  category: "Programming",
  thumbnail: "https://example.com/image.jpg",
  createdBy: mockUser.id,
  description: "A test book description",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-02T00:00:00Z",
};

const mockBookByOtherAuthor: Book = {
  ...mockBook,
  author: "Other Author",
  createdBy: "other-id",
};

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe("BookDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    vi.spyOn(useBookByIdModule, "useBookById").mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as UseQueryResult<{ book: Book }>);

    renderWithQueryClient(<BookDetailsPage />);
    expect(screen.getByText(/loading book details/i)).toBeInTheDocument();
  });

  it("shows error state when book fetch fails", () => {
    vi.spyOn(useBookByIdModule, "useBookById").mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    } as UseQueryResult<{ book: Book }>);

    renderWithQueryClient(<BookDetailsPage />);
    expect(screen.getByText(/failed to load book details/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go back/i })).toBeInTheDocument();
  });

  it("displays book details when loaded successfully", async () => {
    vi.spyOn(useBookByIdModule, "useBookById").mockReturnValue({
      data: { book: mockBook },
      isLoading: false,
      isError: false,
    } as UseQueryResult<{ book: Book }>);

    renderWithQueryClient(<BookDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText("Test Book")).toBeInTheDocument();
    });

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText("Programming")).toBeInTheDocument();
    expect(screen.getByText("$19.99")).toBeInTheDocument();
    expect(screen.getByText("A test book description")).toBeInTheDocument();
  });

  it("renders action buttons for author", async () => {
    vi.spyOn(useBookByIdModule, "useBookById").mockReturnValue({
      data: { book: mockBook },
      isLoading: false,
      isError: false,
    } as UseQueryResult<{ book: Book }>);

    renderWithQueryClient(<BookDetailsPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /view/i })).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });

  it("hides edit and delete buttons for non-author", async () => {
    vi.spyOn(useBookByIdModule, "useBookById").mockReturnValue({
      data: { book: mockBookByOtherAuthor },
      isLoading: false,
      isError: false,
    } as UseQueryResult<{ book: Book }>);

    renderWithQueryClient(<BookDetailsPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /view/i })).toBeInTheDocument();
    });

    expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
  });
});
