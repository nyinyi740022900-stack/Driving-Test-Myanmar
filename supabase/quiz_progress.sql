-- Quiz progress cloud sync
-- Stores each completed mock-test result so a signed-in user's history and
-- best scores follow them across devices. Guests keep using localStorage only.
--
-- Run this in the Supabase SQL editor.

create table if not exists public.quiz_progress (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  category    text not null,
  score       int not null,
  total       int not null,
  passed      boolean not null default false,
  created_at  timestamptz default now()
);

create index if not exists quiz_progress_user_category_idx
  on public.quiz_progress (user_id, category);

alter table public.quiz_progress enable row level security;

drop policy if exists "Users read own progress" on public.quiz_progress;
create policy "Users read own progress"
  on public.quiz_progress for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert own progress" on public.quiz_progress;
create policy "Users insert own progress"
  on public.quiz_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "Service role full access on quiz_progress" on public.quiz_progress;
create policy "Service role full access on quiz_progress"
  on public.quiz_progress for all
  using (auth.role() = 'service_role');
