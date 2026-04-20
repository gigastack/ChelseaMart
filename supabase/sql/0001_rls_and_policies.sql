alter table public.profiles enable row level security;
alter table public.consignees enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_events enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_select_own'
  ) then
    create policy "profiles_select_own" on public.profiles
      for select using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles' and policyname = 'profiles_update_own'
  ) then
    create policy "profiles_update_own" on public.profiles
      for update using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'consignees' and policyname = 'consignees_select_own'
  ) then
    create policy "consignees_select_own" on public.consignees
      for select using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'consignees' and policyname = 'consignees_insert_own'
  ) then
    create policy "consignees_insert_own" on public.consignees
      for insert with check (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'consignees' and policyname = 'consignees_update_own'
  ) then
    create policy "consignees_update_own" on public.consignees
      for update using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'consignees' and policyname = 'consignees_delete_own'
  ) then
    create policy "consignees_delete_own" on public.consignees
      for delete using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'orders' and policyname = 'orders_select_own'
  ) then
    create policy "orders_select_own" on public.orders
      for select using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'order_items' and policyname = 'order_items_select_own'
  ) then
    create policy "order_items_select_own" on public.order_items
      for select using (
        exists (
          select 1
          from public.orders
          where public.orders.id = public.order_items.order_id
            and public.orders.user_id = auth.uid()
        )
      );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'order_status_events' and policyname = 'order_status_events_select_own'
  ) then
    create policy "order_status_events_select_own" on public.order_status_events
      for select using (
        exists (
          select 1
          from public.orders
          where public.orders.id = public.order_status_events.order_id
            and public.orders.user_id = auth.uid()
        )
      );
  end if;
end $$;
