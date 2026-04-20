import { describe, expect, it, vi } from "vitest";
import { signInWithPassword, signOutCurrentSession, signUpWithPassword } from "@/lib/auth/service";

describe("auth service", () => {
  it("normalizes the email before sign-in", async () => {
    const signInWithPasswordMock = vi.fn().mockResolvedValue({
      data: {
        user: {
          email: "buyer@example.com",
          id: "user-1",
        },
      },
      error: null,
    });

    const result = await signInWithPassword(
      {
        signInWithPassword: signInWithPasswordMock,
      },
      {
        email: " Buyer@Example.com ",
        password: "secret123",
      },
    );

    expect(signInWithPasswordMock).toHaveBeenCalledWith({
      email: "buyer@example.com",
      password: "secret123",
    });
    expect(result.email).toBe("buyer@example.com");
    expect(result.user).toMatchObject({
      email: "buyer@example.com",
      id: "user-1",
    });
  });

  it("passes the buyer name into sign-up metadata", async () => {
    const signUpMock = vi.fn().mockResolvedValue({
      data: {
        user: {
          email: "buyer@example.com",
          id: "user-2",
        },
      },
      error: null,
    });

    await signUpWithPassword(
      {
        signUp: signUpMock,
      },
      {
        email: "buyer@example.com",
        password: "secret123",
        redirectTo: "https://mart.example/auth/callback",
        fullName: "Ada Buyer",
      },
    );

    expect(signUpMock).toHaveBeenCalledWith({
      email: "buyer@example.com",
      options: {
        data: {
          full_name: "Ada Buyer",
        },
        emailRedirectTo: "https://mart.example/auth/callback",
      },
      password: "secret123",
    });
  });

  it("throws the provider error when sign-in fails", async () => {
    const signInWithPasswordMock = vi.fn().mockResolvedValue({
      error: {
        message: "Invalid login credentials",
      },
    });

    await expect(
      signInWithPassword(
        {
          signInWithPassword: signInWithPasswordMock,
        },
        {
          email: "buyer@example.com",
          password: "wrong-password",
        },
      ),
    ).rejects.toThrow(/invalid login credentials/i);
  });

  it("delegates session sign-out", async () => {
    const signOutMock = vi.fn().mockResolvedValue({ error: null });

    await signOutCurrentSession({
      signOut: signOutMock,
    });

    expect(signOutMock).toHaveBeenCalledTimes(1);
  });
});
