import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Supabase env vars not configured. Copy .env.local.example to .env.local and fill in your project credentials.');
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Types re-exported from lib/types.ts — import from there directly.
export type { SubscriptionStatus, Subscription, PaymentSubmission } from './types';
