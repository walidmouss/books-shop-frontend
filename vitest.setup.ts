import "@testing-library/jest-dom";
import { beforeEach } from "vitest";
import { mockBooks } from "@/lib/mocks/books";

// Store initial state
const initialBooks = JSON.parse(JSON.stringify(mockBooks));

// Reset mockBooks before each test
beforeEach(() => {
  // Clear the array and repopulate with initial data
  mockBooks.length = 0;
  mockBooks.push(...JSON.parse(JSON.stringify(initialBooks)));
});
