import { getUserAccess, type UserAccess } from "@/lib/auth/access";
import { getUserAccessFromUser } from "@/lib/auth/profiles";
import { hasSupabaseAuthEnv } from "@/lib/config/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
