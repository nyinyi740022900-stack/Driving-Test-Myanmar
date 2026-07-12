export interface LegalSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface LegalDocumentProps {
  backHref: string;
  backLabel: string;
  title: string;
  updated: string;
  sections: LegalSection[];
  contactEmail?: string;
  contactLabel?: string;
}

export default function LegalDocument({
  backHref,
  backLabel,
  title,
  updated,
  sections,
  contactEmail,
  contactLabel,
}: LegalDocumentProps) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 80px' }}>
        <a
          href={backHref}
          style={{
            fontSize: '.85rem',
            color: 'var(--ink-soft)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 40,
          }}
        >
          {backLabel}
        </a>

        <h1 style={{ fontFamily: 'var(--display)', fontSize: '2rem', fontWeight: 900, marginBottom: 8 }}>
          {title}
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', marginBottom: 48 }}>{updated}</p>

        {sections.map(section => (
          <div key={section.title} style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: 'var(--display)',
                fontSize: '1.1rem',
                fontWeight: 800,
                marginBottom: 14,
                color: 'var(--asphalt)',
              }}
            >
              {section.title}
            </h2>
            <div
              style={{
                fontSize: '.92rem',
                lineHeight: 1.8,
                color: 'var(--ink)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              {(section.paragraphs ?? []).map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {section.bullets.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}

        {contactEmail && contactLabel && (
          <div id="contact" style={{ marginTop: 8 }}>
            <h2
              style={{
                fontFamily: 'var(--display)',
                fontSize: '1.1rem',
                fontWeight: 800,
                marginBottom: 14,
                color: 'var(--asphalt)',
              }}
            >
              {contactLabel}
            </h2>
            <p style={{ fontFamily: 'var(--display)', fontWeight: 700, color: 'var(--asphalt)' }}>
              <a href={`mailto:${contactEmail}`} style={{ color: 'var(--guide-deep)' }}>
                {contactEmail}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
