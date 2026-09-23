'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { createClient } from '@/lib/supabase';
import { isPremium, isPromoFreeActive } from '@/lib/subscription';

export function usePremiumStatus() {
  const { user, loading: authLoading } = useAuth();
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setIsPremiumUser(false);
      setLoading(false);
      return;
    }
    let cancelled = false;
    const supabase = createClient();
    // Signed-in users: real subscription (isPremium already checks the
    // site-wide free promo first). Signed-out visitors have no user id to
    // check a subscription for, but should still see no ads during the
    // promo, so check it directly.
    const check = user ? isPremium(supabase, user.id) : isPromoFreeActive(supabase);
    check
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
