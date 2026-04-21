export type ProductLifecycle = "draft" | "live" | "removed" | "unavailable";
export type CurrencyCode = "NGN" | "USD" | "CNY";
export type ElimPlatform = "alibaba" | "taobao";
export type ShippingMode = "air" | "sea";
export type CheckoutRoute = ShippingMode;
export type MeasurementBasis = "weight_kg" | "volume_cbm";
export type OrderStatus =
  | "cart"
  | "route_selected"
  | "paid_for_products"
  | "awaiting_warehouse"
  | "arrived_at_warehouse"
  | "weighed"
  | "awaiting_shipping_payment"
  | "shipping_paid"
  | "in_transit"
  | "arrived_destination"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";
export type ProductPaymentStatus = "pending" | "paid" | "failed";
export type ShippingPaymentStatus = "not_due" | "pending" | "paid" | "failed";

export type Product = {
  basePriceCny: number;
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  categoryId: string | null;
  sourceType: "manual" | "api";
  status: ProductLifecycle;
  moqOverride: number | null;
  weightKg: number;
  sellPriceCny: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductSource = {
  id: string;
  productId: string;
  provider: "elim";
  sourcePlatform: ElimPlatform;
  sourceProductId: string;
  sourceUrl: string | null;
  sourceCurrency: CurrencyCode;
  sourcePriceCny: number | null;
  sourcePayload: Record<string, unknown>;
  availabilityStatus: "unknown" | "available" | "unavailable";
  lastSyncedAt: string | null;
};

export type ImportJob = {
  id: string;
  mode: "single_url" | "keyword_search" | "bulk_url" | "csv";
  status: "queued" | "processing" | "completed" | "completed_with_errors" | "failed";
  submittedCount: number;
  importedCount: number;
  failedCount: number;
  duplicateCount: number;
  createdAt: string;
};

export type ImportJobItem = {
  id: string;
  jobId: string;
  sourceInput: string;
  sourcePlatform: ElimPlatform | null;
  sourceProductId: string | null;
  status: "queued" | "imported" | "duplicate" | "failed" | "needs_review";
  failureReason: string | null;
};

export type Consignee = {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  cityOrState: string;
  notes: string | null;
  isDefault: boolean;
};

export type CurrencyPair = {
  id: string;
  baseCurrency: CurrencyCode;
  quoteCurrency: CurrencyCode;
  rate: number;
  updatedAt: string;
};

export type AppSettings = {
  defaultMoq: number;
};

export type ShippingRoute = {
  id: string;
  active: boolean;
  destinationLabel: string;
  etaDaysMax: number;
  etaDaysMin: number;
  formulaLabel: string;
  mode: ShippingMode;
  originLabel: string;
  termsSummary: string;
  title: string;
  updatedAt: string;
};

export type ShippingRouteVersion = {
  active: boolean;
  formulaKind: "per_cbm" | "per_kg";
  formulaLabel: string;
  id: string;
  pricePerCbm: number | null;
  pricePerKg: number | null;
  rateCurrency: CurrencyCode;
  routeId: string;
  usdToNgnRate: number | null;
  versionLabel: string;
};

export type RouteAcceptanceSnapshot = {
  destinationLabel: string;
  etaDaysMax: number;
  etaDaysMin: number;
  formulaLabel: string;
  mode: ShippingMode;
  originLabel: string;
  routeId: string;
  routeVersionId: string;
  termsSummary: string;
};

export type ShipmentQuoteSnapshot = {
  formulaKind: "per_cbm" | "per_kg";
  measurementBasis: MeasurementBasis;
  mode: ShippingMode;
  pricePerCbm: number | null;
  pricePerKg: number | null;
  rateCurrency: CurrencyCode;
  shippingCostUsd: number | null;
  usdToNgnRate: number | null;
};

export type ShippingConfig = {
  id: string;
  route: CheckoutRoute;
  pricePerKgUsd: number;
  minimumFeeNgn: number;
  active: boolean;
  updatedAt: string;
};

export type Order = {
  id: string;
  userId: string;
  consigneeId: string;
  route: CheckoutRoute | null;
  shippingRouteId: string | null;
  shippingRouteVersionId: string | null;
  routeAccepted: boolean;
  routeAcceptedAt: string | null;
  routeSnapshot: RouteAcceptanceSnapshot | null;
  status: OrderStatus;
  currency: "NGN";
  productSubtotalCny: number;
  productSubtotalNgn: number;
  productPaymentCnyToNgnRate: number;
  serviceFeeNgn: number;
  productPaymentTotalNgn: number;
  logisticsTotalNgn: number;
  shippingCostNgn: number | null;
  grandTotalNgn: number;
  paymentReference: string | null;
  productPaymentState: ProductPaymentStatus;
  shippingPaymentState: ShippingPaymentStatus;
  statusEvents: OrderStatusEvent[];
  createdAt: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string | null;
  productTitleSnapshot: string;
  quantity: number;
  effectiveMoqSnapshot: number;
  weightKgSnapshot: number | null;
  productUnitPriceCnySnapshot: number;
  productUnitPriceNgnSnapshot: number;
  lineTotalCnySnapshot: number;
  logisticsFeeNgnSnapshot: number;
  lineTotalNgnSnapshot: number;
};

export type OrderShipment = {
  customerNotifiedAt: string | null;
  id: string;
  measuredAt: string | null;
  measuredByProfileId: string | null;
  measuredVolumeCbm: number | null;
  measuredWeightKg: number | null;
  measurementBasis: MeasurementBasis | null;
  orderId: string;
  shippingCostUsd: number | null;
  shippingCostNgn: number | null;
  shippingQuoteSnapshot: ShipmentQuoteSnapshot | null;
  weighingProofMimeType: string | null;
  weighingProofPath: string | null;
};

export type OrderPayment = {
  amountNgn: number;
  id: string;
  orderId: string;
  paidAt: string | null;
  paymentReference: string | null;
  paymentType: "product" | "shipping";
  provider: "paystack";
  status: ProductPaymentStatus | ShippingPaymentStatus;
};

export type OrderStatusEvent = {
  id: string;
  orderId: string;
  status: OrderStatus;
  note: string | null;
  createdAt: string;
};
