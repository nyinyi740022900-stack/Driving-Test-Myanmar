import AuthForm from '@/components/AuthForm';

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { locale } = await params;
  const { redirect } = await searchParams;

  return (
    <div className="auth-page">
      <AuthForm mode="login" locale={locale} redirectTo={redirect ? decodeURIComponent(redirect) : undefined} />
    </div>
  );
}
