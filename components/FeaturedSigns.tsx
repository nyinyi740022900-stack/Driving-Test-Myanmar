interface SignItem {
  src: string;
  alt: string;
  caption: string;
}

export default function FeaturedSigns({
  title,
  items,
}: {
  title: string;
  items: SignItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section style={{ maxWidth: 720, margin: '0 auto 40px' }}>
      <h2
        style={{
          fontFamily: 'var(--display)',
          fontWeight: 800,
          fontSize: '1.35rem',
          marginBottom: 16,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 14,
        }}
      >
        {items.map(item => (
          <figure
            key={item.src}
            style={{
              background: '#fff',
              border: '1px solid var(--line)',
              borderRadius: 14,
              padding: '16px 12px',
              margin: 0,
              textAlign: 'center',
            }}
          >
            <img
              src={item.src}
              alt={item.alt}
              width={120}
              height={90}
              style={{ maxHeight: 90, maxWidth: 120, objectFit: 'contain' }}
            />
            <figcaption
              style={{
                marginTop: 10,
                fontSize: '.82rem',
                fontFamily: 'var(--display)',
                fontWeight: 700,
                color: 'var(--ink)',
              }}
            >
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
