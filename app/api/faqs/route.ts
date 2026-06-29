import { createServiceClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') ?? 'sg';

  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from('faqs')
      .select('id, country, question_en, question_my, question_ja, answer_en, answer_my, answer_ja, sort_order')
      .eq('country', country)
      .eq('published', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json([]);
  }
}
