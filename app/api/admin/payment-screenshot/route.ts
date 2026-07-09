import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase-server';
import { storagePathFromRef } from '@/lib/storage-path';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean);

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const submissionId = req.nextUrl.searchParams.get('submissionId');
  if (!submissionId) {
    return NextResponse.json({ error: 'Missing submissionId' }, { status: 400 });
  }

  const service = await createServiceClient();
  const { data: sub, error } = await service
    .from('payment_submissions')
    .select('screenshot_url')
    .eq('id', submissionId)
    .single();

  if (error || !sub?.screenshot_url) {
    return NextResponse.json({ error: 'Screenshot not found' }, { status: 404 });
  }

  const path = storagePathFromRef(sub.screenshot_url);
  if (!path) {
    return NextResponse.json({ error: 'Invalid screenshot reference' }, { status: 400 });
  }

  const { data: signed, error: signErr } = await service.storage
    .from('payment-screenshots')
    .createSignedUrl(path, 3600);

  if (signErr || !signed?.signedUrl) {
    console.error('[payment-screenshot]', signErr?.message ?? 'signed url failed');
    return NextResponse.json({ error: 'Could not load screenshot' }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl);
}
