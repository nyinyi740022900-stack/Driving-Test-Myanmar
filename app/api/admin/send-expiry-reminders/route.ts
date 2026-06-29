import { createServiceClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean);
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const FROM_EMAIL = process.env.FROM_EMAIL ?? 'noreply@roadready.app';

export async function POST(request: Request) {
  // Verify admin
  const { searchParams } = new URL(request.url);
  const callerEmail = searchParams.get('caller') ?? '';
  if (!ADMIN_EMAILS.includes(callerEmail)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 });
  }

  const supabase = await createServiceClient();

  // Find subscriptions expiring in next 3 days
  const now = new Date();
  const cutoff = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const { data: subs, error } = await supabase
    .from('subscriptions')
    .select('user_id, plan, expires_at')
    .eq('status', 'active')
    .lte('expires_at', cutoff.toISOString())
    .gte('expires_at', now.toISOString());

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!subs?.length) return NextResponse.json({ sent: 0, message: 'No expiring subscriptions found' });

  // Get user emails
  const { data: { users }, error: uErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (uErr) return NextResponse.json({ error: uErr.message }, { status: 500 });

  const userMap = new Map(users.map(u => [u.id, u.email ?? '']));

  let sent = 0;
  const errors: string[] = [];

  for (const sub of subs) {
    const email = userMap.get(sub.user_id);
    if (!email) continue;

    const expiresAt = new Date(sub.expires_at);
    const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const body = {
      from: FROM_EMAIL,
      to: email,
      subject: `Your RoadReady Premium expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
          <h2 style="font-size:22px;font-weight:800;margin-bottom:8px">Your premium is expiring soon 🚗</h2>
          <p style="color:#555;line-height:1.6">
            Your RoadReady <strong>${sub.plan === 'yearly' ? 'Yearly' : 'Monthly'} Premium</strong> expires on
            <strong>${expiresAt.toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            (${daysLeft} day${daysLeft === 1 ? '' : 's'} left).
          </p>
          <p style="color:#555;line-height:1.6">Renew to keep unlimited mock tests, no ads, and quiz history tracking.</p>
          <a href="https://roadready.app/en/premium"
             style="display:inline-block;margin-top:20px;padding:14px 28px;background:#1B9C56;color:#fff;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none">
            Renew Premium →
          </a>
          <p style="margin-top:32px;font-size:12px;color:#aaa">
            You received this because you have an active RoadReady Premium subscription.
          </p>
        </div>
      `,
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) sent++;
    else errors.push(`${email}: ${await res.text()}`);
  }

  return NextResponse.json({ sent, total: subs.length, errors });
}
