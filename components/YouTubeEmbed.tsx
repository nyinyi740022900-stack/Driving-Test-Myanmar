'use client';

import { useState } from 'react';
import { youTubeEmbedUrl, youTubeThumbnail } from '@/lib/youtube';

/**
 * Lightweight YouTube embed: renders the thumbnail with a play button,
 * and only loads the real iframe after the user clicks. Keeps the page
 * fast even with many videos.
 */
export default function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: 12, overflow: 'hidden', background: '#000' }}>
        <iframe
          src={youTubeEmbedUrl(videoId, true)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      style={{ position: 'relative', display: 'block', width: '100%', aspectRatio: '16 / 9', borderRadius: 12, overflow: 'hidden', border: 'none', padding: 0, cursor: 'pointer', background: '#000' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={youTubeThumbnail(videoId)}
        alt={title}
        loading="lazy"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: .92 }}
      />
      <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 64, height: 45, background: 'rgba(0,0,0,.72)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff" aria-hidden="true">
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
      </span>
    </button>
  );
}
