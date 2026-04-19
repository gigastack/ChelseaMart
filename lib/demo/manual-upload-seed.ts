import type { CheckoutRoute, OrderStatus } from "@/lib/domain/types";

export type SeedProduct = {
  basePriceNgn: number;
  category: string;
  coverImageUrl: string;
  description: string;
  id: string;
  longDescription: string;
  moq: number;
  shortDescription: string;
  slug: string;
  specs: string[];
  status: "draft" | "live" | "removed" | "unavailable";
  title: string;
  updatedAt: string;
  weightKg: number;
};

export type SeedCartItem = {
  id: string;
  imageUrl: string;
  priceDisplay: string;
  productId: string;
  quantity: number;
  sellPriceNgn: number;
  slug: string;
  title: string;
  weightKg: number;
};

export type SeedConsignee = {
  cityOrState: string;
  fullName: string;
  id: string;
  isDefault: boolean;
  notes: string;
  phone: string;
  userId: string;
};

export type SeedOrder = {
  consigneeId: string;
  createdAt: string;
  grandTotalNgn: number;
  id: string;
  items: SeedCartItem[];
  logisticsTotalNgn: number;
  paymentReference: string | null;
  productSubtotalNgn: number;
  route: CheckoutRoute;
  status: OrderStatus;
  userId: string;
};

export const seedUserId = "11111111-1111-1111-1111-111111111111";

export const seedProducts: SeedProduct[] = [
  {
    basePriceNgn: 68000,
    category: "Home Essentials",
    coverImageUrl: "/ProductImage.jpg",
    description: "A polished manual-upload product used to validate storefront, checkout, and admin flows.",
    id: "manual-product-1",
    longDescription:
      "This manual-upload fixture is centered on ProductImage.jpg so the catalog, checkout, and BI flows can be tested repeatedly without consuming ELIM free-tier requests.",
    moq: 1,
    shortDescription: "Manual-upload flagship product",
    slug: "manual-product-image-item",
    specs: ["Manual upload path", "Admin-controlled pricing", "Route-based checkout logistics"],
    status: "live",
    title: "Product Image Sample",
    updatedAt: "2026-04-17T10:00:00.000Z",
    weightKg: 1.8,
  },
  {
    basePriceNgn: 42000,
    category: "Accessories",
    coverImageUrl: "/ProductImage.jpg",
    description: "Secondary manual-upload product for table, BI, and order-state coverage.",
    id: "manual-product-2",
    longDescription:
      "A second manual-upload fixture shares the same canonical image so QA can exercise multiple rows without adding external asset dependencies.",
    moq: 2,
    shortDescription: "Manual-upload secondary sample",
    slug: "manual-product-image-addon",
    specs: ["Secondary QA product", "MOQ 2", "Same local asset"],
    status: "draft",
    title: "Product Image Add-on",
    updatedAt: "2026-04-17T08:30:00.000Z",
    weightKg: 0.9,
  },
];

export const seedRouteConfigs: Record<CheckoutRoute, { minimumFeeNgn: number; pricePerKgUsd: number }> = {
  air: { minimumFeeNgn: 10000, pricePerKgUsd: 4.5 },
  sea: { minimumFeeNgn: 7000, pricePerKgUsd: 3 },
};

export const seedCartItems: SeedCartItem[] = [
  {
    id: "seed-cart-1",
    imageUrl: seedProducts[0]!.coverImageUrl,
    priceDisplay: "NGN 68,000",
    productId: seedProducts[0]!.id,
    quantity: 1,
    sellPriceNgn: seedProducts[0]!.basePriceNgn,
    slug: seedProducts[0]!.slug,
    title: seedProducts[0]!.title,
    weightKg: seedProducts[0]!.weightKg,
  },
];

export const seedConsignees: SeedConsignee[] = [
  {
    cityOrState: "Lagos",
    fullName: "Ayo Johnson",
    id: "seed-consignee-1",
    isDefault: true,
    notes: "Preferred consignee for hub pickup validation.",
    phone: "+2348012345678",
    userId: seedUserId,
  },
  {
    cityOrState: "Abuja",
    fullName: "Tosin Ade",
    id: "seed-consignee-2",
    isDefault: false,
    notes: "Secondary consignee for dashboard and order timeline checks.",
    phone: "+2348098765432",
    userId: seedUserId,
  },
];

export const seedOrders: SeedOrder[] = [
  {
    consigneeId: seedConsignees[0]!.id,
    createdAt: "2026-04-17T09:00:00.000Z",
    grandTotalNgn: 78000,
    id: "seed-order-1001",
    items: seedCartItems,
    logisticsTotalNgn: 10000,
    paymentReference: "seed-paystack-ref-1001",
    productSubtotalNgn: 68000,
    route: "air",
    status: "processing",
    userId: seedUserId,
  },
  {
    consigneeId: seedConsignees[1]!.id,
    createdAt: "2026-04-16T15:30:00.000Z",
    grandTotalNgn: 51000,
    id: "seed-order-1000",
    items: [
      {
        id: "seed-cart-2",
        imageUrl: seedProducts[0]!.coverImageUrl,
        priceDisplay: "NGN 68,000",
        productId: seedProducts[0]!.id,
        quantity: 1,
        sellPriceNgn: 42000,
        slug: seedProducts[1]!.slug,
        title: seedProducts[1]!.title,
        weightKg: seedProducts[1]!.weightKg,
      },
    ],
    logisticsTotalNgn: 9000,
    paymentReference: "seed-paystack-ref-1000",
    productSubtotalNgn: 42000,
    route: "sea",
    status: "shipped",
    userId: seedUserId,
  },
];
