do $$
begin
  if not exists (
    select 1
    from pg_type
    where typnamespace = 'public'::regnamespace
      and typname = 'route_version_formula_kind'
  ) then
    create type public.route_version_formula_kind as enum ('per_kg', 'per_cbm');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typnamespace = 'public'::regnamespace
      and typname = 'shipment_measurement_basis'
  ) then
    create type public.shipment_measurement_basis as enum ('weight_kg', 'volume_cbm');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typnamespace = 'public'::regnamespace
      and typname = 'shipping_payment_state'
  ) then
    create type public.shipping_payment_state as enum ('not_due', 'pending', 'paid', 'failed');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typnamespace = 'public'::regnamespace
      and t.typname = 'order_status'
      and e.enumlabel = 'awaiting_shipping_payment'
  ) then
    drop type if exists public.order_status_v2;
    create type public.order_status_v2 as enum (
      'cart',
      'route_selected',
      'paid_for_products',
      'awaiting_warehouse',
      'arrived_at_warehouse',
      'weighed',
      'awaiting_shipping_payment',
      'shipping_paid',
      'in_transit',
      'arrived_destination',
      'out_for_delivery',
      'delivered',
      'cancelled'
    );

    alter table public.order_status_events
      alter column status type public.order_status_v2
      using (
        case status::text
          when 'pending' then 'route_selected'
          when 'confirmed' then 'paid_for_products'
          when 'processing' then 'awaiting_warehouse'
          when 'shipped' then 'in_transit'
          else status::text
        end
      )::public.order_status_v2;

    alter table public.orders alter column status drop default;

    alter table public.orders
      alter column status type public.order_status_v2
      using (
        case status::text
          when 'pending' then 'route_selected'
          when 'confirmed' then 'paid_for_products'
          when 'processing' then 'awaiting_warehouse'
          when 'shipped' then 'in_transit'
          else status::text
        end
      )::public.order_status_v2;

    drop type public.order_status;
    alter type public.order_status_v2 rename to order_status;
  end if;
end $$;

alter table public.products
  add column if not exists volume_cbm numeric(10,3);

alter table public.order_items
  add column if not exists volume_cbm_snapshot numeric(10,3);

alter table public.order_items
  alter column weight_kg_snapshot drop not null;

create table if not exists public.shipping_routes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  origin_label text not null,
  destination_label text not null,
  mode public.checkout_route not null,
  formula_label text not null,
  eta_days_min integer not null,
  eta_days_max integer not null,
  terms_summary text not null,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.shipping_route_versions (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.shipping_routes(id) on delete cascade,
  version_label text not null,
  formula_kind public.route_version_formula_kind not null,
  formula_label text not null,
  rate_currency text not null default 'NGN',
  price_per_kg numeric(18,2),
  price_per_cbm numeric(18,2),
  usd_to_ngn_rate numeric(18,6),
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.order_shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  measurement_basis public.shipment_measurement_basis,
  measured_weight_kg numeric(10,3),
  measured_volume_cbm numeric(10,3),
  measured_at timestamptz,
  measured_by_profile_id uuid,
  weighing_proof_path text,
  weighing_proof_mime_type text,
  shipping_quote_snapshot jsonb,
  shipping_cost_ngn numeric(18,2),
  customer_notified_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.product_payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  amount_ngn numeric(18,2) not null,
  provider text not null default 'paystack',
  payment_reference text unique,
  status public.payment_status not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.shipping_payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  shipment_id uuid not null references public.order_shipments(id) on delete cascade,
  amount_ngn numeric(18,2) not null,
  provider text not null default 'paystack',
  payment_reference text unique,
  status public.payment_status not null default 'pending',
  payload jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.orders
  add column if not exists shipping_route_id uuid references public.shipping_routes(id) on delete set null,
  add column if not exists shipping_route_version_id uuid references public.shipping_route_versions(id) on delete set null,
  add column if not exists route_accepted boolean not null default false,
  add column if not exists route_accepted_at timestamptz,
  add column if not exists route_snapshot jsonb,
  add column if not exists service_fee_ngn numeric(18,2) not null default 0,
  add column if not exists product_payment_total_ngn numeric(18,2) not null default 0,
  add column if not exists product_payment_state public.payment_status not null default 'pending',
  add column if not exists shipping_payment_state public.shipping_payment_state not null default 'not_due',
  add column if not exists shipping_cost_ngn numeric(18,2);

alter table public.orders
  alter column route drop not null;

alter table public.orders
  alter column status set default 'cart';

create index if not exists shipping_routes_mode_idx on public.shipping_routes(mode);
create index if not exists shipping_route_versions_route_id_idx on public.shipping_route_versions(route_id);
create index if not exists order_shipments_order_id_idx on public.order_shipments(order_id);
create index if not exists product_payments_order_id_idx on public.product_payments(order_id);
create index if not exists shipping_payments_order_id_idx on public.shipping_payments(order_id);
create index if not exists shipping_payments_shipment_id_idx on public.shipping_payments(shipment_id);

insert into public.shipping_routes (
  id,
  title,
  origin_label,
  destination_label,
  mode,
  formula_label,
  eta_days_min,
  eta_days_max,
  terms_summary,
  active
)
values
  (
    'aaaaaaaa-1111-1111-1111-111111111111',
    'Default Air Route',
    'Origin pending',
    'Destination pending',
    'air',
    'Air Freight = Price per KG × Total Weight',
    7,
    14,
    'Final shipping cost is confirmed after warehouse measurement and proof upload.',
    true
  ),
  (
    'aaaaaaaa-2222-2222-2222-222222222222',
    'Default Sea Route',
    'Origin pending',
    'Destination pending',
    'sea',
    'Sea Freight = Price per CBM × Total Volume',
    30,
    45,
    'Final shipping cost is confirmed after warehouse measurement and proof upload.',
    true
  )
on conflict (id) do nothing;

insert into public.shipping_route_versions (
  id,
  route_id,
  version_label,
  formula_kind,
  formula_label,
  rate_currency,
  price_per_kg,
  price_per_cbm,
  usd_to_ngn_rate,
  active
)
values
  (
    'bbbbbbbb-1111-1111-1111-111111111111',
    'aaaaaaaa-1111-1111-1111-111111111111',
    'Legacy migrated air tariff',
    'per_kg',
    'Air Freight = Price per KG × Total Weight',
    'USD',
    coalesce((select price_per_kg_usd from public.shipping_configs where route = 'air' limit 1), 0),
    null,
    (select rate from public.currency_pairs where base_currency = 'USD' and quote_currency = 'NGN' limit 1),
    true
  ),
  (
    'bbbbbbbb-2222-2222-2222-222222222222',
    'aaaaaaaa-2222-2222-2222-222222222222',
    'Legacy migrated sea tariff',
    'per_cbm',
    'Sea Freight = Price per CBM × Total Volume',
    'NGN',
    null,
    coalesce((select minimum_fee_ngn from public.shipping_configs where route = 'sea' limit 1), 0),
    null,
    true
  )
on conflict (id) do nothing;

update public.orders
set
  route_accepted = coalesce(route is not null, false),
  route_accepted_at = coalesce(route_accepted_at, created_at),
  service_fee_ngn = coalesce(service_fee_ngn, 0),
  product_payment_total_ngn = coalesce(product_payment_total_ngn, product_subtotal_ngn),
  shipping_cost_ngn = case
    when coalesce(logistics_total_ngn, 0) > 0 then coalesce(shipping_cost_ngn, logistics_total_ngn)
    else shipping_cost_ngn
  end,
  product_payment_state = case
    when coalesce(payment_status::text, 'pending') = 'paid' then 'paid'::public.payment_status
    when coalesce(payment_status::text, 'pending') = 'failed' then 'failed'::public.payment_status
    else 'pending'::public.payment_status
  end,
  shipping_payment_state = case
    when coalesce(logistics_total_ngn, 0) <= 0 then 'not_due'::public.shipping_payment_state
    when coalesce(payment_status::text, 'pending') = 'paid' then 'paid'::public.shipping_payment_state
    when coalesce(payment_status::text, 'pending') = 'failed' then 'failed'::public.shipping_payment_state
    else 'pending'::public.shipping_payment_state
  end,
  shipping_route_id = coalesce(
    shipping_route_id,
    case route
      when 'air' then 'aaaaaaaa-1111-1111-1111-111111111111'::uuid
      when 'sea' then 'aaaaaaaa-2222-2222-2222-222222222222'::uuid
      else null
    end
  ),
  shipping_route_version_id = coalesce(
    shipping_route_version_id,
    case route
      when 'air' then 'bbbbbbbb-1111-1111-1111-111111111111'::uuid
      when 'sea' then 'bbbbbbbb-2222-2222-2222-222222222222'::uuid
      else null
    end
  ),
  route_snapshot = coalesce(
    route_snapshot,
    case route
      when 'air' then jsonb_build_object(
        'destinationLabel', 'Destination pending',
        'etaDaysMax', 14,
        'etaDaysMin', 7,
        'formulaLabel', 'Air Freight = Price per KG × Total Weight',
        'mode', 'air',
        'originLabel', 'Origin pending',
        'routeId', 'aaaaaaaa-1111-1111-1111-111111111111',
        'routeVersionId', 'bbbbbbbb-1111-1111-1111-111111111111',
        'termsSummary', 'Final shipping cost is confirmed after warehouse measurement and proof upload.'
      )
      when 'sea' then jsonb_build_object(
        'destinationLabel', 'Destination pending',
        'etaDaysMax', 45,
        'etaDaysMin', 30,
        'formulaLabel', 'Sea Freight = Price per CBM × Total Volume',
        'mode', 'sea',
        'originLabel', 'Origin pending',
        'routeId', 'aaaaaaaa-2222-2222-2222-222222222222',
        'routeVersionId', 'bbbbbbbb-2222-2222-2222-222222222222',
        'termsSummary', 'Final shipping cost is confirmed after warehouse measurement and proof upload.'
      )
      else null
    end
  ),
  grand_total_ngn = coalesce(
    grand_total_ngn,
    coalesce(product_payment_total_ngn, product_subtotal_ngn, 0) + coalesce(shipping_cost_ngn, logistics_total_ngn, 0)
  );

insert into public.product_payments (
  id,
  order_id,
  amount_ngn,
  provider,
  payment_reference,
  status,
  paid_at
)
select
  gen_random_uuid(),
  o.id,
  coalesce(o.product_payment_total_ngn, o.product_subtotal_ngn, 0),
  'paystack',
  o.payment_reference,
  case
    when o.product_payment_state::text = 'paid' then 'paid'::public.payment_status
    when o.product_payment_state::text = 'failed' then 'failed'::public.payment_status
    else 'pending'::public.payment_status
  end,
  case
    when o.product_payment_state::text = 'paid' then coalesce(o.payment_verified_at, o.updated_at, o.created_at)
    else null
  end
from public.orders o
where not exists (
  select 1
  from public.product_payments pp
  where pp.order_id = o.id
);

insert into public.order_shipments (
  id,
  order_id,
  measurement_basis,
  measured_weight_kg,
  measured_volume_cbm,
  measured_at,
  shipping_quote_snapshot,
  shipping_cost_ngn
)
select
  gen_random_uuid(),
  o.id,
  case
    when o.route = 'air' then 'weight_kg'::public.shipment_measurement_basis
    when o.route = 'sea' then 'volume_cbm'::public.shipment_measurement_basis
    else null
  end,
  case
    when o.route = 'air' then (
      select sum(coalesce(oi.weight_kg_snapshot, 0) * oi.quantity)
      from public.order_items oi
      where oi.order_id = o.id
    )
    else null
  end,
  case
    when o.route = 'sea' then (
      select sum(coalesce(oi.volume_cbm_snapshot, 0) * oi.quantity)
      from public.order_items oi
      where oi.order_id = o.id
    )
    else null
  end,
  coalesce(o.payment_verified_at, o.updated_at, o.created_at),
  case
    when o.route = 'air' then jsonb_build_object(
      'formulaKind', 'per_kg',
      'measurementBasis', 'weight_kg',
      'mode', 'air',
      'pricePerCbm', null,
      'pricePerKg', (select price_per_kg from public.shipping_route_versions where id = 'bbbbbbbb-1111-1111-1111-111111111111'::uuid),
      'rateCurrency', 'USD',
      'usdToNgnRate', (select usd_to_ngn_rate from public.shipping_route_versions where id = 'bbbbbbbb-1111-1111-1111-111111111111'::uuid)
    )
    when o.route = 'sea' then jsonb_build_object(
      'formulaKind', 'per_cbm',
      'measurementBasis', 'volume_cbm',
      'mode', 'sea',
      'pricePerCbm', (select price_per_cbm from public.shipping_route_versions where id = 'bbbbbbbb-2222-2222-2222-222222222222'::uuid),
      'pricePerKg', null,
      'rateCurrency', 'NGN',
      'usdToNgnRate', null
    )
    else null
  end,
  coalesce(o.shipping_cost_ngn, o.logistics_total_ngn)
from public.orders o
where coalesce(o.shipping_cost_ngn, o.logistics_total_ngn, 0) > 0
  and not exists (
    select 1
    from public.order_shipments os
    where os.order_id = o.id
  );

insert into public.shipping_payments (
  id,
  order_id,
  shipment_id,
  amount_ngn,
  provider,
  payment_reference,
  status,
  paid_at
)
select
  gen_random_uuid(),
  o.id,
  os.id,
  coalesce(o.shipping_cost_ngn, o.logistics_total_ngn, 0),
  'paystack',
  case
    when o.shipping_payment_state::text = 'paid' then concat('legacy-shipping-', o.id)
    else null
  end,
  case
    when o.shipping_payment_state::text = 'paid' then 'paid'::public.payment_status
    when o.shipping_payment_state::text = 'failed' then 'failed'::public.payment_status
    else 'pending'::public.payment_status
  end,
  case
    when o.shipping_payment_state::text = 'paid' then coalesce(o.payment_verified_at, o.updated_at, o.created_at)
    else null
  end
from public.orders o
join public.order_shipments os on os.order_id = o.id
where coalesce(o.shipping_cost_ngn, o.logistics_total_ngn, 0) > 0
  and not exists (
    select 1
    from public.shipping_payments sp
    where sp.order_id = o.id
  );

alter table public.order_shipments enable row level security;
alter table public.product_payments enable row level security;
alter table public.shipping_payments enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'order_shipments' and policyname = 'order_shipments_select_own'
  ) then
    create policy "order_shipments_select_own" on public.order_shipments
      for select using (
        exists (
          select 1
          from public.orders
          where public.orders.id = public.order_shipments.order_id
            and public.orders.user_id = auth.uid()
        )
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_payments' and policyname = 'product_payments_select_own'
  ) then
    create policy "product_payments_select_own" on public.product_payments
      for select using (
        exists (
          select 1
          from public.orders
          where public.orders.id = public.product_payments.order_id
            and public.orders.user_id = auth.uid()
        )
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'shipping_payments' and policyname = 'shipping_payments_select_own'
  ) then
    create policy "shipping_payments_select_own" on public.shipping_payments
      for select using (
        exists (
          select 1
          from public.orders
          where public.orders.id = public.shipping_payments.order_id
            and public.orders.user_id = auth.uid()
        )
      );
  end if;
end $$;
