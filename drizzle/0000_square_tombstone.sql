CREATE TYPE "public"."catalog_alert_type" AS ENUM('source_unavailable', 'sync_failed', 'missing_required_data');--> statement-breakpoint
CREATE TYPE "public"."checkout_route" AS ENUM('air', 'sea');--> statement-breakpoint
CREATE TYPE "public"."elim_platform" AS ENUM('alibaba', 'taobao');--> statement-breakpoint
CREATE TYPE "public"."import_job_item_status" AS ENUM('queued', 'imported', 'duplicate', 'failed', 'needs_review');--> statement-breakpoint
CREATE TYPE "public"."import_job_status" AS ENUM('queued', 'processing', 'completed', 'completed_with_errors', 'failed');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'failed');--> statement-breakpoint
CREATE TYPE "public"."product_source_type" AS ENUM('manual', 'api');--> statement-breakpoint
CREATE TYPE "public"."product_status" AS ENUM('draft', 'live', 'removed', 'unavailable');--> statement-breakpoint
CREATE TYPE "public"."profile_role" AS ENUM('customer', 'admin');--> statement-breakpoint
CREATE TABLE "catalog_alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"alert_type" "catalog_alert_type" NOT NULL,
	"title" text NOT NULL,
	"detail" text,
	"resolved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "consignees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"full_name" text NOT NULL,
	"phone" text NOT NULL,
	"city_or_state" text NOT NULL,
	"notes" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "currency_pairs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"base_currency" text NOT NULL,
	"quote_currency" text NOT NULL,
	"rate" numeric(18, 6) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "currency_pairs_base_quote_unique" UNIQUE("base_currency","quote_currency")
);
--> statement-breakpoint
CREATE TABLE "import_job_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"import_job_id" uuid NOT NULL,
	"source_input" text NOT NULL,
	"source_product_id" text,
	"source_platform" "elim_platform",
	"status" "import_job_item_status" DEFAULT 'queued' NOT NULL,
	"failure_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "import_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mode" text NOT NULL,
	"status" "import_job_status" DEFAULT 'queued' NOT NULL,
	"submitted_count" integer DEFAULT 0 NOT NULL,
	"imported_count" integer DEFAULT 0 NOT NULL,
	"failed_count" integer DEFAULT 0 NOT NULL,
	"duplicate_count" integer DEFAULT 0 NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid,
	"product_title_snapshot" text NOT NULL,
	"quantity" integer NOT NULL,
	"moq_snapshot" integer NOT NULL,
	"weight_kg_snapshot" numeric(10, 3) NOT NULL,
	"product_unit_price_ngn_snapshot" numeric(18, 2) NOT NULL,
	"logistics_fee_ngn_snapshot" numeric(18, 2) NOT NULL,
	"line_total_ngn_snapshot" numeric(18, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_status_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"status" "order_status" NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"consignee_id" uuid NOT NULL,
	"route" "checkout_route" NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"currency" text DEFAULT 'NGN' NOT NULL,
	"product_subtotal_ngn" numeric(18, 2) NOT NULL,
	"logistics_total_ngn" numeric(18, 2) NOT NULL,
	"grand_total_ngn" numeric(18, 2) NOT NULL,
	"payment_reference" text,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"paystack_authorization_url" text,
	"payment_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paystack_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dedupe_key" text NOT NULL,
	"event_type" text NOT NULL,
	"order_id" uuid,
	"payment_reference" text,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"processed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "paystack_events_dedupe_key_unique" UNIQUE("dedupe_key")
);
--> statement-breakpoint
CREATE TABLE "product_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"provider" text DEFAULT 'elim' NOT NULL,
	"source_product_id" text NOT NULL,
	"source_url" text,
	"source_platform" "elim_platform" DEFAULT 'alibaba' NOT NULL,
	"source_currency" text DEFAULT 'CNY' NOT NULL,
	"source_price" numeric(18, 2),
	"source_payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"availability_status" text DEFAULT 'unknown' NOT NULL,
	"last_synced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_sources_provider_product_unique" UNIQUE("provider","source_product_id")
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"sku" text,
	"option_summary" text NOT NULL,
	"stock_quantity" integer,
	"moq" integer,
	"price_override_ngn" numeric(18, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"short_description" text,
	"description" text,
	"category_id" uuid,
	"cover_image_url" text,
	"source_type" "product_source_type" DEFAULT 'manual' NOT NULL,
	"status" "product_status" DEFAULT 'draft' NOT NULL,
	"moq" integer DEFAULT 1 NOT NULL,
	"weight_kg" numeric(10, 3) NOT NULL,
	"base_price_ngn" numeric(18, 2) NOT NULL,
	"sell_price_ngn" numeric(18, 2) NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"email" text,
	"full_name" text,
	"role" "profile_role" DEFAULT 'customer' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipping_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"route" "checkout_route" NOT NULL,
	"price_per_kg_usd" numeric(18, 2) NOT NULL,
	"minimum_fee_ngn" numeric(18, 2) DEFAULT '0' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shipping_configs_route_unique" UNIQUE("route")
);
--> statement-breakpoint
ALTER TABLE "catalog_alerts" ADD CONSTRAINT "catalog_alerts_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_job_items" ADD CONSTRAINT "import_job_items_import_job_id_import_jobs_id_fk" FOREIGN KEY ("import_job_id") REFERENCES "public"."import_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_status_events" ADD CONSTRAINT "order_status_events_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_consignee_id_consignees_id_fk" FOREIGN KEY ("consignee_id") REFERENCES "public"."consignees"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paystack_events" ADD CONSTRAINT "paystack_events_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_sources" ADD CONSTRAINT "product_sources_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "categories_parent_id_idx" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "consignees_user_id_idx" ON "consignees" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "product_sources_product_id_idx" ON "product_sources" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "products" USING btree ("status");--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");