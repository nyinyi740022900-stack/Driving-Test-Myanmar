-- ══════════════════════════════════════════════════════════════════
-- RoadReady — Full Schema
-- Paste this entire file into:
-- https://supabase.com/dashboard/project/mymxufmvdxgyjuwuibwq/sql/new
-- Then click RUN ▶
-- ══════════════════════════════════════════════════════════════════


-- ── subscriptions ──────────────────────────────────────────────────
create table if not exists public.subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null unique,
  status      text not null default 'free' check (status in ('free','premium')),
  expires_at  timestamptz,
  created_at  timestamptz default now()
);
alter table public.subscriptions enable row level security;

drop policy if exists "Users read own subscription" on public.subscriptions;
create policy "Users read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

drop policy if exists "Service role full access on subscriptions" on public.subscriptions;
create policy "Service role full access on subscriptions"
  on public.subscriptions for all
  using (auth.role() = 'service_role');


-- ── payment_submissions ────────────────────────────────────────────
create table if not exists public.payment_submissions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  plan            text not null check (plan in ('monthly','yearly')),
  amount          integer not null,
  wallet          text not null check (wallet in ('KBZPay','WavePay')),
  transaction_id  text not null,
  screenshot_url  text,
  status          text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by     uuid references auth.users(id),
  reviewed_at     timestamptz,
  notes           text,
  created_at      timestamptz default now()
);
alter table public.payment_submissions enable row level security;

drop policy if exists "Users insert own submission" on public.payment_submissions;
create policy "Users insert own submission"
  on public.payment_submissions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users read own submission" on public.payment_submissions;
create policy "Users read own submission"
  on public.payment_submissions for select
  using (auth.uid() = user_id);

drop policy if exists "Service role full access on payments" on public.payment_submissions;
create policy "Service role full access on payments"
  on public.payment_submissions for all
  using (auth.role() = 'service_role');


-- ── mock_test_usage ────────────────────────────────────────────────
create table if not exists public.mock_test_usage (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  category    text not null,
  used_date   date not null default current_date,
  created_at  timestamptz default now(),
  unique(user_id, category, used_date)
);
alter table public.mock_test_usage enable row level security;

drop policy if exists "Users manage own usage" on public.mock_test_usage;
create policy "Users manage own usage"
  on public.mock_test_usage for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── Storage RLS policies ───────────────────────────────────────────
-- (bucket "payment-screenshots" already created via API)

drop policy if exists "Auth users upload screenshots" on storage.objects;
create policy "Auth users upload screenshots"
  on storage.objects for insert
  with check (
    bucket_id = 'payment-screenshots'
    and auth.role() = 'authenticated'
  );

drop policy if exists "Users read own screenshots" on storage.objects;
create policy "Users read own screenshots"
  on storage.objects for select
  using (
    bucket_id = 'payment-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Service role read all screenshots" on storage.objects;
create policy "Service role read all screenshots"
  on storage.objects for select
  using (
    bucket_id = 'payment-screenshots'
    and auth.role() = 'service_role'
  );


-- ── app_settings ──────────────────────────────────────────────────
create table if not exists public.app_settings (
  key         text primary key,
  value       text not null default '',
  label       text,
  updated_at  timestamptz default now()
);
alter table public.app_settings enable row level security;

drop policy if exists "Anyone can read app_settings" on public.app_settings;
create policy "Anyone can read app_settings"
  on public.app_settings for select
  using (true);

drop policy if exists "Service role full access on app_settings" on public.app_settings;
create policy "Service role full access on app_settings"
  on public.app_settings for all
  using (auth.role() = 'service_role');

insert into public.app_settings (key, value, label) values
  ('kbzpay_number',  '09740022900', 'KBZPay Number'),
  ('wavepay_number', '09740022900', 'WavePay Number'),
  ('monthly_price',  '4900',        'Monthly Price (Ks)'),
  ('yearly_price',   '39000',       'Yearly Price (Ks)'),
  ('announcement',   '',            'Announcement Banner (leave empty to hide)')
on conflict (key) do nothing;


-- ── faqs ───────────────────────────────────────────────────────────
create table if not exists public.faqs (
  id           uuid primary key default gen_random_uuid(),
  country      text not null check (country in ('sg', 'jp')),
  question_en  text not null default '',
  question_my  text not null default '',
  question_ja  text not null default '',
  answer_en    text not null default '',
  answer_my    text not null default '',
  answer_ja    text not null default '',
  sort_order   int default 0,
  published    boolean default true,
  created_at   timestamptz default now()
);
alter table public.faqs enable row level security;

drop policy if exists "Anyone can read published faqs" on public.faqs;
create policy "Anyone can read published faqs"
  on public.faqs for select
  using (published = true);

drop policy if exists "Service role full access on faqs" on public.faqs;
create policy "Service role full access on faqs"
  on public.faqs for all
  using (auth.role() = 'service_role');


-- ── faqs seed data ────────────────────────────────────────────────
insert into public.faqs (country, question_en, question_my, question_ja, answer_en, answer_my, answer_ja, sort_order) values
  ('sg', 'How many times can I retake the BTT/FTT/RTT?',
   'BTT/FTT/RTT ကို ဘယ်နှစ်ကြိမ် ပြန်ဖြေနိုင်သလဲ။',
   'BTT/FTT/RTTは何回でも再受験できますか？',
   'There is no limit on retakes. You pay the fee each time and can rebook after 3 days.',
   'ပြန်ဖြေနိုင်သည့် အကြိမ်ကန့်သတ်မရှိ။ တစ်ကြိမ်တိုင်း ကြေးပေးရပြီး ၃ ရက်နောက်မှ ပြန်မှာနိုင်သည်။',
   '再受験の回数制限はありません。毎回費用がかかり、3日後から再予約できます。',
   1),
  ('sg', 'Can I book the FTT before completing all practical lessons?',
   'လက်တွေ့သင်ခန်းအားလုံး မပြီးမီ FTT မှာနိုင်သလား။',
   '全ての技能教習が終わる前にFTTを予約できますか？',
   'You must have completed at least 5 practical lessons (Class 3/3A) before booking the FTT.',
   'FTT မှာမည့်အချိန် Class 3/3A အတွက် လက်တွေ့သင်ခန်း အနည်းဆုံး ၅ ခု ပြီးဆုံးရမည်။',
   'FTTを予約するには、Class 3/3Aの技能教習を最低5時限修了している必要があります。',
   2),
  ('sg', 'How long is a Singapore licence valid?',
   'Singapore လိုင်စင် သက်တမ်း ဘယ်လောက်ကြာသလဲ။',
   'シンガポールの免許証の有効期間は？',
   'A full Class 3/3A licence is valid for 10 years and can be renewed online via OneMotoring.',
   'Class 3/3A လိုင်စင် ၁၀ နှစ် သက်တမ်းရှိပြီး OneMotoring မှ အွန်လိုင်းဖြင့် သက်တမ်းတိုးနိုင်သည်။',
   '普通免許（Class 3/3A）は10年間有効で、OneMotoringでオンライン更新できます。',
   3),
  ('sg', 'What happens if I accumulate 24 demerit points?',
   'demerit point ၂၄ ရောက်ရင် ဘာဖြစ်မလဲ။',
   '違反点数が24点になったらどうなりますか？',
   'Your licence is suspended for 3 months. A new driver (within 1 year of passing) is suspended at 12 points.',
   'လိုင်စင် ၃ လ ဆိုင်းငံ့ခြင်းခံရမည်။ ဝင်ခါစ (အောင်ပြီး ၁ နှစ်အတွင်း) ဆိုရင် ၁၂ မှတ်မှာ ဆိုင်းငံ့ခြင်းခံရသည်။',
   '免許が3か月停止されます。新規ドライバー（合格後1年以内）は12点で停止です。',
   4),
  ('jp', '本免許学科試験に落ちたらどうなる？',
   'ပင်မ လိုင်စင် သီအိုရီ စာမေးပွဲ မအောင်ရင် ဘာဖြစ်မလဲ？',
   '本免許学科試験に落ちたらどうなる？',
   'You can retake the exam. Fees apply each attempt and the next sitting can be booked from the following day.',
   'ပြန်ဖြေနိုင်သည်။ တစ်ကြိမ်တိုင်း ကြေးပေးရပြီး နောက်ရက်မှ ပြန်မှာနိုင်သည်။',
   '再受験できます。費用は毎回かかります。翌日以降から再受験の予約が可能です。',
   1),
  ('jp', 'Do I need to take the practical test if I graduated from a 指定校?',
   '指定校 ပြီးဆုံးပါက လက်တွေ့ စာမေးပွဲ ဖြေဆိုရသလား？',
   '指定校を卒業した場合、実技試験は免除されますか？',
   'Yes. Graduating from a 公安委員会指定 school exempts you from the practical test at the licence centre. You only need to pass the written 本免許学科試験.',
   'ဟုတ်ပါတယ်။ 公安委員会指定 ကျောင်းပြီးဆုံးပါက လိုင်စင်စင်တာတွင် လက်တွေ့ မဖြေရ — 本免許学科試験 (စာဖြေ) တစ်ခုသာ ဖြေရသည်။',
   'はい。公安委員会指定の学校を卒業すると、免許センターでの技能試験が免除されます。学科試験のみ受験すれば取得できます。',
   2),
  ('jp', 'What is the pass mark for the 本免許学科試験?',
   '本免許学科試験 ၏ အောင်မှတ် ဘယ်လောက်လဲ？',
   '本免許学科試験の合格点は？',
   '95 questions, pass mark is 90 points (about 90%). Motorcycle test is also 95 questions at 90 points.',
   'မေးခွန်း ၉၅ ပုဒ်၊ အောင်မှတ် ၉၀ မှတ် (ခန့်မှန်း ၉၀%)။ ဆိုင်ကယ်စစ်မေးပွဲသည်လည်း ၉၅ ပုဒ် ၉၀ မှတ်ဖြစ်သည်။',
   '95問で合格点は90点（約90%）。二輪試験も同じく95問で90点です。',
   3)
on conflict do nothing;


-- ── member_reviews ─────────────────────────────────────────────────
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


-- ── Done ───────────────────────────────────────────────────────────
-- Verify: should return 6 rows
select table_name from information_schema.tables
where table_schema = 'public'
  and table_name in ('subscriptions','payment_submissions','mock_test_usage','app_settings','faqs','member_reviews')
order by table_name;
