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
    basePriceNgn: 92000,
    category: "Fashion & Accessories",
    coverImageUrl: "/ProductImage.jpg",
    description: "A polished manual-upload product used to validate storefront, checkout, and admin flows.",
    id: "11111111-1111-1111-1111-111111111111",
    longDescription:
      "This manual-upload fixture is centered on ProductImage.jpg so the catalog, checkout, and BI flows can be tested repeatedly without consuming ELIM free-tier requests.",
    moq: 1,
    shortDescription: "Manual-upload flagship product",
    slug: "manual-product-image-item",
    specs: ["Manual upload path", "Admin-controlled pricing", "Route-based checkout logistics"],
    status: "live",
    title: "Product Image Sample",
    updatedAt: "2026-04-17T10:00:00.000Z",
    weightKg: 1.4,
  },
  {
    basePriceNgn: 81000,
    category: "Lighting",
    coverImageUrl: "/ProductImage.jpg",
    description: "Secondary manual-upload product for table, BI, and order-state coverage.",
    id: "22222222-2222-2222-2222-222222222222",
    longDescription:
      "A second manual-upload fixture shares the same canonical image so QA can exercise multiple rows without adding external asset dependencies.",
    moq: 2,
    shortDescription: "ELIM-linked test product for admin QA.",
    slug: "elim-floor-lamp",
    specs: ["Secondary QA product", "MOQ 2", "Same local asset"],
    status: "draft",
    title: "ELIM Floor Lamp",
    updatedAt: "2026-04-17T08:30:00.000Z",
    weightKg: 2.8,
  },
];

export const seedRouteConfigs: Record<CheckoutRoute, { minimumFeeNgn: number; pricePerKgUsd: number }> = {
  air: { minimumFeeNgn: 18000, pricePerKgUsd: 14 },
  sea: { minimumFeeNgn: 9000, pricePerKgUsd: 6 },
};

export const seedCartItems: SeedCartItem[] = [
  {
    id: "seed-cart-1",
    imageUrl: seedProducts[0]!.coverImageUrl,
    priceDisplay: "NGN 92,000",
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
    fullName: "Ngozi Receiver",
    id: "66666666-6666-6666-6666-666666666661",
    isDefault: true,
    notes: "Default Lagos hub pickup contact.",
    phone: "+2348000000001",
    userId: seedUserId,
  },
  {
    cityOrState: "Abuja",
    fullName: "Tunde Receiver",
    id: "66666666-6666-6666-6666-666666666662",
    isDefault: false,
    notes: "Backup Abuja consignee for alternate routing.",
    phone: "+2348000000002",
    userId: seedUserId,
  },
];

export const seedOrders: SeedOrder[] = [
  {
    consigneeId: seedConsignees[0]!.id,
    createdAt: "2026-04-17T09:00:00.000Z",
    grandTotalNgn: 123360,
    id: "77777777-7777-7777-7777-777777777771",
    items: seedCartItems,
    logisticsTotalNgn: 31360,
    paymentReference: "demo-paystack-ref-1001",
    productSubtotalNgn: 92000,
    route: "air",
    status: "processing",
    userId: seedUserId,
  },
  {
    consigneeId: seedConsignees[1]!.id,
    createdAt: "2026-04-16T15:30:00.000Z",
    grandTotalNgn: 105440,
    id: "77777777-7777-7777-7777-777777777772",
    items: [
      {
        id: "seed-cart-2",
        imageUrl: seedProducts[0]!.coverImageUrl,
        priceDisplay: "NGN 92,000",
        productId: seedProducts[0]!.id,
        quantity: 1,
        sellPriceNgn: 92000,
        slug: seedProducts[0]!.slug,
        title: seedProducts[0]!.title,
        weightKg: seedProducts[0]!.weightKg,
      },
    ],
    logisticsTotalNgn: 13440,
    paymentReference: "demo-paystack-ref-1000",
    productSubtotalNgn: 92000,
    route: "sea",
    status: "delivered",
    userId: seedUserId,
  },
];
