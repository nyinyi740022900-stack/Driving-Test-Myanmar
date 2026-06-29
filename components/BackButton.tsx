'use client';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import type { CSSProperties } from 'react';

interface Props {
  label?: string;
  className?: string;
  style?: CSSProperties;
  fallback?: string;
}

export default function BackButton({ label = '← Back', className, style, fallback }: Props) {
  const router = useRouter();
  const locale = useLocale();

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback ?? `/${locale}`);
    }
  }

  return (
    <button onClick={handleBack} className={className} style={style}>
      {label}
    </button>
  );
}
