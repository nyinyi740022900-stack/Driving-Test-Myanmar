import { createServiceClient } from '@/lib/supabase-server';

export interface PublicReview {
  id: string;
  country: string;
  category: string;
  display_name: string;
  title: string;
  body: string;
  rating: number;
  passed: boolean | null;
  created_at: string;
}

export interface PublishedFaq {
  id: string;
  country: string;
  question_en: string;
  question_my: string;
  question_ja: string;
  answer_en: string;
  answer_my: string;
  answer_ja: string;
}

export async function getApprovedReviews(): Promise<PublicReview[]> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from('member_reviews')
      .select('id, country, category, display_name, title, body, rating, passed, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[getApprovedReviews]', error.message);
      return [];
    }
    return (data ?? []) as PublicReview[];
  } catch (err) {
    console.error('[getApprovedReviews]', err instanceof Error ? err.message : 'unknown');
    return [];
  }
}

export async function getPublishedFaqs(): Promise<PublishedFaq[]> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from('faqs')
      .select(
        'id, country, question_en, question_my, question_ja, answer_en, answer_my, answer_ja, sort_order',
      )
      .eq('published', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('[getPublishedFaqs]', error.message);
      return [];
    }
    return (data ?? []) as PublishedFaq[];
  } catch (err) {
    console.error('[getPublishedFaqs]', err instanceof Error ? err.message : 'unknown');
    return [];
  }
}
