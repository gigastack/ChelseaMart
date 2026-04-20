export type ProductLifecycle = "draft" | "live" | "removed" | "unavailable";
export type CheckoutRoute = "air" | "sea";
export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
export type CurrencyCode = "NGN" | "USD" | "CNY";
export type ElimPlatform = "alibaba" | "taobao";

export type Product = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  categoryId: string | null;
  sourceType: "manual" | "api";
  status: ProductLifecycle;
  moq: number;
  weightKg: number;
  basePriceNgn: number;
  sellPriceNgn: number;
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
  sourcePrice: number | null;
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
  route: CheckoutRoute;
  status: OrderStatus;
  currency: "NGN";
  productSubtotalNgn: number;
  logisticsTotalNgn: number;
  grandTotalNgn: number;
  paymentReference: string | null;
  createdAt: string;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string | null;
  productTitleSnapshot: string;
  quantity: number;
  moqSnapshot: number;
  weightKgSnapshot: number;
  productUnitPriceNgnSnapshot: number;
  logisticsFeeNgnSnapshot: number;
  lineTotalNgnSnapshot: number;
};

export type OrderStatusEvent = {
  id: string;
  orderId: string;
  status: OrderStatus;
  note: string | null;
  createdAt: string;
};
