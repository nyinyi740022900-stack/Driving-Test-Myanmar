'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { createClient } from '@/lib/supabase';
import { isPremium } from '@/lib/subscription';

export function usePremiumStatus() {
  const { user, loading: authLoading } = useAuth();
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setIsPremiumUser(false);
      setLoading(false);
      return;
    }
    let cancelled = false;
    isPremium(createClient(), user.id)
      .then((premium) => {
        if (!cancelled) setIsPremiumUser(premium);
      })
      .catch(() => {
        if (!cancelled) setIsPremiumUser(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading]);

  return { isPremiumUser, loading: authLoading || loading };
}
