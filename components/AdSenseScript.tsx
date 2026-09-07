import { adsConfigured } from '@/lib/ad-strategy';

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;

/**
 * Loads the AdSense tag for ONE route.
 *
 * This is deliberately opt-in per page instead of sitting in the locale
 * layout. When the loader is in the shared <head> it lands on every screen —
 * sign-in, payment, profile, feedback, and the 45 near-identical quiz screens —
 * and Auto Ads will happily inject units there. AdSense reads that as
 * "Google-served ads on screens with replicated content", which is exactly the
 * flag this app was rejected for. `ADS_ON_QUIZ_SCREENS` only ever gated the
 * manual <AdSlot> units; it never gated Auto Ads, because Auto Ads are driven
 * by the presence of this script alone.
 *
 * Render it only from pages that carry substantial original publisher content.
 *
 * It must be a real <script> in the server-rendered HTML (React 19 hoists
 * `<script async src>` into <head>), because Google's crawler does not run
 * client-side script injection.
 */
export default function AdSenseScript() {
  if (!adsConfigured() || !ADSENSE_ID) return null;

  return (
    <>
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
        crossOrigin="anonymous"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.adBreak=window.adConfig=function(o){(window.adsbygoogle=window.adsbygoogle||[]).push(o)};`,
        }}
      />
    </>
  );
}
