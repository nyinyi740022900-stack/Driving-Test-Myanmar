interface Props {
  title: string;
  paragraphs: string[];
}

export default function StudyArticle({ title, paragraphs }: Props) {
  if (paragraphs.length === 0) return null;

  return (
    <section style={{ maxWidth: 720, margin: '0 auto 48px' }}>
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
      {paragraphs.map(paragraph => (
        <p
          key={paragraph.slice(0, 48)}
          style={{
            color: 'var(--ink-soft)',
            lineHeight: 1.75,
            fontSize: '1.02rem',
            marginBottom: 14,
          }}
        >
          {paragraph}
        </p>
      ))}
    </section>
  );
}
