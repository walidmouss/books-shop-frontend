import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/forms/LoginForm";

describe("LoginForm Component", () => {
  it("renders login form with email and password fields", () => {
    const mockSubmit = vi.fn();
    render(<LoginForm onSubmit={mockSubmit} />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("displays demo credentials", () => {
    const mockSubmit = vi.fn();
    render(<LoginForm onSubmit={mockSubmit} />);

    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
    expect(screen.getByText(/admin@books\.com/)).toBeInTheDocument();
    expect(screen.getByText(/admin123/)).toBeInTheDocument();
  });

  it("shows validation errors for short password", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<LoginForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<LoginForm onSubmit={mockSubmit} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "admin@books.com");
    await user.type(passwordInput, "admin123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: "admin@books.com",
        password: "admin123",
      });
    });
  });

  it("disables form during loading state", () => {
    const mockSubmit = vi.fn();
    render(<LoginForm onSubmit={mockSubmit} isLoading={true} />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /signing in/i });

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });
});
