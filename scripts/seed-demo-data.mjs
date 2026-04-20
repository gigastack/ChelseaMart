import { readFileSync, existsSync } from "node:fs";
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
  customerOrderConfirmed: "77777777-7777-7777-7777-777777777771",
  customerOrderDelivered: "77777777-7777-7777-7777-777777777772",
  manualProduct: "11111111-1111-1111-1111-111111111111",
  orderEvent1: "88888888-8888-8888-8888-888888888881",
  orderEvent2: "88888888-8888-8888-8888-888888888882",
  orderEvent3: "88888888-8888-8888-8888-888888888883",
  orderEvent4: "88888888-8888-8888-8888-888888888884",
  orderItem1: "99999999-9999-9999-9999-999999999991",
  orderItem2: "99999999-9999-9999-9999-999999999992",
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
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const checks = await Promise.all([
      tableExists(supabase, "categories"),
      tableExists(supabase, "products"),
      tableExists(supabase, "consignees"),
      tableExists(supabase, "orders"),
    ]);

    if (checks.every(Boolean)) {
      return true;
    }

    if (attempt < attempts) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return false;
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
      "Commerce schema is not available in the configured Supabase project. Seeded auth users only; catalog, consignee, order, and import data remain on the compatibility fallback until migrations are applied. Set DATABASE_URL and run `npm run db:migrate` first.",
    );
    console.log(`Admin: ${getEnv("DEMO_ADMIN_EMAIL", defaults.adminEmail)} / ${getEnv("DEMO_ADMIN_PASSWORD", defaults.adminPassword)}`);
    console.log(`Customer: ${getEnv("DEMO_CUSTOMER_EMAIL", defaults.customerEmail)} / ${getEnv("DEMO_CUSTOMER_PASSWORD", defaults.customerPassword)}`);
    return;
  }

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

  await supabase.from("shipping_configs").upsert(
    [
      {
        id: "55555555-5555-5555-5555-555555555551",
        minimum_fee_ngn: 18000,
        price_per_kg_usd: 14,
        route: "air",
      },
      {
        id: "55555555-5555-5555-5555-555555555552",
        minimum_fee_ngn: 9000,
        price_per_kg_usd: 6,
        route: "sea",
      },
    ],
    { onConflict: "route" },
  );

  await supabase.from("products").upsert(
    [
      {
        base_price_ngn: 92000,
        category_id: ids.categoryFashion,
        cover_image_url: "/ProductImage.jpg",
        description:
          "A persisted manual-upload product used for real customer and admin testing against Supabase-backed data.",
        featured: true,
        id: ids.manualProduct,
        moq: 1,
        sell_price_ngn: 92000,
        short_description: "Manual-upload sample product backed by seeded Supabase data.",
        slug: "manual-product-image-item",
        source_type: "manual",
        status: "live",
        title: "Product Image Sample",
        weight_kg: 1.4,
      },
      {
        base_price_ngn: 76000,
        category_id: ids.categoryLighting,
        cover_image_url: "/ProductImage.jpg",
        description:
          "An API-linked draft product for admin imports and unavailable-product review flows.",
        featured: false,
        id: ids.apiProduct,
        moq: 2,
        sell_price_ngn: 81000,
        short_description: "ELIM-linked test product for admin QA.",
        slug: "elim-floor-lamp",
        source_type: "api",
        status: "draft",
        title: "ELIM Floor Lamp",
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
        id: ids.customerOrderConfirmed,
        logistics_total_ngn: 26400,
        payment_reference: "demo-paystack-ref-1001",
        payment_status: "paid",
        product_subtotal_ngn: 92000,
        route: "air",
        status: "processing",
        user_id: customerUser.id,
      },
      {
        consignee_id: ids.consigneeSecond,
        currency: "NGN",
        grand_total_ngn: 103000,
        id: ids.customerOrderDelivered,
        logistics_total_ngn: 11000,
        payment_reference: "demo-paystack-ref-1000",
        payment_status: "paid",
        product_subtotal_ngn: 92000,
        route: "sea",
        status: "delivered",
        user_id: customerUser.id,
      },
    ],
    { onConflict: "id" },
  );

  await supabase.from("order_items").delete().in("id", [ids.orderItem1, ids.orderItem2]);
  await supabase.from("order_status_events").delete().in("id", [ids.orderEvent1, ids.orderEvent2, ids.orderEvent3, ids.orderEvent4]);

  await supabase.from("order_items").insert([
    {
      id: ids.orderItem1,
      line_total_ngn_snapshot: 118400,
      logistics_fee_ngn_snapshot: 26400,
      moq_snapshot: 1,
      order_id: ids.customerOrderConfirmed,
      product_id: ids.manualProduct,
      product_title_snapshot: "Product Image Sample",
      product_unit_price_ngn_snapshot: 92000,
      quantity: 1,
      weight_kg_snapshot: 1.4,
    },
    {
      id: ids.orderItem2,
      line_total_ngn_snapshot: 103000,
      logistics_fee_ngn_snapshot: 11000,
      moq_snapshot: 1,
      order_id: ids.customerOrderDelivered,
      product_id: ids.manualProduct,
      product_title_snapshot: "Product Image Sample",
      product_unit_price_ngn_snapshot: 92000,
      quantity: 1,
      weight_kg_snapshot: 1.4,
    },
  ]);

  await supabase.from("order_status_events").insert([
    {
      id: ids.orderEvent1,
      note: "Payment confirmed and queued for supplier handoff.",
      order_id: ids.customerOrderConfirmed,
      status: "confirmed",
    },
    {
      id: ids.orderEvent2,
      note: "Supplier accepted the order and procurement is in progress.",
      order_id: ids.customerOrderConfirmed,
      status: "processing",
    },
    {
      id: ids.orderEvent3,
      note: "Shipment completed and consignee confirmed delivery.",
      order_id: ids.customerOrderDelivered,
      status: "shipped",
    },
    {
      id: ids.orderEvent4,
      note: "Delivered to the selected consignee.",
      order_id: ids.customerOrderDelivered,
      status: "delivered",
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

  console.log("Demo Supabase auth users and commerce data seeded.");
  console.log(`Admin: ${getEnv("DEMO_ADMIN_EMAIL", defaults.adminEmail)} / ${getEnv("DEMO_ADMIN_PASSWORD", defaults.adminPassword)}`);
  console.log(`Customer: ${getEnv("DEMO_CUSTOMER_EMAIL", defaults.customerEmail)} / ${getEnv("DEMO_CUSTOMER_PASSWORD", defaults.customerPassword)}`);
}

seedDemoData().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
