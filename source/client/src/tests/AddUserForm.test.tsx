import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AddUserForm from "../components/admin/AddUserForm"; // Update the path according to your file location
import { useUsers } from "../hooks/useUsers"; // Update if there is a change in location
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Mock for useUsers

vi.mock("../hooks/useUsers", () => ({
  useUsers: vi.fn().mockReturnValue({
    addUser: vi.fn(),
    users: undefined,
    isLoading: false,
    error: null,
    deleteMutation: {
      mutate: vi.fn(),
    },
    getUserById: vi.fn(),
  }),
}));

describe("AddUserForm Component", () => {
  it("should render the form with all input fields", async () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <AddUserForm />
        </QueryClientProvider>
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/User Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password 1/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm Password/i)).toBeInTheDocument();
    expect(screen.getByTestId("profile-picture-upload")).toBeInTheDocument();
  });

  it("should show validation errors for required fields when submitted with empty values", async () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <AddUserForm />
        </QueryClientProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Create new user/i));

    await waitFor(() => {
      expect(screen.getByText(/First Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Last Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Phone number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
      expect(
        screen.getByText("Confirm Password is required")
      ).toBeInTheDocument();
    });
  });

  it("should call addUser function when form is valid and submitted", async () => {
    const { addUser } = useUsers();
    render(
      <QueryClientProvider client={queryClient}>
        <AddUserForm />
      </QueryClientProvider>
    );

    fireEvent.input(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.input(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.input(screen.getByLabelText(/Email Address/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/Phone Number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.input(screen.getByLabelText(/User Name/i), {
      target: { value: "johndoe" },
    });
    fireEvent.input(screen.getByLabelText(/Password 1/i), {
      target: { value: "Password123!" },
    });
    fireEvent.input(screen.getByLabelText(/confirm Password/i), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByText(/Create new user/i));

    await waitFor(() => {
      expect(addUser).toHaveBeenCalled();
    });
  });

  it("should display an error if the passwords do not match", async () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <AddUserForm />
        </QueryClientProvider>
      </MemoryRouter>
    );

    fireEvent.input(screen.getByLabelText(/Password 1/i), {
      target: { value: "Password123!" },
    });
    fireEvent.input(screen.getByLabelText(/confirm Password/i), {
      target: { value: "DifferentPassword123!" },
    });
    fireEvent.click(screen.getByText(/Create new user/i));

    await waitFor(() => {
      expect(screen.getByText(/Passwords must match/i)).toBeInTheDocument();
    });
  });

  it("should show file upload input and accept an image file", async () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <AddUserForm />
        </QueryClientProvider>
      </MemoryRouter>
    );

    const fileInput = screen.getByTestId(
      "profile-picture-upload"
    ) as HTMLInputElement;

    const file = new File(["dummy content"], "profile.jpg", {
      type: "image/jpeg",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(fileInput.files![0].name).toBe("profile.jpg");
    });
  });
});
