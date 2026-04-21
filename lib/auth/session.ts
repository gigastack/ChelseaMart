import { getUserAccess, type UserAccess } from "@/lib/auth/access";
import { getUserAccessFromUser } from "@/lib/auth/profiles";
import { getSupabaseUserOrNull } from "@/lib/auth/supabase-user";
import { hasSupabaseAuthEnv } from "@/lib/config/env";

export type SessionUserAccess = UserAccess & {
  user:
    | {
        email: string | null;
        id: string;
      }
    | null;
  userId: string | null;
};

export async function getCurrentUserAccess(): Promise<SessionUserAccess> {
  if (!hasSupabaseAuthEnv()) {
    return {
      email: null,
      isAdmin: false,
      isAuthenticated: false,
      role: null,
      user: null,
      userId: null,
    };
  }

  const user = await getSupabaseUserOrNull();
  const access = await getUserAccessFromUser(user);

  return {
    ...access,
    user: user
      ? {
        email: access.email,
        id: user.id,
      }
      : null,
    userId: user?.id ?? null,
  };
}
