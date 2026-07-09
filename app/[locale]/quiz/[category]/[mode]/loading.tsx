export default function QuizRouteLoading() {
  return (
    <div className="quiz-layout" aria-busy="true">
      <div className="quiz-wrap">
        <div
          style={{
            width: 120,
            height: 36,
            borderRadius: 9,
            background: 'var(--paint-2)',
            marginBottom: 28,
          }}
        />
        <div
          style={{
            height: 28,
            width: '55%',
            margin: '0 auto 12px',
            borderRadius: 8,
            background: 'var(--paint-2)',
          }}
        />
        <div
          style={{
            height: 16,
            width: '35%',
            margin: '0 auto 36px',
            borderRadius: 6,
            background: 'var(--paint-2)',
          }}
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 14,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                border: '2px solid var(--line)',
                borderRadius: 16,
                padding: '24px 16px',
                minHeight: 148,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
