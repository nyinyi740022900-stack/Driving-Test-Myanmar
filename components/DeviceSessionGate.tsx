'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import DeviceLimitModal from './DeviceLimitModal';
import type { UserDevice } from '@/lib/types';
import { registerCurrentDevice } from '@/lib/device-sessions';

export default function DeviceSessionGate({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const [blockedDevices, setBlockedDevices] = useState<UserDevice[] | null>(null);

  useEffect(() => {
    if (loading || !user) {
      setBlockedDevices(null);
      return;
    }

    let cancelled = false;
    registerCurrentDevice().then((result) => {
      if (cancelled) return;
      if (result.deviceLimit && result.devices?.length) {
        setBlockedDevices(result.devices);
      } else {
        setBlockedDevices(null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user?.id, loading]);

  if (blockedDevices) {
    return (
      <>
        {children}
        <DeviceLimitModal
          devices={blockedDevices}
          onResolved={() => setBlockedDevices(null)}
          onCancel={() => {
            setBlockedDevices(null);
            void signOut();
          }}
        />
      </>
    );
  }

  return <>{children}</>;
}
