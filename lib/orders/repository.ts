import { getOptionalServerEnv } from "@/lib/config/env";
import {
  seedCartItems,
  seedConsignees,
  seedOrders,
  seedRouteConfigs,
  seedUserId,
  type SeedConsignee,
  type SeedOrder,
} from "@/lib/demo/manual-upload-seed";
import type { CheckoutRoute, OrderStatus } from "@/lib/domain/types";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export type CartItemRecord = {
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
  items: CartItemRecord[];
  logisticsTotalNgn: number;
  paymentReference: string | null;
  productSubtotalNgn: number;
  route: CheckoutRoute;
  status: OrderStatus;
};

function formatCreatedLabel(dateIso: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateIso));
}

function mapSeedConsignee(consignee: SeedConsignee): ConsigneeRecord {
  return {
    cityOrState: consignee.cityOrState,
    fullName: consignee.fullName,
    id: consignee.id,
    isDefault: consignee.isDefault,
    notes: consignee.notes,
    phone: consignee.phone,
  };
}

function mapSeedOrder(order: SeedOrder): OrderRecord {
  return {
    consigneeId: order.consigneeId,
    createdLabel: formatCreatedLabel(order.createdAt),
    grandTotalNgn: order.grandTotalNgn,
    id: order.id,
    items: order.items,
    logisticsTotalNgn: order.logisticsTotalNgn,
    paymentReference: order.paymentReference,
    productSubtotalNgn: order.productSubtotalNgn,
    route: order.route,
    status: order.status,
  };
}

export function listSeedCartItems() {
  return seedCartItems;
}

export function listRouteConfigs() {
  return seedRouteConfigs;
}

export async function listConsignees(userId = seedUserId) {
  const { supabaseServiceRoleKey } = getOptionalServerEnv();

  if (!supabaseServiceRoleKey) {
    return seedConsignees.filter((consignee) => consignee.userId === userId).map(mapSeedConsignee);
  }

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("consignees")
      .select("id, full_name, phone, city_or_state, notes, is_default")
      .eq("user_id", userId)
      .order("is_default", { ascending: false });

    if (error || !data?.length) {
      return seedConsignees.filter((consignee) => consignee.userId === userId).map(mapSeedConsignee);
    }

    return data.map((consignee) => ({
      cityOrState: consignee.city_or_state,
      fullName: consignee.full_name,
      id: consignee.id,
      isDefault: consignee.is_default,
      notes: consignee.notes ?? "",
      phone: consignee.phone,
    }));
  } catch {
    return seedConsignees.filter((consignee) => consignee.userId === userId).map(mapSeedConsignee);
  }
}

export async function listOrders(userId = seedUserId) {
  const { supabaseServiceRoleKey } = getOptionalServerEnv();

  if (!supabaseServiceRoleKey) {
    return seedOrders.filter((order) => order.userId === userId).map(mapSeedOrder);
  }

  try {
    const supabase = createSupabaseServiceRoleClient();
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, consignee_id, route, status, grand_total_ngn, product_subtotal_ngn, logistics_total_ngn, payment_reference, created_at, order_items(id, product_title_snapshot, quantity, product_unit_price_ngn_snapshot, weight_kg_snapshot, product_id)",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data?.length) {
      return seedOrders.filter((order) => order.userId === userId).map(mapSeedOrder);
    }

    return (data as Array<Record<string, any>>).map((order) => ({
      consigneeId: String(order.consignee_id),
      createdLabel: formatCreatedLabel(String(order.created_at)),
      grandTotalNgn: Number(order.grand_total_ngn ?? 0),
      id: String(order.id),
      items:
        ((order.order_items as Array<Record<string, any>> | undefined) ?? []).map((item) => ({
          id: String(item.id),
          imageUrl: "/ProductImage.jpg",
          priceDisplay: `NGN ${Number(item.product_unit_price_ngn_snapshot ?? 0).toLocaleString("en-NG")}`,
          productId: String(item.product_id ?? "deleted-product"),
          quantity: Number(item.quantity ?? 0),
          sellPriceNgn: Number(item.product_unit_price_ngn_snapshot ?? 0),
          slug: "manual-product-image-item",
          title: String(item.product_title_snapshot ?? "Product Image Sample"),
          weightKg: Number(item.weight_kg_snapshot ?? 0),
        })),
      logisticsTotalNgn: Number(order.logistics_total_ngn ?? 0),
      paymentReference: typeof order.payment_reference === "string" ? order.payment_reference : null,
      productSubtotalNgn: Number(order.product_subtotal_ngn ?? 0),
      route: order.route as CheckoutRoute,
      status: order.status as OrderStatus,
    }));
  } catch {
    return seedOrders.filter((order) => order.userId === userId).map(mapSeedOrder);
  }
}

export async function findOrderById(orderId: string, userId = seedUserId) {
  return (await listOrders(userId)).find((order) => order.id === orderId) ?? null;
}

export async function findConsigneeById(consigneeId: string, userId = seedUserId) {
  return (await listConsignees(userId)).find((consignee) => consignee.id === consigneeId) ?? null;
}

export async function listAdminOrders() {
  return listOrders();
}
