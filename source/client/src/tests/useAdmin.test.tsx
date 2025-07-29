import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import useAdminAuth from "../hooks/permissions/useAdmin";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: ()=> mockNavigate,
  };
});

vi.mock("../hooks/useUser", () => ({
  useUser: vi.fn(() => ({
    user: { userName: "John Doe", role: "User" },
    isLoading: false,
    error: null,
  })),
}));

describe("useAdminAuth", () => {
  it("should redirect to home page if user is not an admin", async () => {
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { userName: "John Doe", role: "User" },
      isLoading: false,
      error: null,
    });
    const navigate = useNavigate() as ReturnType<typeof vi.fn>;
    const TestComponent = () => {
      useAdminAuth();
      return null;
    };

    render(
      <Router>
        <TestComponent />
      </Router>
    );

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/home");
    });
  });

  it("should not redirect if user is an admin", async () => {
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { userName: "Admin User", role: "Admin" },
      isLoading: false,
      error: null,
    });

    const navigate = vi.fn();

    // Wrap the hook in a component with Router
    const TestComponent = () => {
      useAdminAuth();
      return null;
    };

    render(
      <Router>
        <TestComponent />
      </Router>
    );

    await waitFor(() => {
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  it("should not redirect if user is loading", async () => {
    (useUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      isLoading: true,
      error: null,
    });

    const navigate = vi.fn();

    const TestComponent = () => {
      useAdminAuth();
      return null;
    };

    render(
      <Router>
        <TestComponent />
      </Router>
    );

    await waitFor(() => {
      expect(navigate).not.toHaveBeenCalled();
    });
  });
});
