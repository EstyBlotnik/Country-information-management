import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

describe("App Component Routing", () => {
  it("should render the landing page by default", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    const titleElement = await screen.findByText(
      /Welcome to our countries page/i
    );
    expect(titleElement).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Sign up/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign in/i })
    ).toBeInTheDocument();
  });

  it("should navigate to the login page", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    const titleElement = await screen.findByText(/Sign in to your account/i);
    expect(titleElement).toBeInTheDocument();
  });

  it("should show 404 page for an unknown route", () => {
    render(
      <MemoryRouter initialEntries={["/non-existent-route"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/404 Not Found/i)).toBeInTheDocument();
  });

  it("should navigate to the home page", async () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <App />
      </MemoryRouter>
    );
    const titleElement = await screen.findByText(/wellcome/i);
    expect(titleElement).toBeInTheDocument();
  });
});