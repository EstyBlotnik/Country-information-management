import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, expect, vi } from "vitest";
import AdminPage from "../components/admin/AdminPage";
import { MemoryRouter } from "react-router-dom";
import useAdminAuth from "../hooks/permissions/useAdmin";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock hooks and components
vi.mock("../hooks/permissions/useAdmin", () => ({
  default: vi.fn(),
}));

vi.mock("../hooks/useUsers", () => ({
  useUsers: vi.fn(() => ({
    users: [{ userName: "John Doe", role: "User", _id: "123456789" }],
    isLoading: false,
    error: null,
    deleteMutation: { mutate: vi.fn().mockResolvedValue(true) },
    getUserById: vi.fn(),
  })),
}));

import { useUsers } from "../hooks/useUsers";

vi.mock("@toolpad/core/AppProvider", () => ({
  AppProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-provider">{children}</div>
  ),
}));

vi.mock("@toolpad/core/DashboardLayout", () => ({
  DashboardLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dashboard-layout">{children}</div>
  ),
}));

vi.mock("./UsersPage", () => () => (
  <div data-testid="users-page">Users Page</div>
));
vi.mock("./PermissionRequests", () => () => (
  <div data-testid="permission-requests">Permission Requests</div>
));
vi.mock("./AddUserForm", () => () => (
  <div data-testid="add-user-form">Add User Form</div>
));

const queryClient = new QueryClient();

describe("AdminPage Component", () => {
  beforeEach(() => {
    vi.mocked(useAdminAuth).mockClear();
  });

  it("renders AppProvider and DashboardLayout", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <MemoryRouter initialEntries={["/allUsers"]}>
            <AdminPage />
          </MemoryRouter>
        </RecoilRoot>
      </QueryClientProvider>
    );
    expect(screen.getByTestId("app-provider")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-layout")).toBeInTheDocument();
  });

  it("renders UsersPage when at /allUsers", async () => {
    (useUsers as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      users: [{ userName: "John Doe", role: "User", _id: "0231456987" }],
      isLoading: false,
      error: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <MemoryRouter initialEntries={["/allUsers"]}>
            <AdminPage />
          </MemoryRouter>
        </RecoilRoot>
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("users list:")).toBeInTheDocument();
    });
  });

  it("renders PermissionRequests when at /permissionRequests", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <MemoryRouter initialEntries={["/permissionRequests"]}>
            <AdminPage initialPath="permissionRequests" />
          </MemoryRouter>
        </RecoilRoot>
      </QueryClientProvider>
    );
    const allButton = await screen.findByText(/All/);
    expect(allButton).toBeInTheDocument();
  });

  it("renders AddUserForm when at /addUser", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <MemoryRouter initialEntries={["/addUser"]}>
            <AdminPage initialPath="addUser" />
          </MemoryRouter>
        </RecoilRoot>
      </QueryClientProvider>
    );
    expect(
      screen.getByText(/Please fill in all new user details/i)
    ).toBeInTheDocument();
    // expect(screen.getByTestId("add-user-form")).toBeInTheDocument();
  });

  it("calls useAdminAuth on mount", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <MemoryRouter initialEntries={["/allUsers"]}>
            <AdminPage />
          </MemoryRouter>
        </RecoilRoot>
      </QueryClientProvider>
    );
    expect(useAdminAuth).toHaveBeenCalled();
  });
});
//
