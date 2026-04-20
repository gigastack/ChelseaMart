"use server";

import { redirect } from "next/navigation";
import { getUserAccessFromUser } from "@/lib/auth/profiles";
import { buildAuthStatusHref, sanitizeNextPath } from "@/lib/auth/redirects";
import { signInWithPassword, signOutCurrentSession, signUpWithPassword } from "@/lib/auth/service";
import { getPublicEnv, hasSupabaseAuthEnv } from "@/lib/config/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "We could not complete that request.";
}

function isRedirectLikeError(error: unknown) {
  return error instanceof Error && error.message.includes("NEXT_REDIRECT");
}

function resolveSignedInDestination(nextPath: string, access: { isAdmin: boolean }) {
  if (nextPath === "/admin") {
    return access.isAdmin ? "/admin" : "/account/orders";
  }

  if (nextPath === "/account/orders" && access.isAdmin) {
    return "/admin";
  }

  return nextPath;
}

export async function signInAction(formData: FormData) {
  const nextPath = sanitizeNextPath(formData.get("next"));

  if (!hasSupabaseAuthEnv()) {
    redirect(
      buildAuthStatusHref("/auth/sign-in", {
        error: "Supabase auth is not configured yet.",
        next: nextPath,
      }),
    );
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServerClient();

  try {
    const result = await signInWithPassword(supabase.auth, {
      email,
      password,
    });
    const access = await getUserAccessFromUser(result.user ?? null);
    const destination = resolveSignedInDestination(nextPath, access);

    redirect(destination);
  } catch (error) {
    if (isRedirectLikeError(error)) {
      throw error;
    }

    redirect(
      buildAuthStatusHref("/auth/sign-in", {
        error: getAuthErrorMessage(error),
        next: nextPath,
      }),
    );
  }
}

export async function signUpAction(formData: FormData) {
  const nextPath = sanitizeNextPath(formData.get("next"));

  if (!hasSupabaseAuthEnv()) {
    redirect(
      buildAuthStatusHref("/auth/sign-up", {
        error: "Supabase auth is not configured yet.",
        next: nextPath,
      }),
    );
  }

  const fullName = String(formData.get("fullName") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServerClient();
  const publicEnv = getPublicEnv();
  const redirectTo = publicEnv.siteUrl ? new URL("/auth/sign-in", publicEnv.siteUrl).toString() : undefined;

  try {
    await signUpWithPassword(supabase.auth, {
      email,
      fullName,
      password,
      redirectTo,
    });

    redirect(
      buildAuthStatusHref("/auth/sign-in", {
        next: nextPath,
        notice: "Account created. Sign in to continue.",
      }),
    );
  } catch (error) {
    if (isRedirectLikeError(error)) {
      throw error;
    }

    redirect(
      buildAuthStatusHref("/auth/sign-up", {
        error: getAuthErrorMessage(error),
        next: nextPath,
      }),
    );
  }
}

export async function signOutAction() {
  if (hasSupabaseAuthEnv()) {
    const supabase = await createSupabaseServerClient();
    await signOutCurrentSession(supabase.auth);
  }

  redirect("/");
}
