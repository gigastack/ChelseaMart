import type { ReactNode } from "react";
import { requireAdminUser } from "@/lib/auth/guards";
import { hasSupabaseAuthEnv } from "@/lib/config/env";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  if (hasSupabaseAuthEnv()) {
    await requireAdminUser("/");
  }

  return children;
}
