import { BRAND_NAME, SITE_URL } from '@/lib/brand';

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const FROM_EMAIL = process.env.FROM_EMAIL ?? 'noreply@theorylane.app';

interface PaymentEmailOptions {
  to: string;
  type: 'approved' | 'rejected';
  planLabel: string;
  expiresAt?: Date;
  notes?: string | null;
}

export async function sendPaymentStatusEmail(
  options: PaymentEmailOptions,
): Promise<{ sent: boolean; error?: string }> {
  const { to, type, planLabel, expiresAt, notes } = options;

  if (!RESEND_API_KEY) {
    return { sent: false, error: 'RESEND_API_KEY not configured' };
  }
  if (!to) {
    return { sent: false, error: 'Missing recipient email' };
  }

  const premiumUrl = `${SITE_URL}/en/premium`;
  const isApproved = type === 'approved';

  const subject = isApproved
    ? `${BRAND_NAME} Premium activated`
    : `${BRAND_NAME} payment could not be approved`;

  const expiryLine =
    isApproved && expiresAt
      ? `<p style="color:#555;line-height:1.6">Your premium is active until <strong>${expiresAt.toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.</p>`
      : '';

  const notesLine =
    !isApproved && notes?.trim()
      ? `<p style="color:#555;line-height:1.6"><strong>Note from our team:</strong> ${escapeHtml(notes.trim())}</p>`
      : '';

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
      <h2 style="font-size:22px;font-weight:800;margin-bottom:8px">
        ${isApproved ? 'Premium activated 🎉' : 'Payment review update'}
      </h2>
      <p style="color:#555;line-height:1.6">
        ${
          isApproved
            ? `Your <strong>${escapeHtml(planLabel)}</strong> payment was approved. Unlimited mock tests and ad-free study are now unlocked.`
            : `We could not approve your <strong>${escapeHtml(planLabel)}</strong> payment submission. If you already paid, double-check your transaction ID and screenshot, then contact us.`
        }
      </p>
      ${expiryLine}
      ${notesLine}
      <a href="${premiumUrl}"
         style="display:inline-block;margin-top:20px;padding:14px 28px;background:#1B9C56;color:#fff;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none">
        ${isApproved ? 'Start practicing →' : 'View premium plans →'}
      </a>
      <p style="margin-top:32px;font-size:12px;color:#aaa">
        You received this because you submitted a payment on ${BRAND_NAME}.
      </p>
    </div>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[sendPaymentStatusEmail]', text);
      return { sent: false, error: 'Email send failed' };
    }

    return { sent: true };
  } catch (err) {
    console.error('[sendPaymentStatusEmail]', err instanceof Error ? err.message : err);
    return { sent: false, error: 'Email send failed' };
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
