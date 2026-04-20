"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminUser } from "@/lib/auth/guards";
import { updateCommerceSettings } from "@/lib/settings/repository";

const commerceSettingsSchema = z.object({
  cnyToNgnRate: z.coerce.number().positive(),
  defaultMoq: z.coerce.number().int().positive(),
  usdToNgnRate: z.coerce.number().positive(),
});

function revalidateCommerceSurfaces() {
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/search");
  revalidatePath("/checkout");
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/settings");
}

export async function updateCommerceSettingsAction(formData: FormData) {
  await requireAdminUser("/admin/settings");

  const parsed = commerceSettingsSchema.safeParse({
    cnyToNgnRate: formData.get("cnyToNgnRate"),
    defaultMoq: formData.get("defaultMoq"),
    usdToNgnRate: formData.get("usdToNgnRate"),
  });

  if (!parsed.success) {
    redirect(`/admin/settings?error=${encodeURIComponent("Enter positive exchange rates and a positive integer MOQ.")}`);
  }

  await updateCommerceSettings(parsed.data);
  revalidateCommerceSurfaces();
  redirect("/admin/settings?updated=1");
}
