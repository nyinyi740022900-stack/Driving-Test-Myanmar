'use client';

import { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { createClient } from '@/lib/supabase';
import { capturePendingReferral, redeemPendingReferral } from '@/lib/referral';

/** Captures ?ref= codes from the URL and redeems them once a user is signed in. */
export default function ReferralRedeemer() {
  const { user } = useAuth();

  useEffect(() => {
    capturePendingReferral();
  }, []);

  useEffect(() => {
    if (!user || !process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    void redeemPendingReferral(createClient(), user.id);
  }, [user]);

  return null;
}
