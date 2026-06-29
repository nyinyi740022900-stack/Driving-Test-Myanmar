'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface TransitionCtx {
  navigate: (url: string) => void;
  fadeSwap: (action: () => void) => void;
  navigateWithSwap: (url: string, action: () => void) => void;
}

const Ctx = createContext<TransitionCtx>({ navigate: () => {}, fadeSwap: () => {}, navigateWithSwap: () => {} });

const FADE_MS = 180;

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const waitingForNav = useRef(false);

  // When pathname changes, new page is rendered → fade overlay out
  useEffect(() => {
    if (!waitingForNav.current) return;
    waitingForNav.current = false;
    // Brief pause so new page content renders fully, then reveal
    const t = setTimeout(() => {
      setOpacity(0);
      setTimeout(() => setVisible(false), FADE_MS);
    }, 30);
    return () => clearTimeout(t);
  }, [pathname]);

  function showOverlay(): Promise<void> {
    return new Promise(resolve => {
      setVisible(true);
      // Two rAF to ensure the element is in DOM before we change opacity
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setOpacity(1);
          setTimeout(resolve, FADE_MS);
        });
      });
    });
  }

  async function navigate(url: string) {
    if (url === window.location.pathname) return;
    await showOverlay();
    waitingForNav.current = true;
    router.push(url, { scroll: false });
    // Safety fallback: if pathname doesn't change within 3s, hide overlay
    setTimeout(() => {
      if (waitingForNav.current) {
        waitingForNav.current = false;
        setOpacity(0);
        setTimeout(() => setVisible(false), FADE_MS);
      }
    }, 3000);
  }

  async function fadeSwap(action: () => void) {
    await showOverlay();
    action();
    // Let React re-render the new content, then hide overlay
    setTimeout(() => {
      setOpacity(0);
      setTimeout(() => setVisible(false), FADE_MS);
    }, 40);
  }

  // For country switch that also needs navigation: one overlay covers both
  async function navigateWithSwap(url: string, action: () => void) {
    if (url === window.location.pathname) { await fadeSwap(action); return; }
    await showOverlay();
    action();            // update state (e.g. setCountry) under the overlay
    waitingForNav.current = true;
    router.push(url, { scroll: false });
    // overlay hides via the pathname useEffect above
    setTimeout(() => {
      if (waitingForNav.current) {
        waitingForNav.current = false;
        setOpacity(0);
        setTimeout(() => setVisible(false), FADE_MS);
      }
    }, 3000);
  }

  return (
    <Ctx.Provider value={{ navigate, fadeSwap, navigateWithSwap }}>
      {children}
      {visible && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--paint)',
            zIndex: 9999,
            pointerEvents: 'none',
            opacity,
            transition: `opacity ${FADE_MS}ms ease`,
          }}
        />
      )}
    </Ctx.Provider>
  );
}

export function useNavigate() {
  return useContext(Ctx).navigate;
}

export function useFadeSwap() {
  return useContext(Ctx).fadeSwap;
}

export function useNavigateWithSwap() {
  return useContext(Ctx).navigateWithSwap;
}
