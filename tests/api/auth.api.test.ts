import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { POST as login } from "@/app/api/auth/login/route";
import { POST as logout } from "@/app/api/auth/logout/route";
import { GET as currentUser } from "@/app/api/auth/user-info/route";
import { GET as getProfile, PUT as updateProfile } from "@/app/api/profile/route";

type NextReqInit = ConstructorParameters<typeof NextRequest>[1];

const buildRequest = (url: string, init?: NextReqInit) => new NextRequest(url, init);
const buildJsonRequest = (url: string, method: string, body: unknown) =>
  buildRequest(url, {
    method,
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });

describe("auth API routes", () => {
  it("logs in with valid credentials and sets auth cookie", async () => {
    const response = await login(
      buildJsonRequest("http://localhost/api/auth/login", "POST", {
        email: "admin@books.com",
        password: "admin123",
      }),
    );
    const payload = await response.json();
    const cookie = response.cookies.get("auth-token");

    expect(response.status).toBe(200);
    expect(payload.user).toMatchObject({ id: "1", email: "admin@books.com", name: "Admin User" });
    expect(cookie?.value).toBe("true");
    expect(cookie?.httpOnly).toBe(true);
    expect(cookie?.path).toBe("/");
  });

  it("rejects invalid credentials", async () => {
    const response = await login(
      buildJsonRequest("http://localhost/api/auth/login", "POST", {
        email: "wrong@example.com",
        password: "bad",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe("Invalid credentials");
    expect(response.cookies.get("auth-token")?.value).toBeUndefined();
  });

  it("logs out and clears auth cookie", async () => {
    const response = await logout();
    const payload = await response.json();
    const cookie = response.cookies.get("auth-token");

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(cookie?.value).toBe("");
    expect(cookie?.maxAge).toBe(0);
  });

  it("returns current user info", async () => {
    const response = await currentUser();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.user).toMatchObject({ id: "1", email: "admin@books.com", name: "Admin User" });
    expect(typeof payload.user.createdAt).toBe("string");
  });
});

describe("profile API routes", () => {
  it("returns profile info", async () => {
    const response = await getProfile();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.user).toMatchObject({ id: "1", email: "admin@books.com", name: "Admin User" });
  });

  it("updates profile via PUT", async () => {
    const response = await updateProfile(
      buildJsonRequest("http://localhost/api/profile", "PUT", {
        name: "New Name",
        email: "newemail@books.com",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.user).toMatchObject({ id: "1", name: "New Name", email: "newemail@books.com" });
  });
});
