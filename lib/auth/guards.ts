import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/auth/access";
import { getServerEnv } from "@/lib/config/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAuthenticatedUser(redirectTo = "/sign-in") {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect(redirectTo);
  }

  return user;
}

export async function requireAdminUser(redirectTo = "/") {
  const user = await requireAuthenticatedUser("/sign-in?next=/admin");

  if (!isAdminEmail(user.email, getServerEnv().adminEmails)) {
    redirect(redirectTo);
  }

  return user;
}
