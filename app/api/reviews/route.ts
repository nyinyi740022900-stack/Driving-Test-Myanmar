import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase-server';
import { isPremium } from '@/lib/subscription';
import type { ReviewCategory } from '@/lib/types';

const VALID_CATEGORIES: ReviewCategory[] = ['sg_btt', 'sg_ftt', 'sg_rtt', 'jp_car', 'jp_moto', 'general'];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') ?? 'sg';
  const mine = searchParams.get('mine') === '1';

  try {
    const supabase = await createClient();

    if (mine) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

      const { data, error } = await supabase
        .from('member_reviews')
        .select('id, country, category, display_name, title, body, rating, passed, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[reviews GET mine]', error.message);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
      }
      return NextResponse.json(data ?? []);
    }

    const service = await createServiceClient();
    const { data, error } = await service
      .from('member_reviews')
      .select('id, country, category, display_name, title, body, rating, passed, created_at')
      .eq('country', country)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[reviews GET]', error.message);
      return NextResponse.json([]);
    }
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const premium = await isPremium(supabase, user.id);
  if (!premium) {
    return NextResponse.json({ error: 'Premium required' }, { status: 403 });
  }

  const body = await req.json();
  const { country, category, display_name, title, body: reviewBody, rating, passed } = body;

  if (!country || !category || !title?.trim() || !reviewBody?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }
  if (!['sg', 'jp'].includes(country)) {
    return NextResponse.json({ error: 'Invalid country' }, { status: 400 });
  }
  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json({ error: 'Rating must be 1–5' }, { status: 400 });
  }
  if (title.trim().length > 120 || reviewBody.trim().length > 2000) {
    return NextResponse.json({ error: 'Content too long' }, { status: 400 });
  }

  const displayName = (display_name?.trim() || 'Member').slice(0, 40);

  const { data: existing } = await supabase
    .from('member_reviews')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('category', category)
    .maybeSingle();

  if (existing?.status === 'approved') {
    return NextResponse.json({ error: 'Already published for this category' }, { status: 409 });
  }
  if (existing?.status === 'pending') {
    return NextResponse.json({ error: 'Review already pending approval' }, { status: 409 });
  }

  const row = {
    user_id: user.id,
    country,
    category,
    display_name: displayName,
    title: title.trim(),
    body: reviewBody.trim(),
    rating: ratingNum,
    passed: passed === true ? true : passed === false ? false : null,
    status: 'pending' as const,
  };

  let result;
  if (existing?.status === 'rejected') {
    result = await supabase
      .from('member_reviews')
      .update({ ...row, admin_notes: null, reviewed_by: null, reviewed_at: null })
      .eq('id', existing.id)
      .select('id, status, created_at')
      .single();
  } else {
    result = await supabase
      .from('member_reviews')
      .insert(row)
      .select('id, status, created_at')
      .single();
  }

  if (result.error) {
    console.error('[reviews POST]', result.error.message);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }

  return NextResponse.json(result.data);
}
