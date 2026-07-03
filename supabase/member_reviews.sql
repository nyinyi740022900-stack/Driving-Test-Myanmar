-- ══════════════════════════════════════════════════════════════════
-- member_reviews — premium member experiences (admin-approved)
-- Run in Supabase SQL editor after main schema.sql
-- ══════════════════════════════════════════════════════════════════

create table if not exists public.member_reviews (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  country       text not null check (country in ('sg', 'jp')),
  category      text not null check (category in ('sg_btt','sg_ftt','sg_rtt','jp_car','jp_moto','general')),
  display_name  text not null default 'Member',
  title         text not null,
  body          text not null,
  rating        integer not null check (rating >= 1 and rating <= 5),
  passed        boolean,
  status        text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by   uuid references auth.users(id),
  reviewed_at   timestamptz,
  admin_notes   text,
  created_at    timestamptz default now(),
  unique (user_id, category)
);

alter table public.member_reviews enable row level security;

drop policy if exists "Anyone reads approved reviews" on public.member_reviews;
create policy "Anyone reads approved reviews"
  on public.member_reviews for select
  using (status = 'approved');

drop policy if exists "Users read own reviews" on public.member_reviews;
create policy "Users read own reviews"
  on public.member_reviews for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own reviews" on public.member_reviews;
create policy "Users insert own reviews"
  on public.member_reviews for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own pending or rejected" on public.member_reviews;
create policy "Users update own pending or rejected"
  on public.member_reviews for update
  using (auth.uid() = user_id and status in ('pending', 'rejected'))
  with check (auth.uid() = user_id and status = 'pending');

drop policy if exists "Service role full access on member_reviews" on public.member_reviews;
create policy "Service role full access on member_reviews"
  on public.member_reviews for all
  using (auth.role() = 'service_role');
