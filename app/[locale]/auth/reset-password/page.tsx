import ResetPasswordForm from '@/components/ResetPasswordForm';

export default async function ResetPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="auth-page">
      <ResetPasswordForm locale={locale} />
    </div>
  );
}
