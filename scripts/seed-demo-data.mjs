import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const ids = {
  adminImportItem1: "dddddddd-0000-0000-0000-000000000001",
  adminImportItem2: "dddddddd-0000-0000-0000-000000000002",
  adminImportJob: "cccccccc-0000-0000-0000-000000000001",
  apiProduct: "22222222-2222-2222-2222-222222222222",
  apiSource: "33333333-3333-3333-3333-333333333333",
  categoryFashion: "aaaaaaaa-0000-0000-0000-000000000001",
  categoryLighting: "aaaaaaaa-0000-0000-0000-000000000002",
  consigneeDefault: "66666666-6666-6666-6666-666666666661",
  consigneeSecond: "66666666-6666-6666-6666-666666666662",
  customerOrderAwaitingShippingPayment: "77777777-7777-7777-7777-777777777771",
  customerOrderShippingPaid: "77777777-7777-7777-7777-777777777772",
  manualProduct: "11111111-1111-1111-1111-111111111111",
  orderItemAwaitingShippingPayment: "99999999-9999-9999-9999-999999999991",
  orderItemShippingPaid: "99999999-9999-9999-9999-999999999992",
  productPaymentAwaitingShippingPayment: "12121212-1212-1212-1212-121212121211",
  productPaymentShippingPaid: "12121212-1212-1212-1212-121212121212",
  shipmentAwaitingShippingPayment: "14141414-1414-1414-1414-141414141411",
  shipmentShippingPaid: "14141414-1414-1414-1414-141414141412",
  shippingPaymentAwaitingShippingPayment: "13131313-1313-1313-1313-131313131311",
  shippingPaymentShippingPaid: "13131313-1313-1313-1313-131313131312",
  shippingRouteAir: "55555555-5555-5555-5555-555555555561",
  shippingRouteSea: "55555555-5555-5555-5555-555555555562",
  shippingRouteVersionAir: "56565656-5656-5656-5656-565656565611",
  shippingRouteVersionSea: "56565656-5656-5656-5656-565656565612",
  unavailableAlert: "bbbbbbbb-0000-0000-0000-000000000001",
};

const defaults = {
  adminEmail: "demo.admin@mart.local",
  adminPassword: "DemoAdmin123!",
  customerEmail: "demo.customer@mart.local",
  customerPassword: "DemoCustomer123!",
};

function loadEnvFile(filename) {
  const filePath = path.join(projectRoot, filename);

  if (!existsSync(filePath)) {
    return {};
  }

  return readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .reduce((env, line) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        return env;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) {
        return env;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const rawValue = trimmed.slice(separatorIndex + 1).trim();
      const value = rawValue.replace(/^['"]|['"]$/g, "");
      env[key] = value;
      return env;
    }, {});
}

function getEnv(key, fallback) {
  const envFiles = {
    ...loadEnvFile(".env"),
    ...loadEnvFile(".env.local"),
  };

  return process.env[key] ?? envFiles[key] ?? fallback;
}

function isSafeSeedingTarget(siteUrl) {
  if (!siteUrl) {
    return true;
  }

  return siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1") || siteUrl.includes("trycloudflare.com");
}

async function findUserByEmail(supabase, email) {
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });

  if (error) {
    throw error;
  }

  return data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase()) ?? null;
}

async function ensureUser(supabase, { email, fullName, password, role }) {
  const existing = await findUserByEmail(supabase, email);

  if (existing) {
    const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
      app_metadata: {
        ...(existing.app_metadata ?? {}),
        role,
      },
      email,
      email_confirm: true,
      password,
      user_metadata: {
        ...(existing.user_metadata ?? {}),
        full_name: fullName,
      },
    });

    if (error) {
      throw error;
    }

    return data.user;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    app_metadata: {
      role,
    },
    email,
    email_confirm: true,
    password,
    user_metadata: {
      full_name: fullName,
    },
  });

  if (error) {
    throw error;
  }

  return data.user;
}

async function maybeUpsertProfiles(supabase, profiles) {
  try {
    await supabase.from("profiles").upsert(profiles, { onConflict: "user_id" });
  } catch {
    // Profiles migration may not be applied yet in the current hosted dev project.
  }
}

async function tableExists(supabase, tableName) {
  const { error } = await supabase.from(tableName).select("*").limit(1);

  if (!error) {
    return true;
  }

  if (error.code === "PGRST205") {
    return false;
  }

  throw error;
}

async function waitForCommerceSchema(supabase, attempts = 8, delayMs = 1500) {
  const requiredTables = [
    "categories",
    "products",
    "consignees",
    "orders",
    "shipping_routes",
    "shipping_route_versions",
    "order_shipments",
    "product_payments",
    "shipping_payments",
  ];

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const checks = await Promise.all(requiredTables.map((tableName) => tableExists(supabase, tableName)));

    if (checks.every(Boolean)) {
      return true;
    }

    if (attempt < attempts) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return false;
}

function buildRouteSnapshot(input) {
  return {
    destinationLabel: input.destinationLabel,
    etaDaysMax: input.etaDaysMax,
    etaDaysMin: input.etaDaysMin,
    formulaLabel: input.formulaLabel,
    mode: input.mode,
    originLabel: input.originLabel,
    routeId: input.routeId,
    routeVersionId: input.routeVersionId,
    termsSummary: input.termsSummary,
  };
}

function buildQuoteSnapshot(input) {
  return {
    formulaKind: input.formulaKind,
    measurementBasis: input.measurementBasis,
    mode: input.mode,
    pricePerCbm: input.pricePerCbm ?? null,
    pricePerKg: input.pricePerKg ?? null,
    rateCurrency: input.rateCurrency,
    shippingCostUsd: input.shippingCostUsd ?? null,
    usdToNgnRate: input.usdToNgnRate ?? null,
  };
}

async function seedDemoData() {
  const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  const siteUrl = getEnv("NEXT_PUBLIC_SITE_URL");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required to seed demo data.");
  }

  if (!isSafeSeedingTarget(siteUrl)) {
    throw new Error("Refusing to seed demo users outside a local/dev site URL. Override the script if you need a different target.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const adminUser = await ensureUser(supabase, {
    email: getEnv("DEMO_ADMIN_EMAIL", defaults.adminEmail),
    fullName: "Demo Admin",
    password: getEnv("DEMO_ADMIN_PASSWORD", defaults.adminPassword),
    role: "admin",
  });
  const customerUser = await ensureUser(supabase, {
    email: getEnv("DEMO_CUSTOMER_EMAIL", defaults.customerEmail),
    fullName: "Demo Customer",
    password: getEnv("DEMO_CUSTOMER_PASSWORD", defaults.customerPassword),
    role: "customer",
  });

  await maybeUpsertProfiles(supabase, [
    {
      email: adminUser.email?.toLowerCase() ?? null,
      full_name: "Demo Admin",
      role: "admin",
      user_id: adminUser.id,
    },
    {
      email: customerUser.email?.toLowerCase() ?? null,
      full_name: "Demo Customer",
      role: "customer",
      user_id: customerUser.id,
    },
  ]);

  const commerceSchemaAvailable = await waitForCommerceSchema(supabase);

  if (!commerceSchemaAvailable) {
    console.warn(
      "The two-phase commerce schema is not available in the configured Supabase project. Seeded auth users only; route, payment, shipment, and order data remain unavailable until migrations are applied. Set DATABASE_URL and run `npm run db:migrate` first.",
    );
    console.log(`Admin: ${getEnv("DEMO_ADMIN_EMAIL", defaults.adminEmail)} / ${getEnv("DEMO_ADMIN_PASSWORD", defaults.adminPassword)}`);
    console.log(`Customer: ${getEnv("DEMO_CUSTOMER_EMAIL", defaults.customerEmail)} / ${getEnv("DEMO_CUSTOMER_PASSWORD", defaults.customerPassword)}`);
    return;
  }

  const airRouteSnapshot = buildRouteSnapshot({
    destinationLabel: "UK",
    etaDaysMax: 10,
    etaDaysMin: 7,
    formulaLabel: "Air Freight = Price per KG × Total Weight",
    mode: "air",
    originLabel: "Lagos",
    routeId: ids.shippingRouteAir,
    routeVersionId: ids.shippingRouteVersionAir,
    termsSummary: "Final shipping cost is confirmed after warehouse weighing and proof upload.",
  });
  const seaRouteSnapshot = buildRouteSnapshot({
    destinationLabel: "UK",
    etaDaysMax: 40,
    etaDaysMin: 30,
    formulaLabel: "Sea Freight = Price per CBM × Total Volume",
    mode: "sea",
    originLabel: "Lagos",
    routeId: ids.shippingRouteSea,
    routeVersionId: ids.shippingRouteVersionSea,
    termsSummary: "Final shipping cost is confirmed after warehouse weighing and proof upload.",
  });

  await supabase.from("categories").upsert(
    [
      {
        description: "Curated manual-upload catalog items for daily browsing.",
        featured: true,
        id: ids.categoryFashion,
        name: "Fashion & Accessories",
        slug: "fashion-accessories",
        sort_order: 1,
      },
      {
        description: "Imported lighting and small home essentials.",
        featured: false,
        id: ids.categoryLighting,
        name: "Lighting",
        slug: "lighting",
        sort_order: 2,
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("currency_pairs").upsert(
    [
      {
        base_currency: "USD",
        id: "44444444-4444-4444-4444-444444444441",
        quote_currency: "NGN",
        rate: 1600,
      },
      {
        base_currency: "CNY",
        id: "44444444-4444-4444-4444-444444444442",
        quote_currency: "NGN",
        rate: 220,
      },
    ],
    { onConflict: "base_currency,quote_currency" },
  );

  await supabase.from("app_settings").upsert(
    [
      {
        default_moq: 1,
        id: "singleton",
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("shipping_routes").upsert(
    [
      {
        destination_label: "UK",
        eta_days_max: 10,
        eta_days_min: 7,
        formula_label: "Air Freight = Price per KG × Total Weight",
        id: ids.shippingRouteAir,
        mode: "air",
        origin_label: "Lagos",
        terms_summary: "Final shipping cost is confirmed after warehouse weighing and proof upload.",
        title: "Lagos to UK Air Freight",
      },
      {
        destination_label: "UK",
        eta_days_max: 40,
        eta_days_min: 30,
        formula_label: "Sea Freight = Price per CBM × Total Volume",
        id: ids.shippingRouteSea,
        mode: "sea",
        origin_label: "Lagos",
        terms_summary: "Final shipping cost is confirmed after warehouse weighing and proof upload.",
        title: "Lagos to UK Sea Freight",
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("shipping_route_versions").upsert(
    [
      {
        formula_kind: "per_kg",
        formula_label: "Air Freight = Price per KG × Total Weight",
        id: ids.shippingRouteVersionAir,
        price_per_kg: 10,
        rate_currency: "USD",
        route_id: ids.shippingRouteAir,
        usd_to_ngn_rate: 1600,
        version_label: "April 2026 Air Tariff",
      },
      {
        formula_kind: "per_cbm",
        formula_label: "Sea Freight = Price per CBM × Total Volume",
        id: ids.shippingRouteVersionSea,
        price_per_cbm: 34.38,
        rate_currency: "USD",
        route_id: ids.shippingRouteSea,
        usd_to_ngn_rate: 1600,
        version_label: "April 2026 Sea Tariff",
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("products").upsert(
    [
      {
        base_price_cny: 418.18,
        base_price_ngn: 92000,
        category_id: ids.categoryFashion,
        cover_image_url: "/ProductImage.jpg",
        description: "A persisted manual-upload product used for real customer and admin testing against Supabase-backed data.",
        featured: true,
        id: ids.manualProduct,
        moq: 1,
        moq_override: 1,
        sell_price_cny: 418.18,
        sell_price_ngn: 92000,
        short_description: "Manual-upload sample product backed by seeded Supabase data.",
        slug: "manual-product-image-item",
        source_type: "manual",
        status: "live",
        title: "Product Image Sample",
        volume_cbm: 0.2,
        weight_kg: 1.4,
      },
      {
        base_price_cny: 345.45,
        base_price_ngn: 76000,
        category_id: ids.categoryLighting,
        cover_image_url: "/ProductImage.jpg",
        description: "An API-linked draft product for admin imports and unavailable-product review flows.",
        featured: false,
        id: ids.apiProduct,
        moq: 2,
        moq_override: 2,
        sell_price_cny: 368.18,
        sell_price_ngn: 81000,
        short_description: "ELIM-linked test product for admin QA.",
        slug: "elim-floor-lamp",
        source_type: "api",
        status: "draft",
        title: "ELIM Floor Lamp",
        volume_cbm: 0.45,
        weight_kg: 2.8,
      },
    ],
    { onConflict: "id" },
  );

  try {
    await supabase.from("product_sources").upsert(
      [
        {
          availability_status: "available",
          id: ids.apiSource,
          last_synced_at: new Date().toISOString(),
          product_id: ids.apiProduct,
          provider: "elim",
          source_currency: "CNY",
          source_payload: {
            title: "ELIM Floor Lamp",
          },
          source_platform: "taobao",
          source_price: 230,
          source_product_id: "taobao-floor-lamp-001",
          source_url: "https://item.taobao.com/item.htm?id=10000001",
        },
      ],
      { onConflict: "id" },
    );
  } catch {
    await supabase.from("product_sources").upsert(
      [
        {
          availability_status: "available",
          id: ids.apiSource,
          last_synced_at: new Date().toISOString(),
          product_id: ids.apiProduct,
          provider: "elim",
          source_currency: "CNY",
          source_payload: {
            title: "ELIM Floor Lamp",
          },
          source_price: 230,
          source_product_id: "taobao-floor-lamp-001",
          source_url: "https://item.taobao.com/item.htm?id=10000001",
        },
      ],
      { onConflict: "id" },
    );
  }

  await supabase.from("consignees").upsert(
    [
      {
        city_or_state: "Lagos",
        full_name: "Ngozi Receiver",
        id: ids.consigneeDefault,
        is_default: true,
        notes: "Default Lagos hub pickup contact",
        phone: "+2348000000001",
        user_id: customerUser.id,
      },
      {
        city_or_state: "Abuja",
        full_name: "Tunde Receiver",
        id: ids.consigneeSecond,
        is_default: false,
        notes: "Backup Abuja consignee for alternate routing",
        phone: "+2348000000002",
        user_id: customerUser.id,
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("orders").upsert(
    [
      {
        consignee_id: ids.consigneeDefault,
        currency: "NGN",
        grand_total_ngn: 118400,
        id: ids.customerOrderAwaitingShippingPayment,
        logistics_total_ngn: 26400,
        payment_reference: "demo-product-paystack-ref-1001",
        payment_status: "paid",
        payment_verified_at: "2026-04-17T09:15:00.000Z",
        product_payment_cny_to_ngn_rate: 220,
        product_payment_state: "paid",
        product_payment_total_ngn: 92000,
        product_subtotal_cny: 418.18,
        product_subtotal_ngn: 92000,
        route: "air",
        route_accepted: true,
        route_accepted_at: "2026-04-17T09:00:00.000Z",
        route_snapshot: airRouteSnapshot,
        service_fee_ngn: 0,
        shipping_cost_ngn: 26400,
        shipping_payment_state: "pending",
        shipping_route_id: ids.shippingRouteAir,
        shipping_route_version_id: ids.shippingRouteVersionAir,
        status: "awaiting_shipping_payment",
        user_id: customerUser.id,
      },
      {
        consignee_id: ids.consigneeSecond,
        currency: "NGN",
        grand_total_ngn: 103000,
        id: ids.customerOrderShippingPaid,
        logistics_total_ngn: 11000,
        payment_reference: "demo-product-paystack-ref-1000",
        payment_status: "paid",
        payment_verified_at: "2026-04-16T15:45:00.000Z",
        product_payment_cny_to_ngn_rate: 220,
        product_payment_state: "paid",
        product_payment_total_ngn: 92000,
        product_subtotal_cny: 418.18,
        product_subtotal_ngn: 92000,
        route: "sea",
        route_accepted: true,
        route_accepted_at: "2026-04-16T15:30:00.000Z",
        route_snapshot: seaRouteSnapshot,
        service_fee_ngn: 0,
        shipping_cost_ngn: 11000,
        shipping_payment_state: "paid",
        shipping_route_id: ids.shippingRouteSea,
        shipping_route_version_id: ids.shippingRouteVersionSea,
        status: "shipping_paid",
        user_id: customerUser.id,
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("shipping_payments").delete().in("order_id", [
    ids.customerOrderAwaitingShippingPayment,
    ids.customerOrderShippingPaid,
  ]);
  await supabase.from("product_payments").delete().in("order_id", [
    ids.customerOrderAwaitingShippingPayment,
    ids.customerOrderShippingPaid,
  ]);
  await supabase.from("order_shipments").delete().in("order_id", [
    ids.customerOrderAwaitingShippingPayment,
    ids.customerOrderShippingPaid,
  ]);
  await supabase.from("order_items").delete().in("order_id", [
    ids.customerOrderAwaitingShippingPayment,
    ids.customerOrderShippingPaid,
  ]);
  await supabase.from("order_status_events").delete().in("order_id", [
    ids.customerOrderAwaitingShippingPayment,
    ids.customerOrderShippingPaid,
  ]);

  await supabase.from("order_items").insert([
    {
      effective_moq_snapshot: 1,
      line_total_cny_snapshot: 418.18,
      id: ids.orderItemAwaitingShippingPayment,
      line_total_ngn_snapshot: 92000,
      logistics_fee_ngn_snapshot: 0,
      moq_snapshot: 1,
      order_id: ids.customerOrderAwaitingShippingPayment,
      product_id: ids.manualProduct,
      product_title_snapshot: "Product Image Sample",
      product_unit_price_cny_snapshot: 418.18,
      product_unit_price_ngn_snapshot: 92000,
      quantity: 1,
      volume_cbm_snapshot: 0.2,
      weight_kg_snapshot: 1.4,
    },
    {
      effective_moq_snapshot: 1,
      line_total_cny_snapshot: 418.18,
      id: ids.orderItemShippingPaid,
      line_total_ngn_snapshot: 92000,
      logistics_fee_ngn_snapshot: 0,
      moq_snapshot: 1,
      order_id: ids.customerOrderShippingPaid,
      product_id: ids.manualProduct,
      product_title_snapshot: "Product Image Sample",
      product_unit_price_cny_snapshot: 418.18,
      product_unit_price_ngn_snapshot: 92000,
      quantity: 1,
      volume_cbm_snapshot: 0.2,
      weight_kg_snapshot: 1.4,
    },
  ]);

  await supabase.from("product_payments").upsert(
    [
      {
        amount_ngn: 92000,
        id: ids.productPaymentAwaitingShippingPayment,
        order_id: ids.customerOrderAwaitingShippingPayment,
        paid_at: "2026-04-17T09:15:00.000Z",
        payment_reference: "demo-product-paystack-ref-1001",
        provider: "paystack",
        status: "paid",
      },
      {
        amount_ngn: 92000,
        id: ids.productPaymentShippingPaid,
        order_id: ids.customerOrderShippingPaid,
        paid_at: "2026-04-16T15:45:00.000Z",
        payment_reference: "demo-product-paystack-ref-1000",
        provider: "paystack",
        status: "paid",
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("order_shipments").upsert(
    [
      {
        customer_notified_at: "2026-04-18T08:30:00.000Z",
        id: ids.shipmentAwaitingShippingPayment,
        measured_at: "2026-04-18T08:15:00.000Z",
        measured_by_profile_id: adminUser.id,
        measured_weight_kg: 1.65,
        measurement_basis: "weight_kg",
        order_id: ids.customerOrderAwaitingShippingPayment,
        shipping_cost_usd: 16.5,
        shipping_cost_ngn: 26400,
        shipping_quote_snapshot: buildQuoteSnapshot({
          formulaKind: "per_kg",
          measurementBasis: "weight_kg",
          mode: "air",
          pricePerKg: 10,
          rateCurrency: "USD",
          shippingCostUsd: 16.5,
          usdToNgnRate: 1600,
        }),
        weighing_proof_mime_type: "image/jpeg",
        weighing_proof_path: "/ProductImage.jpg",
      },
      {
        customer_notified_at: "2026-04-16T16:30:00.000Z",
        id: ids.shipmentShippingPaid,
        measured_at: "2026-04-16T16:00:00.000Z",
        measured_by_profile_id: adminUser.id,
        measured_volume_cbm: 0.2,
        measurement_basis: "volume_cbm",
        order_id: ids.customerOrderShippingPaid,
        shipping_cost_usd: 6.88,
        shipping_cost_ngn: 11000,
        shipping_quote_snapshot: buildQuoteSnapshot({
          formulaKind: "per_cbm",
          measurementBasis: "volume_cbm",
          mode: "sea",
          pricePerCbm: 34.38,
          rateCurrency: "USD",
          shippingCostUsd: 6.88,
          usdToNgnRate: 1600,
        }),
        weighing_proof_mime_type: "image/jpeg",
        weighing_proof_path: "/ProductImage.jpg",
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("shipping_payments").upsert(
    [
      {
        amount_ngn: 26400,
        id: ids.shippingPaymentAwaitingShippingPayment,
        order_id: ids.customerOrderAwaitingShippingPayment,
        provider: "paystack",
        shipment_id: ids.shipmentAwaitingShippingPayment,
        status: "pending",
      },
      {
        amount_ngn: 11000,
        id: ids.shippingPaymentShippingPaid,
        order_id: ids.customerOrderShippingPaid,
        paid_at: "2026-04-16T17:00:00.000Z",
        payment_reference: "demo-shipping-paystack-ref-1000",
        provider: "paystack",
        shipment_id: ids.shipmentShippingPaid,
        status: "paid",
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("order_status_events").insert([
    {
      note: "Customer accepted the selected shipping route terms.",
      order_id: ids.customerOrderAwaitingShippingPayment,
      status: "route_selected",
    },
    {
      note: "Product payment completed successfully.",
      order_id: ids.customerOrderAwaitingShippingPayment,
      status: "paid_for_products",
    },
    {
      note: "Order entered the warehouse queue.",
      order_id: ids.customerOrderAwaitingShippingPayment,
      status: "awaiting_warehouse",
    },
    {
      note: "Warehouse confirmed order arrival.",
      order_id: ids.customerOrderAwaitingShippingPayment,
      status: "arrived_at_warehouse",
    },
    {
      note: "Warehouse completed measurement and uploaded proof.",
      order_id: ids.customerOrderAwaitingShippingPayment,
      status: "weighed",
    },
    {
      note: "Customer notification sent for shipping payment.",
      order_id: ids.customerOrderAwaitingShippingPayment,
      status: "awaiting_shipping_payment",
    },
    {
      note: "Customer accepted the selected shipping route terms.",
      order_id: ids.customerOrderShippingPaid,
      status: "route_selected",
    },
    {
      note: "Product payment completed successfully.",
      order_id: ids.customerOrderShippingPaid,
      status: "paid_for_products",
    },
    {
      note: "Order entered the warehouse queue.",
      order_id: ids.customerOrderShippingPaid,
      status: "awaiting_warehouse",
    },
    {
      note: "Warehouse confirmed order arrival.",
      order_id: ids.customerOrderShippingPaid,
      status: "arrived_at_warehouse",
    },
    {
      note: "Warehouse completed measurement and uploaded proof.",
      order_id: ids.customerOrderShippingPaid,
      status: "weighed",
    },
    {
      note: "Customer notification sent for shipping payment.",
      order_id: ids.customerOrderShippingPaid,
      status: "awaiting_shipping_payment",
    },
    {
      note: "Shipping payment completed successfully.",
      order_id: ids.customerOrderShippingPaid,
      status: "shipping_paid",
    },
  ]);

  await supabase.from("import_jobs").upsert(
    [
      {
        created_by: adminUser.id,
        duplicate_count: 1,
        failed_count: 0,
        id: ids.adminImportJob,
        imported_count: 1,
        mode: "keyword_search",
        status: "completed",
        submitted_count: 2,
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("import_job_items").delete().in("id", [ids.adminImportItem1, ids.adminImportItem2]);

  try {
    await supabase.from("import_job_items").insert([
      {
        id: ids.adminImportItem1,
        import_job_id: ids.adminImportJob,
        source_input: "LED floor lamp",
        source_platform: "taobao",
        source_product_id: "taobao-floor-lamp-001",
        status: "imported",
      },
      {
        id: ids.adminImportItem2,
        import_job_id: ids.adminImportJob,
        source_input: "LED floor lamp duplicate",
        source_platform: "alibaba",
        source_product_id: "1688-floor-lamp-002",
        status: "duplicate",
      },
    ]);
  } catch {
    await supabase.from("import_job_items").insert([
      {
        id: ids.adminImportItem1,
        import_job_id: ids.adminImportJob,
        source_input: "LED floor lamp",
        source_product_id: "taobao-floor-lamp-001",
        status: "imported",
      },
      {
        id: ids.adminImportItem2,
        import_job_id: ids.adminImportJob,
        source_input: "LED floor lamp duplicate",
        source_product_id: "1688-floor-lamp-002",
        status: "duplicate",
      },
    ]);
  }

  await supabase.from("catalog_alerts").upsert(
    [
      {
        alert_type: "source_unavailable",
        detail: "Availability scan flagged the linked source as missing stock.",
        id: ids.unavailableAlert,
        product_id: ids.apiProduct,
        resolved: false,
        title: "ELIM source needs review",
      },
    ],
    { onConflict: "id" },
  );

  console.log("Demo Supabase auth users and two-phase commerce data seeded.");
  console.log(`Admin: ${getEnv("DEMO_ADMIN_EMAIL", defaults.adminEmail)} / ${getEnv("DEMO_ADMIN_PASSWORD", defaults.adminPassword)}`);
  console.log(`Customer: ${getEnv("DEMO_CUSTOMER_EMAIL", defaults.customerEmail)} / ${getEnv("DEMO_CUSTOMER_PASSWORD", defaults.customerPassword)}`);
}

seedDemoData().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
