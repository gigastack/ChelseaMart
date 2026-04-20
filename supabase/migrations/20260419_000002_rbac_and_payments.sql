create type public.profile_role as enum ('customer', 'admin');
create type public.payment_status as enum ('pending', 'paid', 'failed');
create type public.elim_platform as enum ('alibaba', 'taobao');

create table if not exists public.profiles (
  user_id uuid primary key,
  email text,
  full_name text,
  role public.profile_role not null default 'customer',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.product_sources
  add column if not exists source_platform public.elim_platform not null default 'alibaba';

alter table public.import_job_items
  add column if not exists source_platform public.elim_platform;

alter table public.orders
  add column if not exists payment_status public.payment_status not null default 'pending',
  add column if not exists paystack_authorization_url text,
  add column if not exists payment_verified_at timestamptz;

create table if not exists public.paystack_events (
  id uuid primary key default gen_random_uuid(),
  dedupe_key text not null unique,
  event_type text not null,
  order_id uuid references public.orders(id) on delete set null,
  payment_reference text,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz not null default timezone('utc', now())
);

alter table public.profiles enable row level security;
alter table public.consignees enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_events enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = user_id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "consignees_select_own" on public.consignees
  for select using (auth.uid() = user_id);

create policy "consignees_insert_own" on public.consignees
  for insert with check (auth.uid() = user_id);

create policy "consignees_update_own" on public.consignees
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "consignees_delete_own" on public.consignees
  for delete using (auth.uid() = user_id);

create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);

create policy "order_items_select_own" on public.order_items
  for select using (
    exists (
      select 1
      from public.orders
      where public.orders.id = public.order_items.order_id
        and public.orders.user_id = auth.uid()
    )
  );

create policy "order_status_events_select_own" on public.order_status_events
  for select using (
    exists (
      select 1
      from public.orders
      where public.orders.id = public.order_status_events.order_id
        and public.orders.user_id = auth.uid()
    )
  );
