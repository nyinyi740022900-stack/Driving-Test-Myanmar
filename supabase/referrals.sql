-- Referral / invite tracking
-- A referral code is the first 8 characters of a user's id. When a new user
-- signs up via someone's invite link, one row is recorded here after they log
-- in for the first time.
--
-- Run this in the Supabase SQL editor.

create table if not exists public.referrals (
  id                uuid primary key default gen_random_uuid(),
  referrer_code     text not null,
  referred_user_id  uuid references auth.users(id) on delete cascade not null unique,
  created_at        timestamptz default now()
);

create index if not exists referrals_referrer_code_idx
  on public.referrals (referrer_code);

alter table public.referrals enable row level security;

-- New user records their own referral row (their id, the inviter's code).
drop policy if exists "Users insert own referral" on public.referrals;
create policy "Users insert own referral"
  on public.referrals for insert
  with check (auth.uid() = referred_user_id);

-- A user can read the row about themselves, or rows crediting their own code.
drop policy if exists "Users read related referrals" on public.referrals;
create policy "Users read related referrals"
  on public.referrals for select
  using (
    referred_user_id = auth.uid()
    or referrer_code = left(auth.uid()::text, 8)
  );

drop policy if exists "Service role full access on referrals" on public.referrals;
create policy "Service role full access on referrals"
  on public.referrals for all
  using (auth.role() = 'service_role');
