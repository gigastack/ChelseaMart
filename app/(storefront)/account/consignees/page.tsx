import { ConsigneesPage } from "@/components/storefront/consignees-page";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { hasSupabaseAuthEnv } from "@/lib/config/env";
import { listConsignees } from "@/lib/orders/repository";

export default async function AccountConsigneesPage() {
  const user = hasSupabaseAuthEnv() ? await requireAuthenticatedUser("/account/consignees") : null;
  const consignees = await listConsignees(user?.id);
  return <ConsigneesPage consignees={consignees} />;
}
