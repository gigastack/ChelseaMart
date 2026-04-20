import { convertCnyToNgn } from "@/lib/pricing/calculate";
import { formatMoney } from "@/lib/currency/format";
import { getCommerceSettings } from "@/lib/settings/repository";
import { resolveEffectiveMoq } from "@/lib/settings/commerce-settings";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export type StorefrontProductRecord = {
  category: string;
  description: string;
  effectiveMoq: number;
  id: string;
  imageUrl: string;
  longDescription: string;
  moq: number;
  priceDisplay: string;
  priceDisplayNgn: string;
  sellPriceCny: number;
  sellPriceNgn: number;
  slug: string;
  specs: string[];
  title: string;
  weightKg: number;
};

export type AdminCatalogProductRecord = {
  effectiveMoq: number;
  id: string;
  moqOverride: number | null;
  priceCny: number;
  priceNgn: number;
  sourceType: "api" | "manual";
  sourcePriceCny: number;
  status: "draft" | "live" | "removed" | "unavailable";
  title: string;
  updatedLabel: string;
  weightKg: number | null;
};

function formatRelativeLabel(dateIso: string) {
  const date = new Date(dateIso);
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function asNullableNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    return Number(value);
  }

  return null;
}

function asNumber(value: unknown) {
  return asNullableNumber(value) ?? 0;
}

export async function listStorefrontProducts() {
  const supabase = createSupabaseServiceRoleClient();
  const settings = await getCommerceSettings();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, title, short_description, description, moq_override, weight_kg, sell_price_cny, cover_image_url, categories(name)",
    )
    .eq("status", "live")
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((product) => {
    const sellPriceCny = asNumber(product.sell_price_cny);
    const sellPriceNgn = convertCnyToNgn({
      cnyToNgnRate: settings.cnyToNgnRate,
      sourcePriceCny: sellPriceCny,
    });
    const effectiveMoq = resolveEffectiveMoq({
      defaultMoq: settings.defaultMoq,
      moqOverride: asNullableNumber(product.moq_override),
    });

    return {
      category:
        product.categories && typeof product.categories === "object" && "name" in product.categories
          ? String(product.categories.name)
          : "Manual Upload",
      description: product.short_description ?? "Manual-upload product ready for customer browsing.",
      effectiveMoq,
      id: product.id,
      imageUrl: product.cover_image_url ?? "/ProductImage.jpg",
      longDescription:
        product.description ??
        "This manual-upload product is persisted in the local catalog and priced independently from live ELIM reads.",
      moq: effectiveMoq,
      priceDisplay: formatMoney(sellPriceCny, "CNY"),
      priceDisplayNgn: formatMoney(sellPriceNgn, "NGN"),
      sellPriceCny,
      sellPriceNgn,
      slug: product.slug,
      specs: ["Manual upload", "Local catalog", "CNY display / NGN payment"],
      title: product.title,
      weightKg: asNumber(product.weight_kg),
    } satisfies StorefrontProductRecord;
  });
}

export async function listStorefrontCategories() {
  return [...new Set((await listStorefrontProducts()).map((product) => product.category))];
}

export async function findStorefrontProductBySlug(slug: string) {
  return (await listStorefrontProducts()).find((product) => product.slug === slug) ?? null;
}

export async function listAdminProducts() {
  const supabase = createSupabaseServiceRoleClient();
  const settings = await getCommerceSettings();
  const { data, error } = await supabase
    .from("products")
    .select("id, title, base_price_cny, moq_override, sell_price_cny, source_type, status, updated_at, weight_kg")
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((product) => {
    const priceCny = asNumber(product.sell_price_cny);

    return {
      effectiveMoq: resolveEffectiveMoq({
        defaultMoq: settings.defaultMoq,
        moqOverride: asNullableNumber(product.moq_override),
      }),
      id: product.id,
      moqOverride: asNullableNumber(product.moq_override),
      priceCny,
      priceNgn: convertCnyToNgn({
        cnyToNgnRate: settings.cnyToNgnRate,
        sourcePriceCny: priceCny,
      }),
      sourceType: product.source_type,
      sourcePriceCny: asNumber(product.base_price_cny),
      status: product.status,
      title: product.title,
      updatedLabel: formatRelativeLabel(product.updated_at),
      weightKg: asNullableNumber(product.weight_kg),
    } satisfies AdminCatalogProductRecord;
  });
}

export async function findAdminProduct(productId: string) {
  return (await listAdminProducts()).find((product) => product.id === productId) ?? null;
}
