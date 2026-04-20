import type { User } from "@supabase/supabase-js";
import { normalizeEmail } from "@/lib/auth/access";

type AuthProviderError = {
  message: string;
} | null;

type SignInPayload = {
  email: string;
  password: string;
};

type SignUpPayload = SignInPayload & {
  fullName: string;
  redirectTo?: string;
};

type SignInAuthApi = {
  signInWithPassword(credentials: {
    email: string;
    password: string;
  }): Promise<{
    data?: {
      user?: User | null;
    };
    error: AuthProviderError;
  }>;
};

type SignUpAuthApi = {
  signUp(credentials: {
    email: string;
    options?: {
      data?: {
        full_name?: string;
      };
      emailRedirectTo?: string;
    };
    password: string;
  }): Promise<{
    data?: {
      user?: User | null;
    };
    error: AuthProviderError;
  }>;
};

type SignOutAuthApi = {
  signOut(): Promise<{
    error: AuthProviderError;
  }>;
};

function assertCredentials(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new Error("Email is required.");
  }

  if (!password.trim()) {
    throw new Error("Password is required.");
  }

  return normalizedEmail;
}

function throwProviderError(error: AuthProviderError) {
  if (error?.message) {
    throw new Error(error.message);
  }
}

export async function signInWithPassword(auth: SignInAuthApi, payload: SignInPayload) {
  const normalizedEmail = assertCredentials(payload.email, payload.password);
  const result = await auth.signInWithPassword({
    email: normalizedEmail,
    password: payload.password,
  });

  throwProviderError(result.error);

  return {
    email: normalizedEmail,
    user: result.data?.user ?? null,
  };
}

export async function signUpWithPassword(auth: SignUpAuthApi, payload: SignUpPayload) {
  const normalizedEmail = assertCredentials(payload.email, payload.password);

  if (!payload.fullName.trim()) {
    throw new Error("Full name is required.");
  }

  const result = await auth.signUp({
    email: normalizedEmail,
    options: {
      data: {
        full_name: payload.fullName.trim(),
      },
      emailRedirectTo: payload.redirectTo,
    },
    password: payload.password,
  });

  throwProviderError(result.error);

  return {
    email: normalizedEmail,
    user: result.data?.user ?? null,
  };
}

export async function signOutCurrentSession(auth: SignOutAuthApi) {
  const result = await auth.signOut();
  throwProviderError(result.error);
}
