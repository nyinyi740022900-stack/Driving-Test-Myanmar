import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getPublicAppSettings } from '@/lib/app-settings';
import { PLANS, type PlanKey } from '@/lib/subscription';

const VALID_PLANS: PlanKey[] = ['monthly', 'yearly'];
const VALID_WALLETS = ['KBZPay', 'WavePay'] as const;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: {
    plan?: string;
    wallet?: string;
    transaction_id?: string;
    screenshot_url?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const plan = body.plan as PlanKey;
  if (!plan || !VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const wallet = body.wallet;
  if (!wallet || !VALID_WALLETS.includes(wallet as (typeof VALID_WALLETS)[number])) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 });
  }

  const txnDigits = (body.transaction_id ?? '').replace(/\D/g, '');
  if (txnDigits.length !== 6) {
    return NextResponse.json({ error: 'Invalid transaction id' }, { status: 400 });
  }

  const screenshotUrl = body.screenshot_url?.trim() || null;
  if (screenshotUrl && !screenshotUrl.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: 'Invalid screenshot path' }, { status: 400 });
  }

  const settings = await getPublicAppSettings();
  const expectedAmount =
    plan === 'monthly' ? settings.monthlyPrice : settings.yearlyPrice;

  const { data: duplicate } = await supabase
    .from('payment_submissions')
    .select('id')
    .eq('transaction_id', txnDigits)
    .eq('status', 'pending')
    .limit(1);

  if (duplicate?.length) {
    return NextResponse.json({ error: 'Duplicate transaction' }, { status: 409 });
  }

  const { error } = await supabase.from('payment_submissions').insert({
    user_id: user.id,
    plan,
    amount: expectedAmount,
    wallet,
    transaction_id: txnDigits,
    screenshot_url: screenshotUrl,
    status: 'pending',
  });

  if (error) {
    console.error('[payment/submit]', error.message);
    return NextResponse.json({ error: 'Insert failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, amount: expectedAmount });
}
