import type { CheckoutRoute, OrderStatus } from "@/lib/domain/types";
import { storefrontProducts } from "@/lib/catalog/mock-storefront-data";

export type CartItem = {
  id: string;
  imageUrl: string;
  priceDisplay: string;
  quantity: number;
  sellPriceNgn: number;
  slug: string;
  title: string;
  weightKg: number;
};

export type ConsigneeRecord = {
  cityOrState: string;
  fullName: string;
  id: string;
  isDefault: boolean;
  notes: string;
  phone: string;
};

export type OrderRecord = {
  consigneeId: string;
  createdLabel: string;
  grandTotalNgn: number;
  id: string;
  items: CartItem[];
  route: CheckoutRoute;
  status: OrderStatus;
};

export const mockCartItems: CartItem[] = [
  {
    id: "cart-1",
    imageUrl: storefrontProducts[0]!.imageUrl,
    priceDisplay: storefrontProducts[0]!.priceDisplay,
    quantity: 2,
    sellPriceNgn: storefrontProducts[0]!.sellPriceNgn,
    slug: storefrontProducts[0]!.slug,
    title: storefrontProducts[0]!.title,
    weightKg: 1.5,
  },
  {
    id: "cart-2",
    imageUrl: storefrontProducts[1]!.imageUrl,
    priceDisplay: storefrontProducts[1]!.priceDisplay,
    quantity: 1,
    sellPriceNgn: storefrontProducts[1]!.sellPriceNgn,
    slug: storefrontProducts[1]!.slug,
    title: storefrontProducts[1]!.title,
    weightKg: 3,
  },
];

export const mockRouteConfigs: Record<CheckoutRoute, { minimumFeeNgn: number; pricePerKgUsd: number }> = {
  air: { minimumFeeNgn: 10000, pricePerKgUsd: 4.5 },
  sea: { minimumFeeNgn: 7000, pricePerKgUsd: 3 },
};

export const mockConsignees: ConsigneeRecord[] = [
  {
    cityOrState: "Lagos",
    fullName: "Ayo Johnson",
    id: "consignee-1",
    isDefault: true,
    notes: "Preferred for family deliveries into Lagos hub.",
    phone: "+2348012345678",
  },
  {
    cityOrState: "Abuja",
    fullName: "Tosin Ade",
    id: "consignee-2",
    isDefault: false,
    notes: "Use for northern pickups and office collections.",
    phone: "+2348098765432",
  },
];

export const mockOrders: OrderRecord[] = [
  {
    consigneeId: "consignee-1",
    createdLabel: "Today",
    grandTotalNgn: 189200,
    id: "order-1001",
    items: mockCartItems,
    route: "air",
    status: "processing",
  },
  {
    consigneeId: "consignee-2",
    createdLabel: "Yesterday",
    grandTotalNgn: 142500,
    id: "order-1000",
    items: [
      {
        id: "cart-3",
        imageUrl: storefrontProducts[2]!.imageUrl,
        priceDisplay: storefrontProducts[2]!.priceDisplay,
        quantity: 1,
        sellPriceNgn: storefrontProducts[2]!.sellPriceNgn,
        slug: storefrontProducts[2]!.slug,
        title: storefrontProducts[2]!.title,
        weightKg: 2,
      },
    ],
    route: "sea",
    status: "shipped",
  },
];

export function getMockOrderById(orderId: string) {
  return mockOrders.find((order) => order.id === orderId) ?? null;
}

export function getMockConsigneeById(consigneeId: string) {
  return mockConsignees.find((consignee) => consignee.id === consigneeId) ?? null;
}
