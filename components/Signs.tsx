export function NoEntrySign() {
  return (
    <svg viewBox="0 0 200 200" aria-label="No entry sign">
      <circle cx="100" cy="100" r="92" fill="#E0474C" />
      <circle cx="100" cy="100" r="92" fill="none" stroke="#fff" strokeWidth="6" />
      <rect x="46" y="86" width="108" height="28" rx="5" fill="#fff" />
    </svg>
  );
}

export function MediaPlaceholder({ label }: { label: string }) {
  return (
    <div className="media-placeholder">
      <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="6" y="6" width="36" height="36" rx="4" />
        <circle cx="18" cy="18" r="4" />
        <path d="M6 34l10-12 8 9 6-7 12 10" />
      </svg>
      <span>{label || 'Image coming soon'}</span>
    </div>
  );
}
