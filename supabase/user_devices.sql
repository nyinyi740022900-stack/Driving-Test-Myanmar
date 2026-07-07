-- ══════════════════════════════════════════════════════════════════
-- user_devices — max 2 concurrent devices per account
-- Run in Supabase SQL editor after schema.sql
-- ══════════════════════════════════════════════════════════════════

create table if not exists public.user_devices (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  device_id     text not null,
  device_label  text not null default 'Unknown device',
  user_agent    text,
  last_seen_at  timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  unique (user_id, device_id)
);

create index if not exists user_devices_user_id_idx on public.user_devices (user_id);

alter table public.user_devices enable row level security;

drop policy if exists "Users read own devices" on public.user_devices;
create policy "Users read own devices"
  on public.user_devices for select
  using (auth.uid() = user_id);

drop policy if exists "Service role full access on user_devices" on public.user_devices;
create policy "Service role full access on user_devices"
  on public.user_devices for all
  using (auth.role() = 'service_role');


-- ── mock_test_usage RLS hardening (prevent DELETE bypass) ─────────
drop policy if exists "Users manage own usage" on public.mock_test_usage;

drop policy if exists "Users read own usage" on public.mock_test_usage;
create policy "Users read own usage"
  on public.mock_test_usage for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own usage" on public.mock_test_usage;
create policy "Users insert own usage"
  on public.mock_test_usage for insert
  with check (auth.uid() = user_id);
