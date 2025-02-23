import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUser } from "../hooks/useUser"; // ודא שהנתיב נכון
import { userData } from "../types/userTypes";
import * as userService from "../services/userService";

// יצירת QueryClient mock
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // כדי למנוע ניסיונות חוזרים בבדיקות
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

const mockUser: userData = {
  _id: "67ac42d3d69386d244a7db2a",
  firstName: "esty",
  lastName: "blotnik",
  email: "estyblotnik@gmail.com",
  phoneNumber: "0548369314",
  role: "Admin",
  userName: "Estyb",
  JoiningDate: new Date("2025-02-09T12:26:43.637Z"),
  closedRequests: [],
};

const updatedUser: userData = {
  _id: "67ac42d3d69386d244a7db2a",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phoneNumber: "987654321",
  role: "Admin",
  userName: "janedoe",
  JoiningDate: new Date(),
  closedRequests: [],
};

describe("useUser Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // מנקה mocks מבדיקות קודמות
    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "userId") return "12345";
      return null;
    });

    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {});
    vi.spyOn(userService, "register").mockResolvedValue({
      success: true,
      status: 200,
      data: { newUser: mockUser },
    });
    vi.spyOn(userService, "getUser").mockResolvedValue({
      success: true,
      status: 200,
      data: mockUser,
    });

    vi.spyOn(userService, "editUser").mockResolvedValue({
      success: true,
      status: 200,
      data: updatedUser,
    });
  });

  it("should return initial state with loading", async () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeUndefined();
  });

  it("should allow user registration", async () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(),
    });

    expect(result.current.user).toBeUndefined();
    await act(async () => {
      result.current.registerUser(mockUser);
    });
    expect(result.current.user).toEqual(mockUser);
  });

  it("should handle user logout", async () => {
    const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem");
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.logoutUser();
    });
    console.log("localStorage.removeItem: ", removeItemSpy);
    await act(async () => {
      result.current.logoutUser();
    });

    await act(async () => {
      result.current.logoutUser();
    });

    console.log("User after logout:", result.current.user);

    await waitFor(() => {
      expect(result.current.user).toBeUndefined();
    });
  });

  it("should allow updating user details", async () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.updateUser({ userId: "12345", updatedData: updatedUser });
    });

    expect(result.current.user).toEqual(updatedUser);
  });
});
