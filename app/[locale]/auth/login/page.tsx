import { getTranslations } from 'next-intl/server';
import AuthForm from '@/components/AuthForm';

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirect?: string; reset?: string }>;
}) {
  const { locale } = await params;
  const { redirect, reset } = await searchParams;
  const t = await getTranslations('auth');

  return (
    <div className="auth-page">
      {reset === 'success' && (
        <div
          className="auth-card"
          style={{ marginBottom: 16, background: '#edfaed', borderColor: 'var(--guide)' }}
        >
          <p style={{ margin: 0, fontSize: '.9rem', color: 'var(--guide-deep)', fontFamily: 'var(--display)', fontWeight: 600 }}>
            {t('reset_success_body')}
          </p>
        </div>
      )}
      <AuthForm mode="login" locale={locale} redirectTo={redirect ? decodeURIComponent(redirect) : undefined} />
    </div>
  );
}
