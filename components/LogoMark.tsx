/** TheoryLane icon — guide-green badge with lane dashes */
export default function LogoMark({
  size = 30,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="32" height="32" rx="7" fill="#1B9C56" />
      <rect
        x="5"
        y="5"
        width="22"
        height="22"
        rx="5"
        stroke="rgba(255,255,255,0.88)"
        strokeWidth="2"
        fill="none"
      />
      <rect x="7" y="14.5" width="7" height="3" rx="1.5" fill="#FFFFFF" />
      <rect x="18" y="14.5" width="7" height="3" rx="1.5" fill="#F2A734" />
    </svg>
  );
}
