"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/guards";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { markOrderArrivedAtWarehouse, recordWarehouseMeasurement, updateOrderStatus } from "@/lib/orders/repository";

const allowedStatuses = new Set([
  "awaiting_warehouse",
  "arrived_destination",
  "cancelled",
  "delivered",
  "in_transit",
  "out_for_delivery",
]);

const WEIGHING_PROOFS_BUCKET = "weighing-proofs";

async function ensureWeighingProofsBucket() {
  const supabase = createSupabaseServiceRoleClient();
  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    throw error;
  }

  if (!buckets?.some((bucket) => bucket.name === WEIGHING_PROOFS_BUCKET)) {
    const { error: createError } = await supabase.storage.createBucket(WEIGHING_PROOFS_BUCKET, {
      allowedMimeTypes: ["application/pdf", "image/jpeg", "image/png", "video/mp4"],
      fileSizeLimit: 25 * 1024 * 1024,
      public: true,
    });

    if (createError && !String(createError.message ?? "").includes("already exists")) {
      throw createError;
    }
  }

  return supabase;
}

function revalidateOrderSurfaces(orderId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/account/orders");
  revalidatePath(`/account/orders/${orderId}`);
}

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdminUser("/account/orders");

  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!orderId || !allowedStatuses.has(status)) {
    redirect("/admin/orders");
  }

  await updateOrderStatus({
    note: `Admin marked the order as ${status}.`,
    orderId,
    status: status as "awaiting_warehouse" | "arrived_destination" | "cancelled" | "delivered" | "in_transit" | "out_for_delivery",
  });

  revalidateOrderSurfaces(orderId);
  redirect(`/admin/orders/${orderId}`);
}

export async function markOrderArrivedAtWarehouseAction(formData: FormData) {
  await requireAdminUser("/account/orders");

  const orderId = String(formData.get("orderId") ?? "");

  if (!orderId) {
    redirect("/admin/orders");
  }

  await markOrderArrivedAtWarehouse(orderId);
  revalidateOrderSurfaces(orderId);
  redirect(`/admin/orders/${orderId}`);
}

export async function recordWarehouseMeasurementAction(formData: FormData) {
  const adminUser = await requireAdminUser("/account/orders");
  const orderId = String(formData.get("orderId") ?? "");
  const measuredValue = Number(formData.get("measuredValue") ?? "");
  const proofFile = formData.get("proofFile");

  if (!orderId || !Number.isFinite(measuredValue) || measuredValue <= 0) {
    redirect(`/admin/orders/${orderId || ""}?error=${encodeURIComponent("Enter a positive warehouse measurement.")}`);
  }

  if (!(proofFile instanceof File) || proofFile.size === 0) {
    redirect(`/admin/orders/${orderId}?error=${encodeURIComponent("Upload weighing proof before notifying the customer.")}`);
  }

  const supabase = await ensureWeighingProofsBucket();
  const extension = proofFile.name.includes(".") ? proofFile.name.split(".").pop() : "bin";
  const storagePath = `${orderId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(await proofFile.arrayBuffer());
  const contentType = proofFile.type || "application/octet-stream";

  const { error: uploadError } = await supabase.storage.from(WEIGHING_PROOFS_BUCKET).upload(storagePath, buffer, {
    contentType,
    upsert: false,
  });

  if (uploadError) {
    redirect(`/admin/orders/${orderId}?error=${encodeURIComponent("Proof upload failed. Try again.")}`);
  }

  const { data: proofUrl } = supabase.storage.from(WEIGHING_PROOFS_BUCKET).getPublicUrl(storagePath);

  await recordWarehouseMeasurement({
    measuredByProfileId: adminUser.id,
    measuredValue,
    orderId,
    proofMimeType: contentType,
    proofPath: proofUrl.publicUrl,
  });

  revalidateOrderSurfaces(orderId);
  redirect(`/admin/orders/${orderId}`);
}
