import { desc, eq } from "drizzle-orm";
import { getOptionalDatabaseClient } from "@/lib/db/client";
import { categories, products } from "@/lib/db/schema";
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

export async function listStorefrontProducts() {
  const databaseClient = getOptionalDatabaseClient();

  if (databaseClient) {
    const rows = await databaseClient
      .select({
        categoryName: categories.name,
        coverImageUrl: products.coverImageUrl,
        description: products.description,
        id: products.id,
        moq: products.moq,
        sellPriceNgn: products.sellPriceNgn,
        shortDescription: products.shortDescription,
        slug: products.slug,
        title: products.title,
        weightKg: products.weightKg,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.status, "live"))
      .orderBy(desc(products.updatedAt));

    return rows.map((product) => ({
      category: product.categoryName ?? "Manual Upload",
      description: product.shortDescription ?? "Manual-upload product ready for customer browsing.",
      id: product.id,
      imageUrl: product.coverImageUrl ?? "/ProductImage.jpg",
      longDescription:
        product.description ??
        "This manual-upload product is persisted in the local catalog and priced independently from live ELIM reads.",
      moq: product.moq,
      priceDisplay: formatNaira(Number(product.sellPriceNgn ?? 0)),
      sellPriceNgn: Number(product.sellPriceNgn ?? 0),
      slug: product.slug,
      specs: ["Manual upload", "Local catalog", "NGN checkout"],
      title: product.title,
      weightKg: Number(product.weightKg ?? 0),
    }));
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, title, short_description, description, moq, weight_kg, sell_price_ngn, cover_image_url, categories(name)")
    .eq("status", "live")
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((product) => ({
    category:
      product.categories && typeof product.categories === "object" && "name" in product.categories
        ? String(product.categories.name)
        : "Manual Upload",
    description: product.short_description ?? "Manual-upload product ready for customer browsing.",
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
}

export async function listStorefrontCategories() {
  return [...new Set((await listStorefrontProducts()).map((product) => product.category))];
}

export async function findStorefrontProductBySlug(slug: string) {
  return (await listStorefrontProducts()).find((product) => product.slug === slug) ?? null;
}

export async function listAdminProducts() {
  const databaseClient = getOptionalDatabaseClient();

  if (databaseClient) {
    const rows = await databaseClient
      .select({
        id: products.id,
        priceNgn: products.sellPriceNgn,
        sourceType: products.sourceType,
        status: products.status,
        title: products.title,
        updatedAt: products.updatedAt,
        weightKg: products.weightKg,
      })
      .from(products)
      .orderBy(desc(products.updatedAt));

    return rows.map((product) => ({
      id: product.id,
      priceNgn: Number(product.priceNgn ?? 0),
      sourceType: product.sourceType,
      status: product.status,
      title: product.title,
      updatedLabel: formatRelativeLabel(String(product.updatedAt)),
      weightKg: product.weightKg ? Number(product.weightKg) : null,
    }));
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, title, sell_price_ngn, source_type, status, updated_at, weight_kg")
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((product) => ({
    id: product.id,
    priceNgn: Number(product.sell_price_ngn ?? 0),
    sourceType: product.source_type,
    status: product.status,
    title: product.title,
    updatedLabel: formatRelativeLabel(product.updated_at),
    weightKg: product.weight_kg ? Number(product.weight_kg) : null,
  }));
}

export async function findAdminProduct(productId: string) {
  return (await listAdminProducts()).find((product) => product.id === productId) ?? null;
}
