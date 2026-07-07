import ForgotPasswordForm from '@/components/ForgotPasswordForm';

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="auth-page">
      <ForgotPasswordForm locale={locale} />
    </div>
  );
}
