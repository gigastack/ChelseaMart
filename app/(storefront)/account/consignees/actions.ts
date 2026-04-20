"use server";

import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { createConsigneeForUser } from "@/lib/orders/repository";

export async function createConsigneeAction(formData: FormData) {
  const user = await requireAuthenticatedUser("/account/consignees");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const cityOrState = String(formData.get("cityOrState") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const isDefault = String(formData.get("isDefault") ?? "") === "on";

  if (!fullName || !phone || !cityOrState) {
    redirect("/account/consignees");
  }

  await createConsigneeForUser(user.id, {
    cityOrState,
    fullName,
    isDefault,
    notes,
    phone,
  });

  redirect("/account/consignees");
}
