import { getOptionalServerEnv } from "@/lib/config/env";
import { seedProducts, type SeedProduct } from "@/lib/demo/manual-upload-seed";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export type StorefrontProductRecord = {
  category: string;
  description: string;
  id: string;
  imageUrl: string;
  longDescription: string;
  moq: number;
  priceDisplay: string;
  sellPriceNgn: number;
  slug: string;
  specs: string[];
  title: string;
  weightKg: number;
};

export type AdminCatalogProductRecord = {
  id: string;
  priceNgn: number;
  sourceType: "api" | "manual";
  status: "draft" | "live" | "removed" | "unavailable";
  title: string;
  updatedLabel: string;
  weightKg: number | null;
};

function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatRelativeLabel(dateIso: string) {
  const date = new Date(dateIso);
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function mapSeedProduct(product: SeedProduct): StorefrontProductRecord {
  return {
    category: product.category,
    description: product.description,
    id: product.id,
    imageUrl: product.coverImageUrl,
    longDescription: product.longDescription,
    moq: product.moq,
    priceDisplay: formatNaira(product.basePriceNgn),
    sellPriceNgn: product.basePriceNgn,
    slug: product.slug,
    specs: product.specs,
    title: product.title,
    weightKg: product.weightKg,
  };
}

function getSeedStorefrontProducts() {
  return seedProducts.filter((product) => product.status === "live").map(mapSeedProduct);
}

export async function listStorefrontProducts() {
  const { supabaseServiceRoleKey } = getOptionalServerEnv();

  if (!supabaseServiceRoleKey) {
    return getSeedStorefrontProducts();
  }

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, slug, title, short_description, description, moq, weight_kg, sell_price_ngn, cover_image_url")
      .eq("status", "live")
      .order("updated_at", { ascending: false });

    if (error || !data?.length) {
      return getSeedStorefrontProducts();
    }

    return data.map((product) => ({
      category: "Manual Upload",
      description: product.short_description ?? "Manual upload product ready for customer browsing.",
      id: product.id,
      imageUrl: product.cover_image_url ?? "/ProductImage.jpg",
      longDescription:
        product.description ??
        "This manual-upload product is persisted in the local catalog and priced independently from live ELIM reads.",
      moq: product.moq,
      priceDisplay: formatNaira(Number(product.sell_price_ngn ?? 0)),
      sellPriceNgn: Number(product.sell_price_ngn ?? 0),
      slug: product.slug,
      specs: ["Manual upload", "Local catalog", "NGN checkout"],
      title: product.title,
      weightKg: Number(product.weight_kg ?? 0),
    }));
  } catch {
    return getSeedStorefrontProducts();
  }
}

export async function listStorefrontCategories() {
  return [...new Set((await listStorefrontProducts()).map((product) => product.category))];
}

export async function findStorefrontProductBySlug(slug: string) {
  return (await listStorefrontProducts()).find((product) => product.slug === slug) ?? null;
}

export async function listAdminProducts() {
  const { supabaseServiceRoleKey } = getOptionalServerEnv();

  if (!supabaseServiceRoleKey) {
    return seedProducts.map<AdminCatalogProductRecord>((product) => ({
      id: product.id,
      priceNgn: product.basePriceNgn,
      sourceType: "manual",
      status: product.status,
      title: product.title,
      updatedLabel: formatRelativeLabel(product.updatedAt),
      weightKg: product.weightKg,
    }));
  }

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, title, sell_price_ngn, source_type, status, updated_at, weight_kg")
      .order("updated_at", { ascending: false });

    if (error || !data?.length) {
      return seedProducts.map<AdminCatalogProductRecord>((product) => ({
        id: product.id,
        priceNgn: product.basePriceNgn,
        sourceType: "manual",
        status: product.status,
        title: product.title,
        updatedLabel: formatRelativeLabel(product.updatedAt),
        weightKg: product.weightKg,
      }));
    }

    return data.map((product) => ({
      id: product.id,
      priceNgn: Number(product.sell_price_ngn ?? 0),
      sourceType: product.source_type,
      status: product.status,
      title: product.title,
      updatedLabel: formatRelativeLabel(product.updated_at),
      weightKg: product.weight_kg ? Number(product.weight_kg) : null,
    }));
  } catch {
    return seedProducts.map<AdminCatalogProductRecord>((product) => ({
      id: product.id,
      priceNgn: product.basePriceNgn,
      sourceType: "manual",
      status: product.status,
      title: product.title,
      updatedLabel: formatRelativeLabel(product.updatedAt),
      weightKg: product.weightKg,
    }));
  }
}

export async function findAdminProduct(productId: string) {
  return (await listAdminProducts()).find((product) => product.id === productId) ?? null;
}
