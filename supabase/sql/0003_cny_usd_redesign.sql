create table if not exists public.app_settings (
  id text primary key,
  default_moq integer not null default 1 check (default_moq > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.app_settings (id, default_moq)
values ('singleton', 1)
on conflict (id) do nothing;

alter table public.products
  add column if not exists moq_override integer check (moq_override is null or moq_override > 0),
  add column if not exists base_price_cny numeric(18,2),
  add column if not exists sell_price_cny numeric(18,2);

with cny_rate as (
  select coalesce(
    (
      select rate
      from public.currency_pairs
      where base_currency = 'CNY' and quote_currency = 'NGN'
      order by is_active desc, updated_at desc
      limit 1
    ),
    1
  )::numeric as rate
)
update public.products p
set
  moq_override = coalesce(p.moq_override, p.moq),
  base_price_cny = case
    when coalesce(p.base_price_cny, 0) > 0 then p.base_price_cny
    when exists (
      select 1
      from public.product_sources ps
      where ps.product_id = p.id
        and ps.source_currency = 'CNY'
        and ps.source_price is not null
    ) then (
      select ps.source_price
      from public.product_sources ps
      where ps.product_id = p.id
        and ps.source_currency = 'CNY'
        and ps.source_price is not null
      order by ps.last_synced_at desc nulls last, ps.created_at desc
      limit 1
    )
    when cny_rate.rate > 0 then round(coalesce(p.base_price_ngn, 0) / cny_rate.rate, 2)
    else 0
  end,
  sell_price_cny = case
    when coalesce(p.sell_price_cny, 0) > 0 then p.sell_price_cny
    when cny_rate.rate > 0 then round(coalesce(p.sell_price_ngn, 0) / cny_rate.rate, 2)
    else 0
  end
from cny_rate;

alter table public.shipping_route_versions
  alter column rate_currency set default 'USD';

with usd_rate as (
  select coalesce(
    (
      select rate
      from public.currency_pairs
      where base_currency = 'USD' and quote_currency = 'NGN'
      order by is_active desc, updated_at desc
      limit 1
    ),
    1
  )::numeric as rate
)
update public.shipping_route_versions srv
set
  price_per_cbm = case
    when srv.price_per_cbm is null then null
    when coalesce(srv.rate_currency, 'USD') = 'USD' then srv.price_per_cbm
    when usd_rate.rate > 0 then round(srv.price_per_cbm / usd_rate.rate, 2)
    else srv.price_per_cbm
  end,
  price_per_kg = case
    when srv.price_per_kg is null then null
    when coalesce(srv.rate_currency, 'USD') = 'USD' then srv.price_per_kg
    when usd_rate.rate > 0 then round(srv.price_per_kg / usd_rate.rate, 2)
    else srv.price_per_kg
  end,
  rate_currency = 'USD',
  usd_to_ngn_rate = usd_rate.rate
from usd_rate;

alter table public.orders
  add column if not exists product_subtotal_cny numeric(18,2),
  add column if not exists product_payment_cny_to_ngn_rate numeric(18,6);

with cny_rate as (
  select coalesce(
    (
      select rate
      from public.currency_pairs
      where base_currency = 'CNY' and quote_currency = 'NGN'
      order by is_active desc, updated_at desc
      limit 1
    ),
    1
  )::numeric as rate
)
update public.orders o
set
  product_payment_cny_to_ngn_rate = coalesce(o.product_payment_cny_to_ngn_rate, cny_rate.rate),
  product_subtotal_cny = case
    when coalesce(o.product_subtotal_cny, 0) > 0 then o.product_subtotal_cny
    when cny_rate.rate > 0 then round(coalesce(o.product_subtotal_ngn, 0) / cny_rate.rate, 2)
    else 0
  end
from cny_rate;

alter table public.order_items
  add column if not exists effective_moq_snapshot integer,
  add column if not exists product_unit_price_cny_snapshot numeric(18,2),
  add column if not exists line_total_cny_snapshot numeric(18,2);

with cny_rate as (
  select coalesce(
    (
      select rate
      from public.currency_pairs
      where base_currency = 'CNY' and quote_currency = 'NGN'
      order by is_active desc, updated_at desc
      limit 1
    ),
    1
  )::numeric as rate
)
update public.order_items oi
set
  effective_moq_snapshot = coalesce(oi.effective_moq_snapshot, oi.moq_snapshot, 1),
  product_unit_price_cny_snapshot = case
    when coalesce(oi.product_unit_price_cny_snapshot, 0) > 0 then oi.product_unit_price_cny_snapshot
    when cny_rate.rate > 0 then round(coalesce(oi.product_unit_price_ngn_snapshot, 0) / cny_rate.rate, 2)
    else 0
  end,
  line_total_cny_snapshot = case
    when coalesce(oi.line_total_cny_snapshot, 0) > 0 then oi.line_total_cny_snapshot
    when cny_rate.rate > 0 then round(coalesce(oi.line_total_ngn_snapshot, 0) / cny_rate.rate, 2)
    else 0
  end
from cny_rate;

alter table public.order_shipments
  add column if not exists shipping_cost_usd numeric(18,2);

with usd_rate as (
  select coalesce(
    (
      select rate
      from public.currency_pairs
      where base_currency = 'USD' and quote_currency = 'NGN'
      order by is_active desc, updated_at desc
      limit 1
    ),
    1
  )::numeric as rate
)
update public.order_shipments os
set
  shipping_cost_usd = case
    when coalesce(os.shipping_cost_usd, 0) > 0 then os.shipping_cost_usd
    when coalesce(os.shipping_cost_ngn, 0) > 0 and usd_rate.rate > 0 then round(os.shipping_cost_ngn / usd_rate.rate, 2)
    else null
  end
from usd_rate;
