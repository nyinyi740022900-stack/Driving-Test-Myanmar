-- ── video_tutorials ─────────────────────────────────────────────────
-- YouTube tutorial links managed from the admin dashboard (Content tab)
-- and shown to users at /resources/tutorials.
-- Run this once in the Supabase SQL editor.

create table if not exists public.video_tutorials (
  id              uuid primary key default gen_random_uuid(),
  country         text not null check (country in ('sg', 'jp')),
  title_en        text not null default '',
  title_my        text not null default '',
  title_ja        text not null default '',
  description_en  text not null default '',
  description_my  text not null default '',
  description_ja  text not null default '',
  youtube_url     text not null,
  sort_order      int default 0,
  published       boolean default true,
  created_at      timestamptz default now()
);

alter table public.video_tutorials enable row level security;

drop policy if exists "Anyone can read published video tutorials" on public.video_tutorials;
create policy "Anyone can read published video tutorials"
  on public.video_tutorials for select
  using (published = true);

drop policy if exists "Service role full access on video tutorials" on public.video_tutorials;
create policy "Service role full access on video tutorials"
  on public.video_tutorials for all
  using (auth.role() = 'service_role');
