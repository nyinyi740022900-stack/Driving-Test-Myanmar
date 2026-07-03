import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase-server';
import type { Country, FeedbackArea, FeedbackType, Locale } from '@/lib/types';

const VALID_TYPES: FeedbackType[] = ['bug', 'difficulty', 'feedback', 'other'];
const VALID_AREAS: FeedbackArea[] = ['quiz', 'account', 'payment', 'content', 'ui', 'other'];
const VALID_COUNTRIES: Country[] = ['sg', 'jp'];
const VALID_LOCALES: Locale[] = ['en', 'my', 'ja'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('mine') !== '1') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('user_feedback')
      .select('id, type, area, subject, body, status, priority, admin_notes, created_at, reviewed_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[feedback GET mine]', error.message);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await req.json();
    const {
      type,
      area,
      subject,
      body: message,
      page_url,
      country,
      locale,
      contact_email,
    } = body;

    if (!type || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const areaVal: FeedbackArea = VALID_AREAS.includes(area) ? area : 'other';

    if (subject.trim().length > 120 || message.trim().length > 2000) {
      return NextResponse.json({ error: 'Content too long' }, { status: 400 });
    }

    const emailTrim = contact_email?.trim() ?? '';
    if (!user && !emailTrim) {
      return NextResponse.json({ error: 'Email required for guest reports' }, { status: 400 });
    }
    if (emailTrim && !EMAIL_RE.test(emailTrim)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const countryVal = VALID_COUNTRIES.includes(country) ? country : null;
    const localeVal = VALID_LOCALES.includes(locale) ? locale : null;
    const pageUrl = typeof page_url === 'string' && page_url.trim()
      ? page_url.trim().slice(0, 500)
      : null;

    const row = {
      user_id: user?.id ?? null,
      country: countryVal,
      locale: localeVal,
      type,
      area: areaVal,
      subject: subject.trim(),
      body: message.trim(),
      page_url: pageUrl,
      contact_email: user ? null : emailTrim,
      status: 'pending' as const,
      priority: type === 'bug' ? 'high' as const : 'normal' as const,
    };

    const { data, error } = await (await createServiceClient())
      .from('user_feedback')
      .insert(row)
      .select('id, status, created_at')
      .single();

    if (error) {
      console.error('[feedback POST]', error.message);
      return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
