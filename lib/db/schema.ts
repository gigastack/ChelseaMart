import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const productStatusEnum = pgEnum("product_status", ["draft", "live", "removed", "unavailable"]);
export const productSourceTypeEnum = pgEnum("product_source_type", ["manual", "api"]);
export const checkoutRouteEnum = pgEnum("checkout_route", ["air", "sea"]);
export const orderStatusEnum = pgEnum("order_status", [
  "cart",
  "route_selected",
  "paid_for_products",
  "awaiting_warehouse",
  "arrived_at_warehouse",
  "weighed",
  "awaiting_shipping_payment",
  "shipping_paid",
  "in_transit",
  "arrived_destination",
  "out_for_delivery",
  "delivered",
  "cancelled",
]);
export const importJobStatusEnum = pgEnum("import_job_status", ["queued", "processing", "completed", "completed_with_errors", "failed"]);
export const importJobItemStatusEnum = pgEnum("import_job_item_status", ["queued", "imported", "duplicate", "failed", "needs_review"]);
export const catalogAlertTypeEnum = pgEnum("catalog_alert_type", ["source_unavailable", "sync_failed", "missing_required_data"]);
export const profileRoleEnum = pgEnum("profile_role", ["customer", "admin"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "failed"]);
export const elimPlatformEnum = pgEnum("elim_platform", ["alibaba", "taobao"]);
export const routeVersionFormulaKindEnum = pgEnum("route_version_formula_kind", ["per_kg", "per_cbm"]);
export const shipmentMeasurementBasisEnum = pgEnum("shipment_measurement_basis", ["weight_kg", "volume_cbm"]);
export const shippingPaymentStateEnum = pgEnum("shipping_payment_state", ["not_due", "pending", "paid", "failed"]);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    parentId: uuid("parent_id"),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    featured: boolean("featured").default(false).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    ...timestamps,
  },
  (table) => [index("categories_parent_id_idx").on(table.parentId)],
);

export const currencyPairs = pgTable(
  "currency_pairs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    baseCurrency: text("base_currency").notNull(),
    quoteCurrency: text("quote_currency").notNull(),
    rate: numeric("rate", { precision: 18, scale: 6 }).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps,
  },
  (table) => [unique("currency_pairs_base_quote_unique").on(table.baseCurrency, table.quoteCurrency)],
);

export const shippingConfigs = pgTable("shipping_configs", {
  id: uuid("id").defaultRandom().primaryKey(),
  route: checkoutRouteEnum("route").notNull().unique(),
  pricePerKgUsd: numeric("price_per_kg_usd", { precision: 18, scale: 2 }).notNull(),
  minimumFeeNgn: numeric("minimum_fee_ngn", { precision: 18, scale: 2 }).default("0").notNull(),
  active: boolean("active").default(true).notNull(),
  ...timestamps,
});

export const shippingRoutes = pgTable("shipping_routes", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  originLabel: text("origin_label").notNull(),
  destinationLabel: text("destination_label").notNull(),
  mode: checkoutRouteEnum("mode").notNull(),
  formulaLabel: text("formula_label").notNull(),
  etaDaysMin: integer("eta_days_min").notNull(),
  etaDaysMax: integer("eta_days_max").notNull(),
  termsSummary: text("terms_summary").notNull(),
  active: boolean("active").default(true).notNull(),
  ...timestamps,
});

export const shippingRouteVersions = pgTable("shipping_route_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  routeId: uuid("route_id")
    .notNull()
    .references(() => shippingRoutes.id, { onDelete: "cascade" }),
  versionLabel: text("version_label").notNull(),
  formulaKind: routeVersionFormulaKindEnum("formula_kind").notNull(),
  formulaLabel: text("formula_label").notNull(),
  rateCurrency: text("rate_currency").default("NGN").notNull(),
  pricePerKg: numeric("price_per_kg", { precision: 18, scale: 2 }),
  pricePerCbm: numeric("price_per_cbm", { precision: 18, scale: 2 }),
  usdToNgnRate: numeric("usd_to_ngn_rate", { precision: 18, scale: 6 }),
  active: boolean("active").default(true).notNull(),
  ...timestamps,
});

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    shortDescription: text("short_description"),
    description: text("description"),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    coverImageUrl: text("cover_image_url"),
    sourceType: productSourceTypeEnum("source_type").default("manual").notNull(),
    status: productStatusEnum("status").default("draft").notNull(),
    moq: integer("moq").default(1).notNull(),
    weightKg: numeric("weight_kg", { precision: 10, scale: 3 }).notNull(),
    volumeCbm: numeric("volume_cbm", { precision: 10, scale: 3 }),
    basePriceNgn: numeric("base_price_ngn", { precision: 18, scale: 2 }).notNull(),
    sellPriceNgn: numeric("sell_price_ngn", { precision: 18, scale: 2 }).notNull(),
    featured: boolean("featured").default(false).notNull(),
    ...timestamps,
  },
  (table) => [index("products_status_idx").on(table.status), index("products_category_idx").on(table.categoryId)],
);

export const productSources = pgTable(
  "product_sources",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    provider: text("provider").default("elim").notNull(),
    sourceProductId: text("source_product_id").notNull(),
    sourceUrl: text("source_url"),
    sourcePlatform: elimPlatformEnum("source_platform").default("alibaba").notNull(),
    sourceCurrency: text("source_currency").default("CNY").notNull(),
    sourcePrice: numeric("source_price", { precision: 18, scale: 2 }),
    sourcePayload: jsonb("source_payload").default({}).notNull(),
    availabilityStatus: text("availability_status").default("unknown").notNull(),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    unique("product_sources_provider_product_unique").on(table.provider, table.sourceProductId),
    index("product_sources_product_id_idx").on(table.productId),
  ],
);

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sku: text("sku"),
  optionSummary: text("option_summary").notNull(),
  stockQuantity: integer("stock_quantity"),
  moq: integer("moq"),
  priceOverrideNgn: numeric("price_override_ngn", { precision: 18, scale: 2 }),
  ...timestamps,
});

export const profiles = pgTable("profiles", {
  userId: uuid("user_id").primaryKey(),
  email: text("email"),
  fullName: text("full_name"),
  role: profileRoleEnum("role").default("customer").notNull(),
  ...timestamps,
});

export const consignees = pgTable(
  "consignees",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(),
    cityOrState: text("city_or_state").notNull(),
    notes: text("notes"),
    isDefault: boolean("is_default").default(false).notNull(),
    ...timestamps,
  },
  (table) => [index("consignees_user_id_idx").on(table.userId)],
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull(),
    consigneeId: uuid("consignee_id")
      .notNull()
      .references(() => consignees.id, { onDelete: "restrict" }),
    route: checkoutRouteEnum("route"),
    shippingRouteId: uuid("shipping_route_id").references(() => shippingRoutes.id, { onDelete: "set null" }),
    shippingRouteVersionId: uuid("shipping_route_version_id").references(() => shippingRouteVersions.id, {
      onDelete: "set null",
    }),
    routeAccepted: boolean("route_accepted").default(false).notNull(),
    routeAcceptedAt: timestamp("route_accepted_at", { withTimezone: true }),
    routeSnapshot: jsonb("route_snapshot"),
    status: orderStatusEnum("status").default("cart").notNull(),
    currency: text("currency").default("NGN").notNull(),
    productSubtotalNgn: numeric("product_subtotal_ngn", { precision: 18, scale: 2 }).notNull(),
    serviceFeeNgn: numeric("service_fee_ngn", { precision: 18, scale: 2 }).default("0").notNull(),
    productPaymentTotalNgn: numeric("product_payment_total_ngn", { precision: 18, scale: 2 }).default("0").notNull(),
    logisticsTotalNgn: numeric("logistics_total_ngn", { precision: 18, scale: 2 }).notNull(),
    grandTotalNgn: numeric("grand_total_ngn", { precision: 18, scale: 2 }).notNull(),
    paymentReference: text("payment_reference"),
    paymentStatus: paymentStatusEnum("payment_status").default("pending").notNull(),
    productPaymentState: paymentStatusEnum("product_payment_state").default("pending").notNull(),
    shippingPaymentState: shippingPaymentStateEnum("shipping_payment_state").default("not_due").notNull(),
    shippingCostNgn: numeric("shipping_cost_ngn", { precision: 18, scale: 2 }),
    paystackAuthorizationUrl: text("paystack_authorization_url"),
    paymentVerifiedAt: timestamp("payment_verified_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [index("orders_user_id_idx").on(table.userId), index("orders_status_idx").on(table.status)],
);

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  productTitleSnapshot: text("product_title_snapshot").notNull(),
  quantity: integer("quantity").notNull(),
  moqSnapshot: integer("moq_snapshot").notNull(),
  weightKgSnapshot: numeric("weight_kg_snapshot", { precision: 10, scale: 3 }),
  volumeCbmSnapshot: numeric("volume_cbm_snapshot", { precision: 10, scale: 3 }),
  productUnitPriceNgnSnapshot: numeric("product_unit_price_ngn_snapshot", { precision: 18, scale: 2 }).notNull(),
  logisticsFeeNgnSnapshot: numeric("logistics_fee_ngn_snapshot", { precision: 18, scale: 2 }).notNull(),
  lineTotalNgnSnapshot: numeric("line_total_ngn_snapshot", { precision: 18, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orderShipments = pgTable("order_shipments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" })
    .unique(),
  measurementBasis: shipmentMeasurementBasisEnum("measurement_basis"),
  measuredWeightKg: numeric("measured_weight_kg", { precision: 10, scale: 3 }),
  measuredVolumeCbm: numeric("measured_volume_cbm", { precision: 10, scale: 3 }),
  measuredAt: timestamp("measured_at", { withTimezone: true }),
  measuredByProfileId: uuid("measured_by_profile_id"),
  weighingProofPath: text("weighing_proof_path"),
  weighingProofMimeType: text("weighing_proof_mime_type"),
  shippingQuoteSnapshot: jsonb("shipping_quote_snapshot"),
  shippingCostNgn: numeric("shipping_cost_ngn", { precision: 18, scale: 2 }),
  customerNotifiedAt: timestamp("customer_notified_at", { withTimezone: true }),
  ...timestamps,
});

export const orderStatusEvents = pgTable("order_status_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  status: orderStatusEnum("status").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const importJobs = pgTable("import_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  mode: text("mode").notNull(),
  status: importJobStatusEnum("status").default("queued").notNull(),
  submittedCount: integer("submitted_count").default(0).notNull(),
  importedCount: integer("imported_count").default(0).notNull(),
  failedCount: integer("failed_count").default(0).notNull(),
  duplicateCount: integer("duplicate_count").default(0).notNull(),
  createdBy: uuid("created_by"),
  ...timestamps,
});

export const importJobItems = pgTable("import_job_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  importJobId: uuid("import_job_id")
    .notNull()
    .references(() => importJobs.id, { onDelete: "cascade" }),
  sourceInput: text("source_input").notNull(),
  sourceProductId: text("source_product_id"),
  sourcePlatform: elimPlatformEnum("source_platform"),
  status: importJobItemStatusEnum("status").default("queued").notNull(),
  failureReason: text("failure_reason"),
  ...timestamps,
});

export const catalogAlerts = pgTable("catalog_alerts", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
  alertType: catalogAlertTypeEnum("alert_type").notNull(),
  title: text("title").notNull(),
  detail: text("detail"),
  resolved: boolean("resolved").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});

export const productPayments = pgTable("product_payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  amountNgn: numeric("amount_ngn", { precision: 18, scale: 2 }).notNull(),
  provider: text("provider").default("paystack").notNull(),
  paymentReference: text("payment_reference").unique(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  payload: jsonb("payload").default({}).notNull(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  ...timestamps,
});

export const shippingPayments = pgTable("shipping_payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  shipmentId: uuid("shipment_id")
    .notNull()
    .references(() => orderShipments.id, { onDelete: "cascade" }),
  amountNgn: numeric("amount_ngn", { precision: 18, scale: 2 }).notNull(),
  provider: text("provider").default("paystack").notNull(),
  paymentReference: text("payment_reference").unique(),
  status: paymentStatusEnum("status").default("pending").notNull(),
  payload: jsonb("payload").default({}).notNull(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  ...timestamps,
});

export const paystackEvents = pgTable("paystack_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  dedupeKey: text("dedupe_key").notNull().unique(),
  eventType: text("event_type").notNull(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "set null" }),
  paymentReference: text("payment_reference"),
  payload: jsonb("payload").default({}).notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }).defaultNow().notNull(),
});

export const schema = {
  catalogAlerts,
  categories,
  consignees,
  currencyPairs,
  importJobItems,
  importJobs,
  orderItems,
  orderShipments,
  orderStatusEvents,
  orders,
  paystackEvents,
  productPayments,
  productSources,
  productStatusEnum,
  productSourceTypeEnum,
  productVariants,
  products,
  profileRoleEnum,
  profiles,
  shippingConfigs,
  shippingPayments,
  shippingRoutes,
  shippingRouteVersions,
};
