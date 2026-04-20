import { getPublicEnv } from "@/lib/config/env";
import type { CheckoutRoute, OrderStatus } from "@/lib/domain/types";
import { quoteOrderTotals } from "@/lib/pricing/calculate";
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "@/lib/supabase/server";

const USD_TO_NGN_RATE = 1_600;

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
  paymentStatus: "failed" | "paid" | "pending";
  productSubtotalNgn: number;
  route: CheckoutRoute;
  status: OrderStatus;
};

type CreateOrderInput = {
  cartItems: CartItemRecord[];
  consigneeId: string;
  route: CheckoutRoute;
  userId: string;
};

type OrderSummaryRecord = {
  grandTotalNgn: number;
  logisticsTotalNgn: number;
  productSubtotalNgn: number;
};

type RouteConfigRecord = Record<CheckoutRoute, { minimumFeeNgn: number; pricePerKgUsd: number }>;

function formatCreatedLabel(dateIso: string) {
  const date = new Date(dateIso);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function mapConsigneeRow(consignee: Record<string, unknown>): ConsigneeRecord {
  return {
    cityOrState: String(consignee.city_or_state ?? ""),
    fullName: String(consignee.full_name ?? ""),
    id: String(consignee.id),
    isDefault: Boolean(consignee.is_default),
    notes: typeof consignee.notes === "string" ? consignee.notes : "",
    phone: String(consignee.phone ?? ""),
  };
}

function mapOrderItemRow(item: Record<string, unknown>): CartItemRecord {
  return {
    id: String(item.id),
    imageUrl: typeof item.cover_image_url === "string" ? item.cover_image_url : "/ProductImage.jpg",
    priceDisplay: formatNaira(Number(item.product_unit_price_ngn_snapshot ?? item.sell_price_ngn ?? 0)),
    productId: String(item.product_id ?? item.id ?? "deleted-product"),
    quantity: Number(item.quantity ?? 1),
    sellPriceNgn: Number(item.product_unit_price_ngn_snapshot ?? item.sell_price_ngn ?? 0),
    slug: typeof item.slug === "string" ? item.slug : "manual-product-image-item",
    title: String(item.product_title_snapshot ?? item.title ?? "Product Image Sample"),
    weightKg: Number(item.weight_kg_snapshot ?? item.weight_kg ?? 0),
  };
}

function mapOrderRow(order: Record<string, unknown>): OrderRecord {
  const orderItems = Array.isArray(order.order_items) ? order.order_items : [];

  return {
    consigneeId: String(order.consignee_id),
    createdLabel: formatCreatedLabel(String(order.created_at)),
    grandTotalNgn: Number(order.grand_total_ngn ?? 0),
    id: String(order.id),
    items: orderItems.map((item) => mapOrderItemRow(item as Record<string, unknown>)),
    logisticsTotalNgn: Number(order.logistics_total_ngn ?? 0),
    paymentReference: typeof order.payment_reference === "string" ? order.payment_reference : null,
    paymentStatus: (order.payment_status as OrderRecord["paymentStatus"] | undefined) ?? "pending",
    productSubtotalNgn: Number(order.product_subtotal_ngn ?? 0),
    route: order.route as CheckoutRoute,
    status: order.status as OrderStatus,
  };
}

function buildOrderSummary(cartItems: CartItemRecord[], route: CheckoutRoute, routeConfigs: RouteConfigRecord): OrderSummaryRecord {
  const totals = quoteOrderTotals({
    items: cartItems.map((item) => ({
      productTitle: item.title,
      quantity: item.quantity,
      sellPriceNgn: item.sellPriceNgn,
      weightKg: item.weightKg,
    })),
    routeConfig: routeConfigs[route],
    usdToNgnRate: USD_TO_NGN_RATE,
  });

  return {
    grandTotalNgn: totals.grandTotalNgn,
    logisticsTotalNgn: totals.logisticsTotalNgn,
    productSubtotalNgn: totals.productSubtotalNgn,
  };
}

function mapJoinedOrders(data: Array<Record<string, unknown>>) {
  return data.map((order) => ({
    ...order,
    order_items: ((order.order_items as Array<Record<string, unknown>> | undefined) ?? []).map((item) => ({
      ...item,
      cover_image_url:
        item.products && typeof item.products === "object" && "cover_image_url" in item.products
          ? item.products.cover_image_url
          : "/ProductImage.jpg",
      slug:
        item.products && typeof item.products === "object" && "slug" in item.products
          ? item.products.slug
          : "manual-product-image-item",
    })),
  }));
}

async function selectOrdersForUser(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, consignee_id, route, status, grand_total_ngn, product_subtotal_ngn, logistics_total_ngn, payment_reference, payment_status, created_at, order_items(id, product_id, product_title_snapshot, quantity, product_unit_price_ngn_snapshot, weight_kg_snapshot, products(slug, cover_image_url))",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return mapJoinedOrders((data ?? []) as Array<Record<string, unknown>>);
}

async function selectOrdersForAdmin() {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, consignee_id, route, status, grand_total_ngn, product_subtotal_ngn, logistics_total_ngn, payment_reference, payment_status, created_at, order_items(id, product_id, product_title_snapshot, quantity, product_unit_price_ngn_snapshot, weight_kg_snapshot, products(slug, cover_image_url))",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return mapJoinedOrders((data ?? []) as Array<Record<string, unknown>>);
}

export async function listCheckoutCartItems() {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, title, sell_price_ngn, weight_kg, cover_image_url")
    .eq("status", "live")
    .order("featured", { ascending: false })
    .limit(1);

  if (error) {
    throw error;
  }

  return (data ?? []).map((product) => ({
    id: `cart-${product.id}`,
    imageUrl: product.cover_image_url ?? "/ProductImage.jpg",
    priceDisplay: formatNaira(Number(product.sell_price_ngn ?? 0)),
    productId: product.id,
    quantity: 1,
    sellPriceNgn: Number(product.sell_price_ngn ?? 0),
    slug: product.slug,
    title: product.title,
    weightKg: Number(product.weight_kg ?? 0),
  }));
}

export async function listRouteConfigs() {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("shipping_configs")
    .select("route, minimum_fee_ngn, price_per_kg_usd")
    .eq("active", true);

  if (error) {
    throw error;
  }

  const configs = (data ?? []).reduce<RouteConfigRecord>((allConfigs, config) => {
    const route = config.route as CheckoutRoute;

    allConfigs[route] = {
      minimumFeeNgn: Number(config.minimum_fee_ngn ?? 0),
      pricePerKgUsd: Number(config.price_per_kg_usd ?? 0),
    };

    return allConfigs;
  }, {} as RouteConfigRecord);

  if (!configs.air || !configs.sea) {
    throw new Error("Shipping route configuration is incomplete. Configure both Air and Sea routes in shipping settings.");
  }

  return configs;
}

export async function listConsignees(userId?: string | null) {
  if (!userId) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("consignees")
    .select("id, full_name, phone, city_or_state, notes, is_default")
    .eq("user_id", userId)
    .order("is_default", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((consignee) => mapConsigneeRow(consignee as Record<string, unknown>));
}

export async function listOrders(userId?: string | null) {
  if (!userId) {
    return [];
  }

  const data = await selectOrdersForUser(userId);
  return data.map((order) => mapOrderRow(order as Record<string, unknown>));
}

export async function findOrderById(orderId: string, userId?: string | null) {
  return (await listOrders(userId)).find((order) => order.id === orderId) ?? null;
}

export async function findConsigneeById(consigneeId: string, userId?: string | null) {
  return (await listConsignees(userId)).find((consignee) => consignee.id === consigneeId) ?? null;
}

export async function listAdminOrders() {
  const data = await selectOrdersForAdmin();
  return data.map((order) => mapOrderRow(order as Record<string, unknown>));
}

export async function findAdminOrderById(orderId: string) {
  return (await listAdminOrders()).find((order) => order.id === orderId) ?? null;
}

export async function findAdminConsigneeById(consigneeId: string) {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("consignees")
    .select("id, full_name, phone, city_or_state, notes, is_default")
    .eq("id", consigneeId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapConsigneeRow(data as Record<string, unknown>) : null;
}

export async function createConsigneeForUser(
  userId: string,
  input: {
    cityOrState: string;
    fullName: string;
    isDefault: boolean;
    notes?: string;
    phone: string;
  },
) {
  const supabase = createSupabaseServiceRoleClient();

  if (input.isDefault) {
    await supabase.from("consignees").update({ is_default: false }).eq("user_id", userId);
  }

  const { data, error } = await supabase
    .from("consignees")
    .insert({
      city_or_state: input.cityOrState,
      full_name: input.fullName,
      is_default: input.isDefault,
      notes: input.notes ?? "",
      phone: input.phone,
      user_id: userId,
    })
    .select("id, full_name, phone, city_or_state, notes, is_default")
    .single();

  if (error) {
    throw error;
  }

  return mapConsigneeRow(data as Record<string, unknown>);
}

export async function createPendingOrder(input: CreateOrderInput) {
  const routeConfigs = await listRouteConfigs();
  const totals = buildOrderSummary(input.cartItems, input.route, routeConfigs);
  const supabase = createSupabaseServiceRoleClient();
  const publicEnv = getPublicEnv();

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      consignee_id: input.consigneeId,
      currency: "NGN",
      grand_total_ngn: totals.grandTotalNgn,
      logistics_total_ngn: totals.logisticsTotalNgn,
      payment_reference: null,
      payment_status: "pending",
      product_subtotal_ngn: totals.productSubtotalNgn,
      route: input.route,
      status: "pending",
      user_id: input.userId,
    })
    .select("id")
    .single();

  if (orderError) {
    throw orderError;
  }

  const orderId = String(orderData?.id);
  const lineTotals = quoteOrderTotals({
    items: input.cartItems.map((item) => ({
      productTitle: item.title,
      quantity: item.quantity,
      sellPriceNgn: item.sellPriceNgn,
      weightKg: item.weightKg,
    })),
    routeConfig: routeConfigs[input.route],
    usdToNgnRate: USD_TO_NGN_RATE,
  });

  const { error: itemError } = await supabase.from("order_items").insert(
    input.cartItems.map((item, index) => ({
      line_total_ngn_snapshot: item.sellPriceNgn * item.quantity + lineTotals.lines[index].logisticsFeeNgn,
      logistics_fee_ngn_snapshot: lineTotals.lines[index].logisticsFeeNgn,
      moq_snapshot: 1,
      order_id: orderId,
      product_id: item.productId,
      product_title_snapshot: item.title,
      product_unit_price_ngn_snapshot: item.sellPriceNgn,
      quantity: item.quantity,
      weight_kg_snapshot: item.weightKg,
    })),
  );

  if (itemError) {
    throw itemError;
  }

  await supabase.from("order_status_events").insert({
    note: "Checkout created and awaiting Paystack payment completion.",
    order_id: orderId,
    status: "pending",
  });

  return {
    callbackUrl: publicEnv.siteUrl ? new URL("/payment/pending", publicEnv.siteUrl).toString() : "/payment/pending",
    orderId,
    totals,
  };
}

export async function attachPaystackReference(orderId: string, input: { authorizationUrl?: string | null; paymentReference: string }) {
  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase
    .from("orders")
    .update({
      paystack_authorization_url: input.authorizationUrl ?? null,
      payment_reference: input.paymentReference,
    })
    .eq("id", orderId);

  if (error) {
    throw error;
  }
}

export async function findOrderByPaymentReference(reference: string) {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, user_id")
    .eq("payment_reference", reference)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data
    ? {
        id: String(data.id),
        userId: String(data.user_id),
      }
    : null;
}

export async function updateOrderPaymentState(input: {
  note: string;
  orderId: string;
  paymentStatus: OrderRecord["paymentStatus"];
  status: OrderStatus;
}) {
  const supabase = createSupabaseServiceRoleClient();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: input.paymentStatus,
      payment_verified_at: input.paymentStatus === "paid" ? now : null,
      status: input.status,
    })
    .eq("id", input.orderId);

  if (error) {
    throw error;
  }

  await supabase.from("order_status_events").insert({
    note: input.note,
    order_id: input.orderId,
    status: input.status,
  });
}

export async function updateOrderStatus(input: { note?: string; orderId: string; status: OrderStatus }) {
  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase.from("orders").update({ status: input.status }).eq("id", input.orderId);

  if (error) {
    throw error;
  }

  await supabase.from("order_status_events").insert({
    note: input.note ?? null,
    order_id: input.orderId,
    status: input.status,
  });
}

export async function recordPaystackEvent(input: {
  dedupeKey: string;
  eventType: string;
  orderId?: string | null;
  payload: Record<string, unknown>;
  paymentReference?: string | null;
}) {
  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase.from("paystack_events").upsert(
    {
      dedupe_key: input.dedupeKey,
      event_type: input.eventType,
      order_id: input.orderId ?? null,
      payload: input.payload,
      payment_reference: input.paymentReference ?? null,
    },
    {
      onConflict: "dedupe_key",
    },
  );

  if (error) {
    throw error;
  }
}
