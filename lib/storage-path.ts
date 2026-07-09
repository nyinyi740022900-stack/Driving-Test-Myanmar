/** Extract a storage object path from a path string or legacy public URL. */
export function storagePathFromRef(ref: string): string | null {
  const trimmed = ref.trim();
  if (!trimmed) return null;
  if (!trimmed.includes('://')) return trimmed;

  const marker = '/payment-screenshots/';
  const idx = trimmed.indexOf(marker);
  if (idx < 0) return null;

  return trimmed.slice(idx + marker.length).split('?')[0] || null;
}
