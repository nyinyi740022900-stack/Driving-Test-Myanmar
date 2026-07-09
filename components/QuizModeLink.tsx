'use client';

import Link from 'next/link';
import type { Category } from '@/lib/types';
import { prefetchQuestionBank } from '@/lib/quiz-prefetch';

interface Props {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  category: Category;
  children: React.ReactNode;
}

/** Quiz navigation link that prefetches the question bank on hover/focus. */
export default function QuizModeLink({ href, className, style, category, children }: Props) {
  const warm = () => prefetchQuestionBank(category);

  return (
    <Link
      href={href}
      className={className}
      style={style}
      prefetch
      onMouseEnter={warm}
      onFocus={warm}
    >
      {children}
    </Link>
  );
}
