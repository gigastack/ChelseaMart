import { beforeEach, describe, expect, it, vi } from "vitest";

const redirectMock = vi.fn((path: string) => {
  throw new Error(`NEXT_REDIRECT:${path}`);
});
const getUserMock = vi.fn();
const createSupabaseServerClientMock = vi.fn(async () => ({
  auth: {
    getUser: getUserMock,
  },
}));
const getUserAccessFromUserMock = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: createSupabaseServerClientMock,
}));

vi.mock("@/lib/auth/profiles", () => ({
  getUserAccessFromUser: getUserAccessFromUserMock,
}));

describe("auth guards", () => {
  beforeEach(() => {
    getUserMock.mockReset();
    getUserAccessFromUserMock.mockReset();
    redirectMock.mockClear();
    createSupabaseServerClientMock.mockClear();
  });

  it("redirects unauthenticated users to sign-in while preserving the next path", async () => {
    getUserMock.mockResolvedValue({
      data: {
        user: null,
      },
    });

    const { requireAuthenticatedUser } = await import("@/lib/auth/guards");

    await expect(requireAuthenticatedUser("/checkout")).rejects.toThrow("NEXT_REDIRECT:/auth/sign-in?next=%2Fcheckout");
  });

  it("returns the authenticated user when a session is present", async () => {
    getUserMock.mockResolvedValue({
      data: {
        user: {
          email: "buyer@example.com",
          id: "user-1",
        },
      },
    });

    const { requireAuthenticatedUser } = await import("@/lib/auth/guards");

    await expect(requireAuthenticatedUser("/checkout")).resolves.toMatchObject({
      email: "buyer@example.com",
      id: "user-1",
    });
  });

  it("redirects non-admin users away from the admin boundary", async () => {
    getUserMock.mockResolvedValue({
      data: {
        user: {
          email: "buyer@example.com",
          id: "user-2",
        },
      },
    });
    getUserAccessFromUserMock.mockResolvedValue({
      email: "buyer@example.com",
      isAdmin: false,
      isAuthenticated: true,
      role: "customer",
    });

    const { requireAdminUser } = await import("@/lib/auth/guards");

    await expect(requireAdminUser("/account/orders")).rejects.toThrow("NEXT_REDIRECT:/account/orders");
  });

  it("allows persisted admins through the admin boundary", async () => {
    getUserMock.mockResolvedValue({
      data: {
        user: {
          email: "admin@example.com",
          id: "user-3",
        },
      },
    });
    getUserAccessFromUserMock.mockResolvedValue({
      email: "admin@example.com",
      isAdmin: true,
      isAuthenticated: true,
      role: "admin",
    });

    const { requireAdminUser } = await import("@/lib/auth/guards");

    await expect(requireAdminUser("/account/orders")).resolves.toMatchObject({
      email: "admin@example.com",
      id: "user-3",
    });
  });
});
