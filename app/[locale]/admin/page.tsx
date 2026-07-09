import { redirect } from 'next/navigation';
import { createClient, createServiceClient } from '@/lib/supabase-server';
import AdminDashboard from './AdminDashboard';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean);
const DEFAULT_MONTHLY_PRICE = 4900;
const DEFAULT_YEARLY_PRICE = 39000;

function numberSetting(settings: { key: string; value: string }[], key: string, fallback: number): number {
  const raw = settings.find((s) => s.key === key)?.value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function stringSetting(settings: { key: string; value: string }[], key: string, fallback = ''): string {
  const raw = settings.find((s) => s.key === key)?.value;
  return typeof raw === 'string' && raw.trim().length > 0 ? raw.trim() : fallback;
}

function ensureSettingRows(
  settings: { key: string; value: string; label: string | null }[],
  fallbacks: {
    monthlyPrice: number;
    yearlyPrice: number;
    kbzpayNumber: string;
    wavepayNumber: string;
    kbzpayName: string;
    wavepayName: string;
  }
) {
  const required = [
    { key: 'announcement', label: 'Announcement Banner (leave empty to hide)', value: '' },
    { key: 'kbzpay_number', label: 'KBZPay Number', value: fallbacks.kbzpayNumber },
    { key: 'kbzpay_name', label: 'KBZPay Account Name', value: fallbacks.kbzpayName },
    { key: 'monthly_price', label: 'Monthly Price (Ks)', value: String(fallbacks.monthlyPrice) },
    { key: 'wavepay_number', label: 'WavePay Number', value: fallbacks.wavepayNumber },
    { key: 'wavepay_name', label: 'WavePay Account Name', value: fallbacks.wavepayName },
    { key: 'yearly_price', label: 'Yearly Price (Ks)', value: String(fallbacks.yearlyPrice) },
  ] as const;

  const map = new Map(settings.map((s) => [s.key, s]));
  for (const row of required) {
    if (!map.has(row.key)) {
      map.set(row.key, { key: row.key, value: row.value, label: row.label });
      continue;
    }
    const current = map.get(row.key)!;
    map.set(row.key, {
      ...current,
      label: current.label ?? row.label ?? null,
    });
  }

  return Array.from(map.values()).map((item) => ({
    key: item.key,
    value: item.value,
    label: item.label ?? null,
  }));
}

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', marginBottom: 12 }}>Supabase not configured</h2>
        <p style={{ color: 'var(--ink-soft)' }}>Add your Supabase credentials to <code>.env.local</code> to use the admin panel.</p>
      </div>
    );
  }

  // Auth check with anon client (session cookie)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email_confirmed_at || !ADMIN_EMAILS.includes(user.email ?? '')) {
    redirect(`/${locale}`);
  }

  // All data fetches use service role (bypasses RLS)
  const service = await createServiceClient();

  const [submissionsRes, usersRes, subscriptionsRes, settingsRes, faqsRes, reviewsRes, feedbackRes, tutorialsRes] = await Promise.all([
    service.from('payment_submissions').select('*').order('created_at', { ascending: false }),
    service.auth.admin.listUsers({ perPage: 200 }),
    service.from('subscriptions').select('*'),
    service.from('app_settings').select('*').order('key'),
    service.from('faqs').select('*').order('country').order('sort_order'),
    service.from('member_reviews').select('*').order('created_at', { ascending: false }),
    service.from('user_feedback').select('*').order('created_at', { ascending: false }),
    service.from('video_tutorials').select('*').order('country').order('sort_order'),
  ]);

  const submissions = submissionsRes.data ?? [];
  const users = usersRes.data?.users ?? [];
  const subscriptions = subscriptionsRes.data ?? [];
  const settingsRaw = settingsRes.data ?? [];
  const settings = ensureSettingRows(settingsRaw, {
    monthlyPrice: DEFAULT_MONTHLY_PRICE,
    yearlyPrice: DEFAULT_YEARLY_PRICE,
    kbzpayNumber: process.env.NEXT_PUBLIC_KBZPAY_NUMBER ?? '',
    wavepayNumber: process.env.NEXT_PUBLIC_WAVEPAY_NUMBER ?? '',
    kbzpayName: process.env.NEXT_PUBLIC_KBZPAY_NAME ?? '',
    wavepayName: process.env.NEXT_PUBLIC_WAVEPAY_NAME ?? '',
  });
  const faqs = faqsRes.data ?? [];
  const reviews = reviewsRes.data ?? [];
  const feedback = feedbackRes.error ? [] : (feedbackRes.data ?? []);
  const tutorials = tutorialsRes.error ? [] : (tutorialsRes.data ?? []);

  // Attach email to each submission
  const userMap = Object.fromEntries(users.map(u => [u.id, u.email ?? '']));
  const submissionsWithEmail = submissions.map(s => ({
    ...s,
    email: userMap[s.user_id] ?? '',
  }));
  const reviewsWithEmail = reviews.map(r => ({
    ...r,
    email: userMap[r.user_id] ?? '',
  }));
  const feedbackWithEmail = feedback.map(f => ({
    ...f,
    email: f.user_id ? (userMap[f.user_id] ?? '') : (f.contact_email ?? ''),
  }));

  // Stats
  const totalRevenue = submissions
    .filter(s => s.status === 'approved')
    .reduce((sum, s) => sum + (s.amount ?? 0), 0);
  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const pendingReviewCount = reviews.filter(r => r.status === 'pending').length;
  const pendingFeedbackCount = feedback.filter(f => f.status === 'pending').length;
  const premiumCount = subscriptions.filter(s => s.status === 'premium' && s.expires_at && new Date(s.expires_at) > new Date()).length;

  const subMap = Object.fromEntries(subscriptions.map(s => [s.user_id, s]));
  const usersWithSub = users.map(u => ({
    id: u.id,
    email: u.email ?? '',
    created_at: u.created_at,
    email_confirmed_at: u.email_confirmed_at ?? null,
    subscription: subMap[u.id] ?? null,
  }));

  return (
    <AdminDashboard
      locale={locale}
      submissions={submissionsWithEmail}
      reviews={reviewsWithEmail}
      feedback={feedbackWithEmail}
      users={usersWithSub}
      stats={{
        totalUsers: users.length,
        premiumUsers: premiumCount,
        pendingPayments: pendingCount,
        pendingReviews: pendingReviewCount,
        pendingFeedback: pendingFeedbackCount,
        totalRevenue,
      }}
      settings={settings}
      faqs={faqs}
      tutorials={tutorials}
      config={{
        kbzpay: stringSetting(settings, 'kbzpay_number', process.env.NEXT_PUBLIC_KBZPAY_NUMBER ?? ''),
        wavepay: stringSetting(settings, 'wavepay_number', process.env.NEXT_PUBLIC_WAVEPAY_NUMBER ?? ''),
        kbzpayName: stringSetting(settings, 'kbzpay_name', process.env.NEXT_PUBLIC_KBZPAY_NAME ?? ''),
        wavepayName: stringSetting(settings, 'wavepay_name', process.env.NEXT_PUBLIC_WAVEPAY_NAME ?? ''),
        monthlyPrice: numberSetting(settings, 'monthly_price', DEFAULT_MONTHLY_PRICE),
        yearlyPrice: numberSetting(settings, 'yearly_price', DEFAULT_YEARLY_PRICE),
        adminEmails: process.env.ADMIN_EMAILS ?? '',
      }}
    />
  );
}
