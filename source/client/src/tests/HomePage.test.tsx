import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../components/HomePage";

vi.mock("../hooks/useUser", () => ({
  useUser: vi.fn(() => ({
    user: { userName: "John Doe", role: "User" },
    isLoading: false,
    error: null,
  })),
}));
import { useUser } from "../hooks/useUser";

describe("HomePage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the welcome message with the user's name", () => {
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { userName: "John Doe", role: "User" },
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  it("should show only 'watch all countries' and 'watch all cities' buttons for regular users", () => {
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { userName: "John Doe", role: "User" },
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/watch all countries/i)).toBeInTheDocument();
    expect(screen.getByText(/watch all cities/i)).toBeInTheDocument();
    expect(screen.queryByText(/watch all users/i)).not.toBeInTheDocument();
  });

  it("should show 'watch all users' button for admin users", () => {
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { userName: "AdminUser", role: "Admin" },
      isLoading: false,
      error: null,
    });
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/watch all users/i)).toBeInTheDocument();
  });

  it("should not show any buttons if user is not logged in", () => {
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.queryByText(/watch all users/i)).not.toBeInTheDocument();
  });
});
