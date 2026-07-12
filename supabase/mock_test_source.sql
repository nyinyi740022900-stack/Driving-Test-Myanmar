-- Add ad-unlock tracking to mock_test_usage (run once on existing projects).
-- Allows 1 free + 1 ad-unlock mock test per category per day.

alter table public.mock_test_usage
  add column if not exists source text not null default 'free'
  check (source in ('free', 'ad_unlock'));

alter table public.mock_test_usage
  drop constraint if exists mock_test_usage_user_id_category_used_date_key;

alter table public.mock_test_usage
  drop constraint if exists mock_test_usage_user_category_date_source_key;

alter table public.mock_test_usage
  add constraint mock_test_usage_user_category_date_source_key
  unique (user_id, category, used_date, source);

-- Storage: restrict uploads to the user's own folder.
drop policy if exists "Auth users upload screenshots" on storage.objects;
create policy "Auth users upload screenshots"
  on storage.objects for insert
  with check (
    bucket_id = 'payment-screenshots'
    and auth.role() = 'authenticated'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
