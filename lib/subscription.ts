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

export type MockTestSource = 'free' | 'ad_unlock';

function todayUtc(): string {
  return new Date().toISOString().split('T')[0]!;
}

async function hasUsageToday(
  supabase: SupabaseClient,
  userId: string,
  category: string,
  source: MockTestSource,
): Promise<boolean> {
  const { data, error } = await supabase
    .from('mock_test_usage')
    .select('id')
    .eq('user_id', userId)
    .eq('category', category)
    .eq('used_date', todayUtc())
    .eq('source', source)
    .limit(1);

  if (error) {
    console.error('[hasUsageToday]', error.message);
    return true;
  }
  return (data?.length ?? 0) > 0;
}

export async function canRunMockTest(
  supabase: SupabaseClient,
  userId: string,
  category: string,
  source: MockTestSource = 'free',
): Promise<boolean> {
  const premium = await isPremium(supabase, userId);
  if (premium) return true;

  if (source === 'free') {
    return !(await hasUsageToday(supabase, userId, category, 'free'));
  }

  const freeUsed = await hasUsageToday(supabase, userId, category, 'free');
  if (!freeUsed) return false;
  return !(await hasUsageToday(supabase, userId, category, 'ad_unlock'));
}

export async function recordMockTestUsage(
  supabase: SupabaseClient,
  userId: string,
  category: string,
  source: MockTestSource = 'free',
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from('mock_test_usage').insert({
    user_id: userId,
    category,
    used_date: todayUtc(),
    source,
  });

  if (error) {
    console.error('[recordMockTestUsage]', error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export const PLANS = {
  monthly: { label: 'Monthly Premium', price: 4900, days: 30 },
  yearly: { label: 'Yearly Premium', price: 39000, days: 365 },
} as const;

export type PlanKey = keyof typeof PLANS;

export function getPlans(pricing?: { monthlyPrice?: number; yearlyPrice?: number }) {
  return {
    monthly: {
      ...PLANS.monthly,
      price: pricing?.monthlyPrice ?? PLANS.monthly.price,
    },
    yearly: {
      ...PLANS.yearly,
      price: pricing?.yearlyPrice ?? PLANS.yearly.price,
    },
  } as const;
}
