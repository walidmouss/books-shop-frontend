import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET as listBooks, POST as createBook } from "@/app/api/books/route";
import { GET as listMyBooks } from "@/app/api/books/my-books/route";
import {
  GET as getBookById,
  PUT as updateBook,
  DELETE as removeBook,
} from "@/app/api/books/[id]/route";
import { mockBooks } from "@/lib/mocks/books";
import { mockUser } from "@/lib/mocks/user";

type NextReqInit = ConstructorParameters<typeof NextRequest>[1];

const buildRequest = (url: string, init?: NextReqInit) => new NextRequest(url, init);
const buildJsonRequest = (url: string, method: string, body: unknown) =>
  buildRequest(url, {
    method,
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });

describe("books API routes", () => {
  it("paginates and sorts books ascending by default", async () => {
    const response = await listBooks(buildRequest("http://localhost/api/books?page=1&pageSize=5"));
    const payload = await response.json();

    const expectedIds = [...mockBooks]
      .sort((a, b) => a.title.localeCompare(b.title))
      .slice(0, 5)
      .map((b) => b.id);

    expect(response.status).toBe(200);
    expect(payload.items.map((b: (typeof mockBooks)[number]) => b.id)).toEqual(expectedIds);
    expect(payload.total).toBe(mockBooks.length);
    expect(payload.page).toBe(1);
    expect(payload.pageSize).toBe(5);
  });

  it("returns the second page correctly", async () => {
    const response = await listBooks(buildRequest("http://localhost/api/books?page=2&pageSize=5"));
    const payload = await response.json();

    const expectedIds = [...mockBooks]
      .sort((a, b) => a.title.localeCompare(b.title))
      .slice(5, 10)
      .map((b) => b.id);

    expect(payload.items.map((b: (typeof mockBooks)[number]) => b.id)).toEqual(expectedIds);
    expect(payload.page).toBe(2);
  });

  it("applies search filter case-insensitively", async () => {
    const response = await listBooks(buildRequest("http://localhost/api/books?search=next"));
    const payload = await response.json();

    expect(payload.total).toBeGreaterThan(0);
    expect(
      payload.items.every((b: (typeof mockBooks)[number]) =>
        b.title.toLowerCase().includes("next"),
      ),
    ).toBe(true);
  });

  it("sorts books descending when requested", async () => {
    const response = await listBooks(
      buildRequest("http://localhost/api/books?sort=desc&pageSize=5"),
    );
    const payload = await response.json();

    const expectedIds = [...mockBooks]
      .sort((a, b) => b.title.localeCompare(a.title))
      .slice(0, 5)
      .map((b) => b.id);

    expect(payload.items.map((b: (typeof mockBooks)[number]) => b.id)).toEqual(expectedIds);
  });

  it("filters books by category", async () => {
    const response = await listBooks(
      buildRequest("http://localhost/api/books?category=Programming"),
    );
    const payload = await response.json();

    expect(payload.total).toBeGreaterThan(0);
    expect(
      payload.items.every((b: (typeof mockBooks)[number]) => b.category === "Programming"),
    ).toBe(true);
  });

  it("filters books by price range", async () => {
    const minPrice = 15;
    const maxPrice = 25;
    const response = await listBooks(
      buildRequest(`http://localhost/api/books?minPrice=${minPrice}&maxPrice=${maxPrice}`),
    );
    const payload = await response.json();

    expect(payload.total).toBeGreaterThan(0);
    expect(
      payload.items.every(
        (b: (typeof mockBooks)[number]) => b.price >= minPrice && b.price <= maxPrice,
      ),
    ).toBe(true);
  });

  it("filters books by category and price range combined", async () => {
    const category = "Programming";
    const minPrice = 15;
    const maxPrice = 30;
    const response = await listBooks(
      buildRequest(
        `http://localhost/api/books?category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
      ),
    );
    const payload = await response.json();

    expect(
      payload.items.every(
        (b: (typeof mockBooks)[number]) =>
          b.category === category && b.price >= minPrice && b.price <= maxPrice,
      ),
    ).toBe(true);
  });

  it("returns empty results when no books match filters", async () => {
    const response = await listBooks(
      buildRequest("http://localhost/api/books?category=NonExistentCategory"),
    );
    const payload = await response.json();

    expect(payload.total).toBe(0);
    expect(payload.items).toEqual([]);
  });

  it("creates a book via POST with required fields", async () => {
    const initialCount = mockBooks.length;
    const newBook = {
      title: "New Testing Book",
      price: 19.99,
      category: "Technology",
      description: "A book created by tests",
      thumbnail: "https://example.com/test-book.jpg",
    };
    const response = await createBook(
      buildJsonRequest("http://localhost/api/books", "POST", newBook),
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.book).toMatchObject({
      title: newBook.title,
      price: newBook.price,
      category: newBook.category,
      description: newBook.description,
      thumbnail: newBook.thumbnail,
    });
    // Verify it was added to mockBooks
    expect(mockBooks.length).toBe(initialCount + 1);
    expect(mockBooks.some((b) => b.id === payload.book.id)).toBe(true);
  });

  it("filters my books by current user and paginates", async () => {
    const response = await listMyBooks(
      buildRequest("http://localhost/api/books/my-books?page=1&pageSize=4"),
    );
    const payload = await response.json();

    const mine = mockBooks.filter((b) => b.createdBy === mockUser.id);
    const expectedIds = [...mine]
      .sort((a, b) => a.title.localeCompare(b.title))
      .slice(0, 4)
      .map((b) => b.id);

    expect(payload.total).toBe(mine.length);
    expect(payload.items.map((b: (typeof mockBooks)[number]) => b.id)).toEqual(expectedIds);
    expect(
      payload.items.every((b: (typeof mockBooks)[number]) => b.createdBy === mockUser.id),
    ).toBe(true);
  });

  it("returns a book by id", async () => {
    const target = mockBooks[0];
    const response = await getBookById(buildRequest(`http://localhost/api/books/${target.id}`), {
      params: Promise.resolve({ id: target.id }),
    });
    const payload = await response.json();

    expect(payload.book).toMatchObject({ id: target.id, title: target.title });
  });

  it("returns 404 when book is not found", async () => {
    const response = await getBookById(buildRequest("http://localhost/api/books/missing"), {
      params: Promise.resolve({ id: "missing" }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.error).toBe("Book not found");
  });

  it("updates a book via PUT", async () => {
    const response = await updateBook(
      buildJsonRequest("http://localhost/api/books/u-1", "PUT", { title: "Updated" }),
      { params: Promise.resolve({ id: "u-1" }) },
    );
    const payload = await response.json();

    expect(payload.book).toMatchObject({ id: "u-1", title: "Updated" });
  });

  it("updates a book with all fields via PUT", async () => {
    const updatedData = {
      title: "Completely Updated Book",
      author: "New Author",
      price: 99.99,
      category: "Science",
      description: "An updated description",
      thumbnail: "https://example.com/new-thumbnail.jpg",
    };

    const response = await updateBook(
      buildJsonRequest("http://localhost/api/books/u-1", "PUT", updatedData),
      { params: Promise.resolve({ id: "u-1" }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.book).toMatchObject({
      id: "u-1",
      ...updatedData,
    });
  });

  it("returns 404 when updating a non-existent book", async () => {
    const response = await updateBook(
      buildJsonRequest("http://localhost/api/books/nonexistent", "PUT", { title: "Updated" }),
      { params: Promise.resolve({ id: "nonexistent" }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.error).toBe("Book not found");
  });

  it("removes a book via DELETE", async () => {
    const response = await removeBook(
      buildRequest("http://localhost/api/books/u-1", { method: "DELETE" }),
      {
        params: Promise.resolve({ id: "u-1" }),
      },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
  });

  it("returns 404 when deleting a non-existent book", async () => {
    const response = await removeBook(
      buildRequest("http://localhost/api/books/nonexistent", { method: "DELETE" }),
      {
        params: Promise.resolve({ id: "nonexistent" }),
      },
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.error).toBe("Book not found");
  });

  it("returns 400 when creating a book with invalid data", async () => {
    const invalidBook = {
      title: "", // Empty title
      price: "invalid", // Invalid price
      // Missing required fields
    };
    const response = await createBook(
      buildJsonRequest("http://localhost/api/books", "POST", invalidBook),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe("Invalid book data");
    expect(payload.details).toBeDefined();
  });

  it("returns 400 when creating a book with invalid category", async () => {
    const invalidBook = {
      title: "Test Book",
      price: 19.99,
      category: "InvalidCategory", // Not in BOOK_CATEGORIES
      description: "Test description",
      thumbnail: "https://example.com/book.jpg",
    };
    const response = await createBook(
      buildJsonRequest("http://localhost/api/books", "POST", invalidBook),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe("Invalid book data");
  });

  it("newly created book appears in my books list", async () => {
    const newBook = {
      title: "My New Test Book",
      price: 24.99,
      category: "Science",
      description: "A test book I created",
      thumbnail: "https://example.com/my-book.jpg",
    };

    // Create the book
    const createResponse = await createBook(
      buildJsonRequest("http://localhost/api/books", "POST", newBook),
    );
    const createPayload = await createResponse.json();

    expect(createResponse.status).toBe(201);
    expect(createPayload.book.author).toBe(mockUser.name);

    // Fetch my books
    const listResponse = await listMyBooks(
      buildRequest("http://localhost/api/books/my-books?page=1&pageSize=20"),
    );
    const listPayload = await listResponse.json();

    // The newly created book should be in the list
    const createdBook = listPayload.items.find(
      (b: (typeof mockBooks)[number]) => b.id === createPayload.book.id,
    );
    expect(createdBook).toBeDefined();
    expect(createdBook.title).toBe("My New Test Book");
    expect(createdBook.author).toBe(mockUser.name);
  });
});
