export const APP_NAME = "Books Shop";
export const APP_DESCRIPTION = "Your online bookstore";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  BOOKS: "/books",
  MY_BOOKS: "/my-books",
  PROFILE: "/profile",
  PROFILE_EDIT: "/profile/edit",
  BOOK_NEW: "/books/new",
  BOOK_DETAILS: (id: string) => `/books/${id}`,
  BOOK_EDIT: (id: string) => `/books/${id}/edit`,
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    USER_INFO: "/api/auth/user-info",
  },
  BOOKS: {
    ALL: "/api/books",
    MY_BOOKS: "/api/books/my-books",
    BY_ID: (id: string) => `/api/books/${id}`,
  },
  PROFILE: {
    GET: "/api/profile",
    UPDATE: "/api/profile",
  },
} as const;

export const DEMO_CREDENTIALS = {
  EMAIL: "admin@books.com",
  PASSWORD: "admin123",
} as const;
