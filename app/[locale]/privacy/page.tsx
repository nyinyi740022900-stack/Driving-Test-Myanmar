import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { BRAND_NAME, SITE_URL, SUPPORT_EMAIL } from '@/lib/brand';

export const metadata: Metadata = {
  title: `Privacy Policy — ${BRAND_NAME}`,
  description: `Privacy Policy for ${BRAND_NAME} driving theory test practice app.`,
};

export default async function PrivacyPage() {
  const locale = await getLocale();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 80px' }}>

        <Link href={`/${locale}`} style={{ fontSize: '.85rem', color: 'var(--ink-soft)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40 }}>
          ← Back to {BRAND_NAME}
        </Link>

        <h1 style={{ fontFamily: 'var(--display)', fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', marginBottom: 48 }}>
          Last updated: July 2026
        </p>

        <Section title="1. Who we are">
          <p>{BRAND_NAME} is a driving theory test practice platform for Singapore (BTT/FTT/RTT) and Japan, available at <strong>{SITE_URL.replace('https://', '')}</strong>. We help learners prepare for their driving theory tests in English, Myanmar, and Japanese.</p>
        </Section>

        <Section title="2. Information we collect">
          <p><strong>Account information</strong> — when you register, we collect your email address and a hashed password via Supabase Auth.</p>
          <p><strong>Quiz progress</strong> — your quiz results, scores, and attempt history are stored locally in your browser (localStorage) and, if logged in, in our database to track your progress.</p>
          <p><strong>Usage data</strong> — we may collect anonymised data about how you use the app (pages visited, quiz modes used) to improve the service.</p>
          <p><strong>Cookies</strong> — we use functional cookies for session management. Third-party services (Google AdSense) may set their own cookies for advertising purposes.</p>
        </Section>

        <Section title="3. How we use your information">
          <ul>
            <li>To provide and improve the quiz and practice features</li>
            <li>To track your progress and display your best scores</li>
            <li>To manage your account and subscription (if applicable)</li>
            <li>To send daily practice reminders (only if you opt in via the bell icon)</li>
            <li>To display relevant advertisements via Google AdSense</li>
          </ul>
        </Section>

        <Section title="4. Google AdSense and advertising">
          <p>We use Google AdSense to display advertisements. Google may use cookies and device identifiers to serve ads based on your prior visits to this site and other sites on the internet.</p>
          <p>You can opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--guide)' }}>Google Ads Settings</a> or by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--guide)' }}>aboutads.info</a>.</p>
          <p>For more information on how Google uses data, see <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--guide)' }}>Google&apos;s Privacy &amp; Terms</a>.</p>
        </Section>

        <Section title="5. Third-party services">
          <p><strong>Supabase</strong> — we use Supabase for authentication and database storage. Data is stored on servers in the EU. See <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--guide)' }}>Supabase Privacy Policy</a>.</p>
          <p><strong>Vercel</strong> — our app is hosted on Vercel. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--guide)' }}>Vercel Privacy Policy</a>.</p>
          <p><strong>Google AdSense</strong> — advertising partner. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--guide)' }}>Google Privacy Policy</a>.</p>
        </Section>

        <Section title="6. Data retention">
          <p>Account data is retained for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us. Local browser data (quiz progress, reminder settings) can be cleared by clearing your browser&apos;s localStorage.</p>
        </Section>

        <Section title="7. Your rights">
          <p>Depending on your location, you may have the right to access, correct, or delete your personal data. To exercise these rights, please contact us at the email below.</p>
        </Section>

        <Section title="8. Children's privacy">
          <p>{BRAND_NAME} is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us.</p>
        </Section>

        <Section title="9. Changes to this policy">
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the service after changes constitutes acceptance of the new policy.</p>
        </Section>

        <Section title="10. Contact">
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p style={{ fontFamily: 'var(--display)', fontWeight: 700, color: 'var(--asphalt)' }}>
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: 'var(--guide-deep)' }}>{SUPPORT_EMAIL}</a>
          </p>
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.1rem', fontWeight: 800, marginBottom: 14, color: 'var(--asphalt)' }}>
        {title}
      </h2>
      <div style={{ fontSize: '.92rem', lineHeight: 1.8, color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {children}
      </div>
    </div>
  );
}
