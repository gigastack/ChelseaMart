import { redirect } from "next/navigation";
import { assertAdminRole } from "@/lib/auth/access";
import { getUserAccessFromUser } from "@/lib/auth/profiles";
import { buildSignInHref } from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAuthenticatedUser(nextPath = "/account/orders") {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect(buildSignInHref(nextPath));
  }

  return user;
}

export async function requireAdminUser(redirectTo = "/account/orders") {
  const user = await requireAuthenticatedUser("/admin");
  const access = await getUserAccessFromUser(user);

  try {
    assertAdminRole(access.role);
  } catch {
    redirect(redirectTo);
  }

  return user;
}
