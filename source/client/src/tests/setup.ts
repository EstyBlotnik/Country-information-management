import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest"
afterEach(() => {
  cleanup(); // Clean up DOM after each test
});
