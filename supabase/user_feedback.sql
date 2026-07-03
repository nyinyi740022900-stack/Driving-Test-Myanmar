-- ══════════════════════════════════════════════════════════════════
-- user_feedback — bug reports, difficulties, and general feedback
-- Run in Supabase SQL editor after main schema.sql
-- ══════════════════════════════════════════════════════════════════

create table if not exists public.user_feedback (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete set null,
  country       text check (country in ('sg', 'jp')),
  locale        text check (locale in ('en', 'my', 'ja')),
  type          text not null check (type in ('bug', 'difficulty', 'feedback', 'other')),
  area          text not null default 'other' check (area in ('quiz', 'account', 'payment', 'content', 'ui', 'other')),
  subject       text not null,
  body          text not null,
  page_url      text,
  contact_email text,
  status        text not null default 'pending' check (status in ('pending', 'reviewing', 'resolved', 'dismissed')),
  priority      text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  admin_notes   text,
  reviewed_by   uuid references auth.users(id),
  reviewed_at   timestamptz,
  created_at    timestamptz default now()
);

create index if not exists user_feedback_status_idx on public.user_feedback (status, created_at desc);
create index if not exists user_feedback_user_idx on public.user_feedback (user_id, created_at desc);

alter table public.user_feedback enable row level security;

drop policy if exists "Anyone can submit feedback" on public.user_feedback;
create policy "Anyone can submit feedback"
  on public.user_feedback for insert
  with check (user_id is null or auth.uid() = user_id);

drop policy if exists "Users read own feedback" on public.user_feedback;
create policy "Users read own feedback"
  on public.user_feedback for select
  using (auth.uid() = user_id);

drop policy if exists "Service role full access on user_feedback" on public.user_feedback;
create policy "Service role full access on user_feedback"
  on public.user_feedback for all
  using (auth.role() = 'service_role');
