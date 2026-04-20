create extension if not exists pgcrypto;

create type public.product_status as enum ('draft', 'live', 'removed', 'unavailable');
create type public.product_source_type as enum ('manual', 'api');
create type public.checkout_route as enum ('air', 'sea');
create type public.order_status as enum ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
create type public.import_job_status as enum ('queued', 'processing', 'completed', 'completed_with_errors', 'failed');
create type public.import_job_item_status as enum ('queued', 'imported', 'duplicate', 'failed', 'needs_review');
create type public.catalog_alert_type as enum ('source_unavailable', 'sync_failed', 'missing_required_data');

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.currency_pairs (
  id uuid primary key default gen_random_uuid(),
  base_currency text not null,
  quote_currency text not null,
  rate numeric(18,6) not null check (rate > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (base_currency, quote_currency)
);

create table if not exists public.shipping_configs (
  id uuid primary key default gen_random_uuid(),
  route public.checkout_route not null unique,
  price_per_kg_usd numeric(18,2) not null check (price_per_kg_usd >= 0),
  minimum_fee_ngn numeric(18,2) not null default 0 check (minimum_fee_ngn >= 0),
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  cover_image_url text,
  source_type public.product_source_type not null default 'manual',
  status public.product_status not null default 'draft',
  moq integer not null default 1 check (moq > 0),
  weight_kg numeric(10,3) not null check (weight_kg > 0),
  base_price_ngn numeric(18,2) not null check (base_price_ngn >= 0),
  sell_price_ngn numeric(18,2) not null check (sell_price_ngn >= 0),
  featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists products_status_idx on public.products(status);
create index if not exists products_category_idx on public.products(category_id);

create table if not exists public.product_sources (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  provider text not null default 'elim',
  source_product_id text not null,
  source_url text,
  source_currency text not null default 'CNY',
  source_price numeric(18,2),
  source_payload jsonb not null default '{}'::jsonb,
  availability_status text not null default 'unknown',
  last_synced_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (provider, source_product_id)
);

create index if not exists product_sources_product_id_idx on public.product_sources(product_id);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text,
  option_summary text not null,
  stock_quantity integer,
  moq integer check (moq is null or moq > 0),
  price_override_ngn numeric(18,2),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.consignees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  full_name text not null,
  phone text not null,
  city_or_state text not null,
  notes text,
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists consignees_user_id_idx on public.consignees(user_id);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  consignee_id uuid not null references public.consignees(id) on delete restrict,
  route public.checkout_route not null,
  status public.order_status not null default 'pending',
  currency text not null default 'NGN',
  product_subtotal_ngn numeric(18,2) not null check (product_subtotal_ngn >= 0),
  logistics_total_ngn numeric(18,2) not null check (logistics_total_ngn >= 0),
  grand_total_ngn numeric(18,2) not null check (grand_total_ngn >= 0),
  payment_reference text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_title_snapshot text not null,
  quantity integer not null check (quantity > 0),
  moq_snapshot integer not null check (moq_snapshot > 0),
  weight_kg_snapshot numeric(10,3) not null check (weight_kg_snapshot > 0),
  product_unit_price_ngn_snapshot numeric(18,2) not null check (product_unit_price_ngn_snapshot >= 0),
  logistics_fee_ngn_snapshot numeric(18,2) not null check (logistics_fee_ngn_snapshot >= 0),
  line_total_ngn_snapshot numeric(18,2) not null check (line_total_ngn_snapshot >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_status_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status public.order_status not null,
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  mode text not null,
  status public.import_job_status not null default 'queued',
  submitted_count integer not null default 0,
  imported_count integer not null default 0,
  failed_count integer not null default 0,
  duplicate_count integer not null default 0,
  created_by uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.import_job_items (
  id uuid primary key default gen_random_uuid(),
  import_job_id uuid not null references public.import_jobs(id) on delete cascade,
  source_input text not null,
  source_product_id text,
  status public.import_job_item_status not null default 'queued',
  failure_reason text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.catalog_alerts (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  alert_type public.catalog_alert_type not null,
  title text not null,
  detail text,
  resolved boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  resolved_at timestamptz
);
