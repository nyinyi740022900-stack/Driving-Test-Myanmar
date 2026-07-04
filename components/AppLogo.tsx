import Image from 'next/image';
import Link from 'next/link';
import { BRAND_NAME } from '@/lib/brand';

interface AppLogoProps {
  href: string;
  variant?: 'wordmark' | 'footer';
  className?: string;
}

export default function AppLogo({ href, variant = 'wordmark', className }: AppLogoProps) {
  if (variant === 'footer') {
    return (
      <Link href={href} className={`logo-img-link logo-img-link--footer ${className ?? ''}`}>
        <Image
          src="/brand/logo-icon-square.png"
          alt=""
          width={32}
          height={32}
          className="logo-icon"
        />
        <span className="logo-footer-text">{BRAND_NAME}</span>
      </Link>
    );
  }

  return (
    <Link href={href} className={`logo-img-link ${className ?? ''}`}>
      <Image
        src="/brand/logo-wordmark.png"
        alt={BRAND_NAME}
        width={200}
        height={40}
        priority
        className="logo-wordmark"
      />
    </Link>
  );
}
