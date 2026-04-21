"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminUser } from "@/lib/auth/guards";
import { getCommerceSettings } from "@/lib/settings/repository";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";
import { convertCnyToNgn } from "@/lib/pricing/calculate";

const PRODUCT_IMAGES_BUCKET = "product-images";

const productEditorSchema = z.object({
  basePriceCny: z.coerce.number().min(0),
  existingCoverImageUrl: z.string().trim().optional(),
  intent: z.enum(["draft", "live"]),
  mode: z.enum(["api", "manual"]),
  moqOverride: z
    .union([z.literal(""), z.coerce.number().int().positive()])
    .transform((value) => (value === "" ? null : value)),
  productId: z.string().trim().optional(),
  sellPriceCny: z.coerce.number().positive(),
  shortDescription: z.string().trim().max(240).optional(),
  title: z.string().trim().min(1),
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function revalidateProductSurfaces(productId?: string, productSlug?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  revalidatePath("/");

  if (productId) {
    revalidatePath(`/admin/products/${productId}`);
  }

  if (productSlug) {
    revalidatePath(`/products/${productSlug}`);
  }
}

async function ensureProductImagesBucket() {
  const supabase = createSupabaseServiceRoleClient();
  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    throw error;
  }

  if (!buckets?.some((bucket) => bucket.name === PRODUCT_IMAGES_BUCKET)) {
    const { error: createError } = await supabase.storage.createBucket(PRODUCT_IMAGES_BUCKET, {
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
      fileSizeLimit: 10 * 1024 * 1024,
      public: true,
    });

    if (createError && !String(createError.message ?? "").includes("already exists")) {
      throw createError;
    }
  }

  return supabase;
}

async function uploadProductImage(file: File, productId: string) {
  const supabase = await ensureProductImagesBucket();
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const storagePath = `${productId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || "application/octet-stream";

  const { error: uploadError } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(storagePath, buffer, {
    contentType,
    upsert: false,
  });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function saveAdminProductAction(formData: FormData) {
  await requireAdminUser("/admin/products");

  const parsed = productEditorSchema.safeParse({
    basePriceCny: formData.get("basePriceCny"),
    existingCoverImageUrl: formData.get("existingCoverImageUrl"),
    intent: formData.get("intent"),
    mode: formData.get("mode"),
    moqOverride: formData.get("moqOverride"),
    productId: formData.get("productId"),
    sellPriceCny: formData.get("sellPriceCny"),
    shortDescription: formData.get("shortDescription"),
    title: formData.get("title"),
  });

  if (!parsed.success) {
    redirect(`/admin/products?error=${encodeURIComponent("Enter a title, valid prices, and a valid MOQ override.")}`);
  }

  const imageFile = formData.get("coverImageFile");
  const supabase = createSupabaseServiceRoleClient();
  const settings = await getCommerceSettings();
  const productId = parsed.data.productId || crypto.randomUUID();
  const isNewProduct = !parsed.data.productId;
  const { data: existingProduct, error: existingError } = await supabase
    .from("products")
    .select("id, slug, cover_image_url, source_type")
    .eq("id", productId)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  const coverImageUrl =
    imageFile instanceof File && imageFile.size > 0
      ? await uploadProductImage(imageFile, productId)
      : parsed.data.existingCoverImageUrl?.trim() || existingProduct?.cover_image_url || null;

  if (parsed.data.intent === "live" && !coverImageUrl) {
    if (isNewProduct) {
      redirect(`/admin/products/new?source=manual&error=${encodeURIComponent("Add a cover image before publishing this product.")}`);
    }

    redirect(`/admin/products/${productId}?error=${encodeURIComponent("Add a cover image before publishing this product.")}`);
  }

  const slugBase = slugify(parsed.data.title) || `product-${productId.slice(0, 8)}`;
  const slug = existingProduct?.slug ?? `${slugBase}-${productId.slice(0, 6)}`;
  const basePriceNgn = convertCnyToNgn({
    cnyToNgnRate: settings.cnyToNgnRate,
    sourcePriceCny: parsed.data.basePriceCny,
  });
  const sellPriceNgn = convertCnyToNgn({
    cnyToNgnRate: settings.cnyToNgnRate,
    sourcePriceCny: parsed.data.sellPriceCny,
  });

  const payload = {
    base_price_cny: parsed.data.basePriceCny,
    base_price_ngn: basePriceNgn,
    cover_image_url: coverImageUrl,
    description: parsed.data.shortDescription?.trim() || null,
    id: productId,
    moq_override: parsed.data.moqOverride,
    sell_price_cny: parsed.data.sellPriceCny,
    sell_price_ngn: sellPriceNgn,
    short_description: parsed.data.shortDescription?.trim() || null,
    slug,
    source_type: existingProduct?.source_type ?? parsed.data.mode,
    status: parsed.data.intent === "live" ? "live" : "draft",
    title: parsed.data.title,
    weight_kg: 0,
  };

  const { error: saveError } = await supabase.from("products").upsert(payload, { onConflict: "id" });

  if (saveError) {
    throw saveError;
  }

  revalidateProductSurfaces(productId, slug);
  redirect(`/admin/products/${productId}?updated=1`);
}
