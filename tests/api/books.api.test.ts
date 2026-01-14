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

  it("creates a book via POST", async () => {
    const newBook = {
      title: "New Book",
      author: "Tester",
      price: 9.99,
      category: "Test",
      createdBy: "1",
    };
    const response = await createBook(
      buildJsonRequest("http://localhost/api/books", "POST", newBook),
    );
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.book).toMatchObject({ id: "new", ...newBook });
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
});
