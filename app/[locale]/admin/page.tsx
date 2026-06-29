import { redirect } from 'next/navigation';
import { createClient, createServiceClient } from '@/lib/supabase-server';
import AdminDashboard from './AdminDashboard';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean);

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

  const [submissionsRes, usersRes, subscriptionsRes, settingsRes, faqsRes] = await Promise.all([
    service.from('payment_submissions').select('*').order('created_at', { ascending: false }),
    service.auth.admin.listUsers({ perPage: 200 }),
    service.from('subscriptions').select('*'),
    service.from('app_settings').select('*').order('key'),
    service.from('faqs').select('*').order('country').order('sort_order'),
  ]);

  const submissions = submissionsRes.data ?? [];
  const users = usersRes.data?.users ?? [];
  const subscriptions = subscriptionsRes.data ?? [];
  const settings = settingsRes.data ?? [];
  const faqs = faqsRes.data ?? [];

  // Attach email to each submission
  const userMap = Object.fromEntries(users.map(u => [u.id, u.email ?? '']));
  const submissionsWithEmail = submissions.map(s => ({
    ...s,
    email: userMap[s.user_id] ?? '',
  }));

  // Stats
  const totalRevenue = submissions
    .filter(s => s.status === 'approved')
    .reduce((sum, s) => sum + (s.amount ?? 0), 0);
  const pendingCount = submissions.filter(s => s.status === 'pending').length;
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
      users={usersWithSub}
      stats={{
        totalUsers: users.length,
        premiumUsers: premiumCount,
        pendingPayments: pendingCount,
        totalRevenue,
      }}
      settings={settings}
      faqs={faqs}
      config={{
        kbzpay: process.env.NEXT_PUBLIC_KBZPAY_NUMBER ?? '',
        wavepay: process.env.NEXT_PUBLIC_WAVEPAY_NUMBER ?? '',
        monthlyPrice: 4900,
        yearlyPrice: 39000,
      }}
    />
  );
}
