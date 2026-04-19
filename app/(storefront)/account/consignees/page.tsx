import { ConsigneesPage } from "@/components/storefront/consignees-page";
import { listConsignees } from "@/lib/orders/repository";

export default async function AccountConsigneesPage() {
  const consignees = await listConsignees();
  return <ConsigneesPage consignees={consignees} />;
}
