import type { ReactNode } from "react";
import { SignOutForm } from "@/components/storefront/sign-out-form";
import { StorefrontHeaderView } from "@/components/storefront/header-view";
import { getCurrentUserAccess } from "@/lib/auth/session";

type StorefrontHeaderServerProps = {
  signOutControl?: ReactNode;
};

export async function StorefrontHeader({ signOutControl }: StorefrontHeaderServerProps = {}) {
  const access = await getCurrentUserAccess();

  return <StorefrontHeaderView access={access} signOutControl={signOutControl ?? <SignOutForm size="sm" variant="ghost" />} />;
}

export { StorefrontHeaderView } from "@/components/storefront/header-view";
