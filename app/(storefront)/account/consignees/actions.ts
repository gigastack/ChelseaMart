"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import {
  createConsigneeForUser,
  deleteConsigneeForUser,
  setDefaultConsigneeForUser,
  updateConsigneeForUser,
} from "@/lib/orders/repository";

function revalidateConsigneeSurfaces() {
  revalidatePath("/account/consignees");
  revalidatePath("/checkout");
}

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

  revalidateConsigneeSurfaces();
  redirect("/account/consignees");
}

export async function updateConsigneeAction(formData: FormData) {
  const user = await requireAuthenticatedUser("/account/consignees");
  const consigneeId = String(formData.get("consigneeId") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const cityOrState = String(formData.get("cityOrState") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const isDefault = String(formData.get("isDefault") ?? "") === "on";

  if (!consigneeId || !fullName || !phone || !cityOrState) {
    redirect("/account/consignees");
  }

  await updateConsigneeForUser(user.id, consigneeId, {
    cityOrState,
    fullName,
    isDefault,
    notes,
    phone,
  });

  revalidateConsigneeSurfaces();
  redirect("/account/consignees");
}

export async function setDefaultConsigneeAction(formData: FormData) {
  const user = await requireAuthenticatedUser("/account/consignees");
  const consigneeId = String(formData.get("consigneeId") ?? "");

  if (!consigneeId) {
    redirect("/account/consignees");
  }

  await setDefaultConsigneeForUser(user.id, consigneeId);
  revalidateConsigneeSurfaces();
  redirect("/account/consignees");
}

export async function deleteConsigneeAction(formData: FormData) {
  const user = await requireAuthenticatedUser("/account/consignees");
  const consigneeId = String(formData.get("consigneeId") ?? "");

  if (!consigneeId) {
    redirect("/account/consignees");
  }

  await deleteConsigneeForUser(user.id, consigneeId);
  revalidateConsigneeSurfaces();
  redirect("/account/consignees");
}
