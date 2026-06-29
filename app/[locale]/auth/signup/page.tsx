import AuthForm from '@/components/AuthForm';

export default async function SignupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="auth-page">
      <AuthForm mode="signup" locale={locale} />
    </div>
  );
}
