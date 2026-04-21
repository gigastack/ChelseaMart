import { getPublicEnv } from "@/lib/config/env";
import type {
  MeasurementBasis,
  OrderStatus,
  ProductPaymentStatus,
  RouteAcceptanceSnapshot,
  ShipmentQuoteSnapshot,
  ShippingMode,
  ShippingPaymentStatus,
} from "@/lib/domain/types";
import { formatMoney } from "@/lib/currency/format";
import { convertCnyToNgn } from "@/lib/pricing/calculate";
import { getCommerceSettings } from "@/lib/settings/repository";
import { resolveEffectiveMoq } from "@/lib/settings/commerce-settings";
import { buildRouteAcceptanceSnapshot, calculateShippingInvoice } from "@/lib/logistics/two-phase";
import { createRouteAcceptedOrder } from "@/lib/orders/create-order";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

const DEFAULT_SERVICE_FEE_NGN = 0;

export type CartItemRecord = {
  effectiveMoq: number;
  id: string;
  imageUrl: string;
  priceDisplay: string;
  priceDisplayNgn: string;
  productId: string;
  quantity: number;
  sellPriceCny: number;
  sellPriceNgn: number;
  slug: string;
  title: string;
  volumeCbm: number | null;
  weightKg: number | null;
};

export type ConsigneeRecord = {
  cityOrState: string;
  fullName: string;
  id: string;
  isDefault: boolean;
  notes: string;
  phone: string;
};

export type ShippingRouteRecord = {
  destinationLabel: string;
  etaDaysMax: number;
  etaDaysMin: number;
  formulaKind: "per_cbm" | "per_kg";
  formulaLabel: string;
  id: string;
  mode: ShippingMode;
  originLabel: string;
  pricePerCbm: number | null;
  pricePerKg: number | null;
  rateCurrency: "NGN" | "USD";
  termsSummary: string;
  title: string;
  usdToNgnRate: number | null;
  versionId: string;
  versionLabel: string;
};

export type ShipmentRecord = {
  customerNotifiedAt: string | null;
  id: string;
  measuredAt: string | null;
  measuredByProfileId: string | null;
  measuredVolumeCbm: number | null;
  measuredWeightKg: number | null;
  measurementBasis: MeasurementBasis | null;
  shippingCostUsd: number | null;
  shippingCostNgn: number | null;
  shippingQuoteSnapshot: ShipmentQuoteSnapshot | null;
  weighingProofMimeType: string | null;
  weighingProofPath: string | null;
};

export type OrderRecord = {
  consigneeId: string;
  createdLabel: string;
  grandTotalNgn: number;
  id: string;
  items: CartItemRecord[];
  logisticsTotalNgn: number;
  paymentReference: string | null;
  paymentStatus: ProductPaymentStatus;
  productPaymentReference: string | null;
  productPaymentCnyToNgnRate: number;
  productPaymentState: ProductPaymentStatus;
  productSubtotalCny: number;
  productPaymentTotalNgn: number;
  productSubtotalNgn: number;
  route: ShippingMode | null;
  routeSnapshot: RouteAcceptanceSnapshot | null;
  serviceFeeNgn: number;
  shipment: ShipmentRecord | null;
  shippingCostUsd: number | null;
  shippingCostNgn: number | null;
  shippingPaymentReference: string | null;
  shippingPaymentState: ShippingPaymentStatus;
  status: OrderStatus;
};

type RouteAcceptedOrderInput = {
  cartItems: CartItemRecord[];
  consigneeId: string;
  shippingRouteId: string;
  userId: string;
};

type ProductPaymentLookup = {
  orderId: string;
  paymentId: string;
};

type ShippingPaymentLookup = {
  orderId: string;
  paymentId: string;
};

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

function asNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    return Number(value);
  }

  return 0;
}

function asNullableNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return asNumber(value);
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
  const sellPriceCny = asNumber(item.product_unit_price_cny_snapshot ?? 0);
  const sellPriceNgn = asNumber(item.product_unit_price_ngn_snapshot ?? 0);

  return {
    effectiveMoq: asNumber(item.effective_moq_snapshot ?? item.moq_snapshot ?? 1),
    id: String(item.id),
    imageUrl:
      item.products && typeof item.products === "object" && "cover_image_url" in item.products
        ? String(item.products.cover_image_url ?? "/ProductImage.jpg")
        : "/ProductImage.jpg",
    priceDisplay: formatMoney(sellPriceCny, "CNY"),
    priceDisplayNgn: formatMoney(sellPriceNgn, "NGN"),
    productId: String(item.product_id ?? item.id ?? "deleted-product"),
    quantity: asNumber(item.quantity ?? 1),
    sellPriceCny,
    sellPriceNgn,
    slug:
      item.products && typeof item.products === "object" && "slug" in item.products
        ? String(item.products.slug ?? "manual-product-image-item")
        : "manual-product-image-item",
    title: String(item.product_title_snapshot ?? "Product Image Sample"),
    volumeCbm: asNullableNumber(item.volume_cbm_snapshot),
    weightKg: asNullableNumber(item.weight_kg_snapshot),
  };
}

function mapShipmentRow(shipment: Record<string, unknown> | null | undefined): ShipmentRecord | null {
  if (!shipment) {
    return null;
  }

  return {
    customerNotifiedAt:
      typeof shipment.customer_notified_at === "string" ? shipment.customer_notified_at : null,
    id: String(shipment.id),
    measuredAt: typeof shipment.measured_at === "string" ? shipment.measured_at : null,
    measuredByProfileId:
      typeof shipment.measured_by_profile_id === "string" ? shipment.measured_by_profile_id : null,
    measuredVolumeCbm: asNullableNumber(shipment.measured_volume_cbm),
    measuredWeightKg: asNullableNumber(shipment.measured_weight_kg),
    measurementBasis:
      shipment.measurement_basis === "weight_kg" || shipment.measurement_basis === "volume_cbm"
        ? shipment.measurement_basis
        : null,
    shippingCostUsd: asNullableNumber(shipment.shipping_cost_usd),
    shippingCostNgn: asNullableNumber(shipment.shipping_cost_ngn),
    shippingQuoteSnapshot:
      shipment.shipping_quote_snapshot && typeof shipment.shipping_quote_snapshot === "object"
        ? (shipment.shipping_quote_snapshot as ShipmentQuoteSnapshot)
        : null,
    weighingProofMimeType:
      typeof shipment.weighing_proof_mime_type === "string" ? shipment.weighing_proof_mime_type : null,
    weighingProofPath:
      typeof shipment.weighing_proof_path === "string" ? shipment.weighing_proof_path : null,
  };
}

function mapOrderRow(order: Record<string, unknown>): OrderRecord {
  const orderItems = Array.isArray(order.order_items) ? order.order_items : [];
  const productPayments = Array.isArray(order.product_payments) ? order.product_payments : [];
  const shippingPayments = Array.isArray(order.shipping_payments) ? order.shipping_payments : [];
  const shipmentRows = Array.isArray(order.order_shipments) ? order.order_shipments : [];
  const shipment = shipmentRows.length > 0 ? mapShipmentRow(shipmentRows[0] as Record<string, unknown>) : null;
  const productPaymentReference =
    productPayments[0] && typeof productPayments[0] === "object" && "payment_reference" in productPayments[0]
      ? String(productPayments[0].payment_reference ?? "")
      : null;
  const shippingPaymentReference =
    shippingPayments[0] && typeof shippingPayments[0] === "object" && "payment_reference" in shippingPayments[0]
      ? String(shippingPayments[0].payment_reference ?? "")
      : null;

  return {
    consigneeId: String(order.consignee_id),
    createdLabel: formatCreatedLabel(String(order.created_at)),
    grandTotalNgn: asNumber(order.grand_total_ngn ?? 0),
    id: String(order.id),
    items: orderItems.map((item) => mapOrderItemRow(item as Record<string, unknown>)),
    logisticsTotalNgn: asNumber(order.logistics_total_ngn ?? 0),
    paymentReference: productPaymentReference || null,
    paymentStatus:
      order.product_payment_state === "paid" || order.product_payment_state === "failed"
        ? order.product_payment_state
        : "pending",
    productPaymentReference: productPaymentReference || null,
    productPaymentCnyToNgnRate: asNumber(order.product_payment_cny_to_ngn_rate ?? 1),
    productPaymentState:
      order.product_payment_state === "paid" || order.product_payment_state === "failed"
        ? order.product_payment_state
        : "pending",
    productSubtotalCny: asNumber(order.product_subtotal_cny ?? 0),
    productPaymentTotalNgn: asNumber(order.product_payment_total_ngn ?? order.product_subtotal_ngn ?? 0),
    productSubtotalNgn: asNumber(order.product_subtotal_ngn ?? 0),
    route: order.route === "air" || order.route === "sea" ? order.route : null,
    routeSnapshot:
      order.route_snapshot && typeof order.route_snapshot === "object"
        ? (order.route_snapshot as RouteAcceptanceSnapshot)
        : null,
    serviceFeeNgn: asNumber(order.service_fee_ngn ?? 0),
    shipment,
    shippingCostUsd: shipment?.shippingCostUsd ?? asNullableNumber(order.shipping_cost_usd),
    shippingCostNgn: asNullableNumber(order.shipping_cost_ngn),
    shippingPaymentReference: shippingPaymentReference || null,
    shippingPaymentState:
      order.shipping_payment_state === "paid" ||
      order.shipping_payment_state === "failed" ||
      order.shipping_payment_state === "pending"
        ? order.shipping_payment_state
        : "not_due",
    status: String(order.status ?? "cart") as OrderStatus,
  };
}

async function selectOrders(where: { orderId?: string; userId?: string } = {}) {
  const supabase = createSupabaseServiceRoleClient();
  let query = supabase
    .from("orders")
    .select(
      "id, consignee_id, route, shipping_route_id, shipping_route_version_id, route_accepted, route_accepted_at, route_snapshot, status, currency, product_subtotal_cny, product_subtotal_ngn, product_payment_cny_to_ngn_rate, service_fee_ngn, product_payment_total_ngn, logistics_total_ngn, shipping_cost_ngn, grand_total_ngn, payment_reference, product_payment_state, shipping_payment_state, created_at, order_items(id, product_id, product_title_snapshot, quantity, moq_snapshot, effective_moq_snapshot, weight_kg_snapshot, volume_cbm_snapshot, product_unit_price_cny_snapshot, product_unit_price_ngn_snapshot, logistics_fee_ngn_snapshot, line_total_cny_snapshot, line_total_ngn_snapshot, products(slug, cover_image_url)), order_shipments(id, measurement_basis, measured_weight_kg, measured_volume_cbm, measured_at, measured_by_profile_id, weighing_proof_path, weighing_proof_mime_type, shipping_quote_snapshot, shipping_cost_usd, shipping_cost_ngn, customer_notified_at), product_payments(id, payment_reference, status, amount_ngn, paid_at), shipping_payments(id, payment_reference, status, amount_ngn, paid_at)",
    )
    .order("created_at", { ascending: false });

  if (where.userId) {
    query = query.eq("user_id", where.userId);
  }

  if (where.orderId) {
    query = query.eq("id", where.orderId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []) as Array<Record<string, unknown>>;
}

async function getShippingRoutesWithVersions() {
  const supabase = createSupabaseServiceRoleClient();
  const [{ data: routes, error: routeError }, { data: versions, error: versionError }] = await Promise.all([
    supabase
      .from("shipping_routes")
      .select("id, title, origin_label, destination_label, mode, formula_label, eta_days_min, eta_days_max, terms_summary, active")
      .eq("active", true)
      .order("created_at", { ascending: true }),
    supabase
      .from("shipping_route_versions")
      .select("id, route_id, version_label, formula_kind, formula_label, rate_currency, price_per_kg, price_per_cbm, usd_to_ngn_rate, active")
      .eq("active", true)
      .order("created_at", { ascending: false }),
  ]);

  if (routeError) {
    throw routeError;
  }

  if (versionError) {
    throw versionError;
  }

  const versionsByRoute = new Map<string, Record<string, unknown>>();

  for (const version of versions ?? []) {
    const routeId = String(version.route_id);
    if (!versionsByRoute.has(routeId)) {
      versionsByRoute.set(routeId, version as Record<string, unknown>);
    }
  }

  return (routes ?? [])
    .map((route) => {
      const version = versionsByRoute.get(String(route.id));

      if (!version) {
        return null;
      }

      return {
        destinationLabel: String(route.destination_label),
        etaDaysMax: asNumber(route.eta_days_max),
        etaDaysMin: asNumber(route.eta_days_min),
        formulaKind: String(version.formula_kind) as "per_cbm" | "per_kg",
        formulaLabel: String(route.formula_label ?? version.formula_label),
        id: String(route.id),
        mode: String(route.mode) as ShippingMode,
        originLabel: String(route.origin_label),
        pricePerCbm: asNullableNumber(version.price_per_cbm),
        pricePerKg: asNullableNumber(version.price_per_kg),
        rateCurrency: (version.rate_currency === "USD" ? "USD" : "NGN") as "NGN" | "USD",
        termsSummary: String(route.terms_summary),
        title: String(route.title),
        usdToNgnRate: asNullableNumber(version.usd_to_ngn_rate),
        versionId: String(version.id),
        versionLabel: String(version.version_label),
      } satisfies ShippingRouteRecord;
    })
    .filter((route): route is ShippingRouteRecord => Boolean(route));
}

export async function listCheckoutCartItems() {
  const supabase = createSupabaseServiceRoleClient();
  const settings = await getCommerceSettings();
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, title, moq_override, sell_price_cny, weight_kg, volume_cbm, cover_image_url")
    .eq("status", "live")
    .order("featured", { ascending: false })
    .limit(1);

  if (error) {
    throw error;
  }

  return (data ?? []).map((product) => ({
    effectiveMoq: resolveEffectiveMoq({
      defaultMoq: settings.defaultMoq,
      moqOverride: asNullableNumber(product.moq_override),
    }),
    id: `cart-${product.id}`,
    imageUrl: product.cover_image_url ?? "/ProductImage.jpg",
    priceDisplay: formatMoney(asNumber(product.sell_price_cny ?? 0), "CNY"),
    priceDisplayNgn: formatMoney(
      convertCnyToNgn({
        cnyToNgnRate: settings.cnyToNgnRate,
        sourcePriceCny: asNumber(product.sell_price_cny ?? 0),
      }),
      "NGN",
    ),
    productId: product.id,
    quantity: resolveEffectiveMoq({
      defaultMoq: settings.defaultMoq,
      moqOverride: asNullableNumber(product.moq_override),
    }),
    sellPriceCny: asNumber(product.sell_price_cny ?? 0),
    sellPriceNgn: convertCnyToNgn({
      cnyToNgnRate: settings.cnyToNgnRate,
      sourcePriceCny: asNumber(product.sell_price_cny ?? 0),
    }),
    slug: product.slug,
    title: product.title,
    volumeCbm: asNullableNumber(product.volume_cbm),
    weightKg: asNullableNumber(product.weight_kg),
  }));
}

export async function listCheckoutShippingRoutes() {
  return getShippingRoutesWithVersions();
}

export async function listRouteConfigs() {
  return getShippingRoutesWithVersions();
}

export async function listConsignees(userId?: string | null) {
  if (!userId) {
    return [];
  }

  const supabase = createSupabaseServiceRoleClient();
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

  const data = await selectOrders({ userId });
  return data.map((order) => mapOrderRow(order));
}

export async function findOrderById(orderId: string, userId?: string | null) {
  if (!userId) {
    return null;
  }

  const data = await selectOrders({ orderId, userId });
  return data[0] ? mapOrderRow(data[0]) : null;
}

export async function findConsigneeById(consigneeId: string, userId?: string | null) {
  return (await listConsignees(userId)).find((consignee) => consignee.id === consigneeId) ?? null;
}

export async function listAdminOrders() {
  const data = await selectOrders();
  return data.map((order) => mapOrderRow(order));
}

export async function findAdminOrderById(orderId: string) {
  const data = await selectOrders({ orderId });
  return data[0] ? mapOrderRow(data[0]) : null;
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

export async function createRouteAcceptedOrderRecord(input: RouteAcceptedOrderInput) {
  const route = (await listCheckoutShippingRoutes()).find((candidate) => candidate.id === input.shippingRouteId);
  const settings = await getCommerceSettings();

  if (!route) {
    throw new Error("Choose a valid shipping route before product payment.");
  }

  const routeSnapshot = buildRouteAcceptanceSnapshot({
    destinationLabel: route.destinationLabel,
    etaDaysMax: route.etaDaysMax,
    etaDaysMin: route.etaDaysMin,
    formulaLabel: route.formulaLabel,
    mode: route.mode,
    originLabel: route.originLabel,
    routeId: route.id,
    routeVersionId: route.versionId,
    termsSummary: route.termsSummary,
  });

  const orderDraft = createRouteAcceptedOrder({
    cartItems: input.cartItems.map((item) => ({
      effectiveMoq: item.effectiveMoq,
      productId: item.productId,
      quantity: item.quantity,
      sellPriceCny: item.sellPriceCny,
      title: item.title,
    })),
    cnyToNgnRate: settings.cnyToNgnRate,
    consigneeId: input.consigneeId,
    routeSnapshot,
    serviceFeeNgn: DEFAULT_SERVICE_FEE_NGN,
    userId: input.userId,
  });

  const supabase = createSupabaseServiceRoleClient();
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      consignee_id: orderDraft.consigneeId,
      currency: "NGN",
      grand_total_ngn: orderDraft.productPaymentTotalNgn,
      logistics_total_ngn: 0,
      payment_reference: null,
      payment_status: "pending",
      product_payment_cny_to_ngn_rate: orderDraft.productPaymentCnyToNgnRate,
      product_payment_state: "pending",
      product_payment_total_ngn: orderDraft.productPaymentTotalNgn,
      product_subtotal_cny: orderDraft.productSubtotalCny,
      product_subtotal_ngn: orderDraft.productSubtotalNgn,
      route: route.mode,
      route_accepted: true,
      route_accepted_at: orderDraft.routeAcceptedAt,
      route_snapshot: routeSnapshot,
      service_fee_ngn: orderDraft.serviceFeeNgn,
      shipping_payment_state: "not_due",
      shipping_route_id: route.id,
      shipping_route_version_id: route.versionId,
      status: "route_selected",
      user_id: input.userId,
    })
    .select("id")
    .single();

  if (orderError) {
    throw orderError;
  }

  const orderId = String(orderData.id);
  const { error: itemsError } = await supabase.from("order_items").insert(
    orderDraft.items.map((item) => ({
      effective_moq_snapshot: item.effectiveMoqSnapshot,
      line_total_cny_snapshot: item.lineTotalCnySnapshot,
      line_total_ngn_snapshot: item.lineTotalNgnSnapshot,
      logistics_fee_ngn_snapshot: 0,
      moq_snapshot: item.moqSnapshot,
      order_id: orderId,
      product_id: item.productId,
      product_title_snapshot: item.productTitleSnapshot,
      product_unit_price_cny_snapshot: item.productUnitPriceCnySnapshot,
      product_unit_price_ngn_snapshot: item.productUnitPriceNgnSnapshot,
      quantity: item.quantity,
      volume_cbm_snapshot: input.cartItems.find((cartItem) => cartItem.productId === item.productId)?.volumeCbm ?? null,
      weight_kg_snapshot: input.cartItems.find((cartItem) => cartItem.productId === item.productId)?.weightKg ?? null,
    })),
  );

  if (itemsError) {
    throw itemsError;
  }

  const { data: paymentData, error: paymentError } = await supabase
    .from("product_payments")
    .insert({
      amount_ngn: orderDraft.productPaymentTotalNgn,
      order_id: orderId,
      provider: "paystack",
      status: "pending",
    })
    .select("id")
    .single();

  if (paymentError) {
    throw paymentError;
  }

  await supabase.from("order_status_events").insert({
    note: "Customer accepted shipping route terms and is ready for product payment.",
    order_id: orderId,
    status: "route_selected",
  });

  const publicEnv = getPublicEnv();

  return {
    callbackUrl: publicEnv.siteUrl ? new URL("/payment/pending?kind=product", publicEnv.siteUrl).toString() : "/payment/pending?kind=product",
    orderId,
    paymentId: String(paymentData.id),
    routeSnapshot,
    totals: {
      productPaymentTotalNgn: orderDraft.productPaymentTotalNgn,
      productSubtotalNgn: orderDraft.productSubtotalNgn,
      serviceFeeNgn: orderDraft.serviceFeeNgn,
    },
  };
}

export async function attachProductPaymentReference(
  orderId: string,
  paymentId: string,
  input: { authorizationUrl?: string | null; paymentReference: string },
) {
  const supabase = createSupabaseServiceRoleClient();
  await supabase
    .from("orders")
    .update({
      payment_reference: input.paymentReference,
      paystack_authorization_url: input.authorizationUrl ?? null,
    })
    .eq("id", orderId);

  const { error } = await supabase
    .from("product_payments")
    .update({
      payment_reference: input.paymentReference,
    })
    .eq("id", paymentId);

  if (error) {
    throw error;
  }
}

export async function attachShippingPaymentReference(
  orderId: string,
  paymentId: string,
  input: { paymentReference: string },
) {
  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase
    .from("shipping_payments")
    .update({
      payment_reference: input.paymentReference,
    })
    .eq("id", paymentId)
    .eq("order_id", orderId);

  if (error) {
    throw error;
  }
}

export async function findOrderByProductPaymentReference(reference: string): Promise<ProductPaymentLookup | null> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("product_payments")
    .select("id, order_id")
    .eq("payment_reference", reference)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? { orderId: String(data.order_id), paymentId: String(data.id) } : null;
}

export async function findOrderByShippingPaymentReference(reference: string): Promise<ShippingPaymentLookup | null> {
  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("shipping_payments")
    .select("id, order_id")
    .eq("payment_reference", reference)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? { orderId: String(data.order_id), paymentId: String(data.id) } : null;
}

export async function findOrderByPaymentReference(reference: string) {
  return findOrderByProductPaymentReference(reference);
}

export async function updateProductPaymentState(input: {
  note: string;
  orderId: string;
  paymentId: string;
  paymentState: ProductPaymentStatus;
  status: OrderStatus;
}) {
  const supabase = createSupabaseServiceRoleClient();
  const paidAt = input.paymentState === "paid" ? new Date().toISOString() : null;

  const { error: paymentError } = await supabase
    .from("product_payments")
    .update({
      paid_at: paidAt,
      status: input.paymentState,
    })
    .eq("id", input.paymentId);

  if (paymentError) {
    throw paymentError;
  }

  const { error: orderError } = await supabase
    .from("orders")
    .update({
      payment_status: input.paymentState,
      payment_verified_at: paidAt,
      product_payment_state: input.paymentState,
      status: input.status,
    })
    .eq("id", input.orderId);

  if (orderError) {
    throw orderError;
  }

  if (input.paymentState === "paid") {
    await supabase.from("order_status_events").insert([
      {
        note: "Product payment completed successfully.",
        order_id: input.orderId,
        status: "paid_for_products",
      },
      {
        note: "Order entered the warehouse queue.",
        order_id: input.orderId,
        status: input.status,
      },
    ]);
    return;
  }

  await supabase.from("order_status_events").insert({
    note: input.note,
    order_id: input.orderId,
    status: input.status,
  });
}

export async function updateOrderPaymentState(input: {
  note: string;
  orderId: string;
  paymentStatus: ProductPaymentStatus;
  status: OrderStatus;
}) {
  const payment = await findOrderByProductPaymentReference(`order-${input.orderId}`);

  await updateProductPaymentState({
    note: input.note,
    orderId: input.orderId,
    paymentId: payment?.paymentId ?? input.orderId,
    paymentState: input.paymentStatus,
    status: input.status,
  });
}

export async function updateShippingPaymentState(input: {
  note: string;
  orderId: string;
  paymentId: string;
  paymentState: Exclude<ShippingPaymentStatus, "not_due">;
  status: OrderStatus;
}) {
  const supabase = createSupabaseServiceRoleClient();
  const paidAt = input.paymentState === "paid" ? new Date().toISOString() : null;

  const { error: paymentError } = await supabase
    .from("shipping_payments")
    .update({
      paid_at: paidAt,
      status: input.paymentState === "pending" ? "pending" : input.paymentState,
    })
    .eq("id", input.paymentId);

  if (paymentError) {
    throw paymentError;
  }

  const { error: orderError } = await supabase
    .from("orders")
    .update({
      shipping_payment_state: input.paymentState,
      status: input.status,
    })
    .eq("id", input.orderId);

  if (orderError) {
    throw orderError;
  }

  if (input.paymentState === "paid") {
    await supabase.from("order_status_events").insert([
      {
        note: "Shipping payment completed successfully.",
        order_id: input.orderId,
        status: "shipping_paid",
      },
      {
        note: input.note,
        order_id: input.orderId,
        status: input.status,
      },
    ]);
    return;
  }

  await supabase.from("order_status_events").insert({
    note: input.note,
    order_id: input.orderId,
    status: input.status,
  });
}

export async function findPendingShippingPaymentByOrderId(orderId: string, userId?: string | null) {
  const order = userId ? await findOrderById(orderId, userId) : await findAdminOrderById(orderId);

  if (
    !order ||
    order.shippingPaymentState === "not_due" ||
    order.shippingPaymentState === "paid" ||
    order.shippingCostNgn === null
  ) {
    return null;
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("shipping_payments")
    .select("id, amount_ngn")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data
    ? {
        amountNgn: asNumber(data.amount_ngn),
        paymentId: String(data.id),
      }
    : null;
}

export async function markOrderArrivedAtWarehouse(orderId: string) {
  const supabase = createSupabaseServiceRoleClient();
  const { error } = await supabase.from("orders").update({ status: "arrived_at_warehouse" }).eq("id", orderId);

  if (error) {
    throw error;
  }

  await supabase.from("order_status_events").insert({
    note: "Warehouse confirmed order arrival.",
    order_id: orderId,
    status: "arrived_at_warehouse",
  });
}

export async function recordWarehouseMeasurement(input: {
  measuredByProfileId: string;
  measuredValue: number;
  orderId: string;
  proofMimeType: string;
  proofPath: string;
}) {
  const supabase = createSupabaseServiceRoleClient();
  const settings = await getCommerceSettings();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, route, shipping_route_version_id, product_payment_total_ngn")
    .eq("id", input.orderId)
    .single();

  if (orderError) {
    throw orderError;
  }

  const { data: version, error: versionError } = await supabase
    .from("shipping_route_versions")
    .select("formula_kind, price_per_kg, price_per_cbm")
    .eq("id", order.shipping_route_version_id)
    .single();

  if (versionError) {
    throw versionError;
  }

  const invoice =
    order.route === "sea"
      ? calculateShippingInvoice({
          measuredVolumeCbm: input.measuredValue,
          mode: "sea",
          pricePerCbmUsd: asNumber(version.price_per_cbm ?? 0),
          usdToNgnRate: settings.usdToNgnRate,
        })
      : calculateShippingInvoice({
          measuredWeightKg: input.measuredValue,
          mode: "air",
          pricePerKgUsd: asNumber(version.price_per_kg ?? 0),
          usdToNgnRate: settings.usdToNgnRate,
        });

  const measurementBasis: MeasurementBasis = order.route === "sea" ? "volume_cbm" : "weight_kg";
  const quoteSnapshot: ShipmentQuoteSnapshot = {
    formulaKind: String(version.formula_kind) as "per_cbm" | "per_kg",
    measurementBasis,
    mode: String(order.route) as ShippingMode,
    pricePerCbm: asNullableNumber(version.price_per_cbm),
    pricePerKg: asNullableNumber(version.price_per_kg),
    rateCurrency: invoice.rateCurrency,
    shippingCostUsd: invoice.shippingCostUsd,
    usdToNgnRate: invoice.usdToNgnRate,
  };

  const { data: shipment, error: shipmentError } = await supabase
    .from("order_shipments")
    .upsert(
      {
        customer_notified_at: new Date().toISOString(),
        measured_at: new Date().toISOString(),
        measured_by_profile_id: input.measuredByProfileId,
        measured_volume_cbm: measurementBasis === "volume_cbm" ? input.measuredValue : null,
        measured_weight_kg: measurementBasis === "weight_kg" ? input.measuredValue : null,
        measurement_basis: measurementBasis,
        order_id: input.orderId,
        shipping_cost_ngn: invoice.shippingCostNgn,
        shipping_cost_usd: invoice.shippingCostUsd,
        shipping_quote_snapshot: quoteSnapshot,
        weighing_proof_mime_type: input.proofMimeType,
        weighing_proof_path: input.proofPath,
      },
      { onConflict: "order_id" },
    )
    .select("id")
    .single();

  if (shipmentError) {
    throw shipmentError;
  }

  const { data: existingShippingPayment, error: existingShippingPaymentError } = await supabase
    .from("shipping_payments")
    .select("id")
    .eq("order_id", input.orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingShippingPaymentError) {
    throw existingShippingPaymentError;
  }

  let shippingPaymentId: string;

  if (existingShippingPayment) {
    const { error: shippingPaymentError } = await supabase
      .from("shipping_payments")
      .update({
        amount_ngn: invoice.shippingCostNgn,
        paid_at: null,
        payment_reference: null,
        payload: {
          shippingCostUsd: invoice.shippingCostUsd,
          shippingCostNgn: invoice.shippingCostNgn,
          usdToNgnRate: invoice.usdToNgnRate,
        },
        provider: "paystack",
        shipment_id: shipment.id,
        status: "pending",
      })
      .eq("id", existingShippingPayment.id);

    if (shippingPaymentError) {
      throw shippingPaymentError;
    }

    shippingPaymentId = String(existingShippingPayment.id);
  } else {
    const { data: shippingPayment, error: shippingPaymentError } = await supabase
      .from("shipping_payments")
      .insert({
        amount_ngn: invoice.shippingCostNgn,
        order_id: input.orderId,
        payload: {
          shippingCostUsd: invoice.shippingCostUsd,
          shippingCostNgn: invoice.shippingCostNgn,
          usdToNgnRate: invoice.usdToNgnRate,
        },
        provider: "paystack",
        shipment_id: shipment.id,
        status: "pending",
      })
      .select("id")
      .single();

    if (shippingPaymentError) {
      throw shippingPaymentError;
    }

    shippingPaymentId = String(shippingPayment.id);
  }

  const grandTotal = asNumber(order.product_payment_total_ngn ?? 0) + invoice.shippingCostNgn;
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      grand_total_ngn: grandTotal,
      logistics_total_ngn: invoice.shippingCostNgn,
      shipping_cost_ngn: invoice.shippingCostNgn,
      shipping_payment_state: "pending",
      status: "awaiting_shipping_payment",
    })
    .eq("id", input.orderId);

  if (updateError) {
    throw updateError;
  }

  await supabase.from("order_status_events").insert([
    {
      note: "Warehouse completed measurement and uploaded proof.",
      order_id: input.orderId,
      status: "weighed",
    },
    {
      note: "Customer notification sent for shipping payment.",
      order_id: input.orderId,
      status: "awaiting_shipping_payment",
    },
  ]);

  return {
    paymentId: shippingPaymentId,
    shippingCostNgn: invoice.shippingCostNgn,
    shippingCostUsd: invoice.shippingCostUsd,
    shipmentId: String(shipment.id),
  };
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
