import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import AdSenseScript from '@/components/AdSenseScript';
import { buildResourceMetadata } from '@/lib/resourceMetadata';

type LayoutProps = { children: ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  return buildResourceMetadata(locale, 'resourcesDemerit', '/resources/demerit-points');
}

/* The page itself is a client component, so its canonical, hreflang and title
   have to be declared here. Without this layout the route inherited the root
   locale metadata and served the homepage's <title> and homepage hreflang —
   telling Google it was a duplicate of "/". */
export default function DemeritPointsLayout({ children }: LayoutProps) {
  return (
    <>
      <AdSenseScript />
      {children}
    </>
  );
}
