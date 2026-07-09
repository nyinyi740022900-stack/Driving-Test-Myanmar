/**
 * Extract the 11-character YouTube video ID from any common URL form:
 * watch?v=, youtu.be/, shorts/, embed/, live/, or a raw video ID.
 * Returns null when no valid ID can be found.
 */
export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Raw video ID pasted directly
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  let url: URL;
  try {
    url = new URL(trimmed.includes('://') ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\.|^m\./, '');
  if (host === 'youtu.be') {
    const id = url.pathname.split('/')[1] ?? '';
    return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  }
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const v = url.searchParams.get('v');
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
    const match = url.pathname.match(/^\/(?:shorts|embed|live|v)\/([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }
  return null;
}

export function youTubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function youTubeEmbedUrl(videoId: string, autoplay = false): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0${autoplay ? '&autoplay=1' : ''}`;
}
