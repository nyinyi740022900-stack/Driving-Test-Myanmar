import type { SupabaseClient } from '@supabase/supabase-js';
import type { SubscriptionStatus } from './types';

export async function getUserSubscription(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  return data;
}

export async function isPremium(supabase: SupabaseClient, userId: string): Promise<boolean> {
  const sub = await getUserSubscription(supabase, userId);
  if (!sub || sub.status !== 'premium') return false;
  if (!sub.expires_at) return false;
  return new Date(sub.expires_at) > new Date();
}

export async function canRunMockTest(
  supabase: SupabaseClient,
  userId: string,
  category: string
): Promise<boolean> {
  const premium = await isPremium(supabase, userId);
  if (premium) return true;

  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('mock_test_usage')
    .select('id')
    .eq('user_id', userId)
    .eq('category', category)
    .eq('used_date', today)
    .limit(1);

  return !data || data.length === 0;
}

export async function recordMockTestUsage(
  supabase: SupabaseClient,
  userId: string,
  category: string
) {
  const today = new Date().toISOString().split('T')[0];
  await supabase.from('mock_test_usage').upsert(
    { user_id: userId, category, used_date: today },
    { onConflict: 'user_id,category,used_date' }
  );
}

export const PLANS = {
  monthly: { label: 'Monthly Premium', price: 4900, days: 30 },
  yearly: { label: 'Yearly Premium', price: 39000, days: 365 },
} as const;

export type PlanKey = keyof typeof PLANS;
