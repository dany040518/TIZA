import { Link } from 'react-router-dom';

interface MarkProps {
  to?: string;
  size?: number;
}

export function Mark({ to = '/dashboard', size = 28 }: MarkProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 no-underline font-bold"
      style={{ fontSize: size, lineHeight: 1, letterSpacing: '-0.03em', color: 'var(--color-plum)' }}
    >
      <svg width={size * 0.95} height={size * 0.95} viewBox="0 0 40 40" aria-hidden>
        <circle cx="20" cy="20" r="17" fill="var(--color-orange)" stroke="var(--color-plum)" strokeWidth="2.5"/>
        <path d="M11 17 L29 17 M20 17 L20 29" stroke="var(--color-plum)" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="29" cy="13" r="3" fill="var(--color-blush)" stroke="var(--color-plum)" strokeWidth="2"/>
      </svg>
      <span style={{ letterSpacing: '-0.04em' }}>tiza</span>
    </Link>
  );
}

export function Star({ size = 32, fill = 'var(--color-butter)' }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <path
        d="M20 2 L23 16 L37 18 L26 27 L30 40 L20 32 L10 40 L14 27 L3 18 L17 16 Z"
        fill={fill}
        stroke="var(--color-plum)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Squiggle({ color = 'var(--color-orange)', className = '' }: { color?: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 14" preserveAspectRatio="none" aria-hidden>
      <path
        d="M2 8 Q 15 1 30 8 T 60 8 T 90 8 T 118 8"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Blob({
  color,
  className = '',
  style,
}: {
  color: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg className={className} style={style} viewBox="0 0 200 200" aria-hidden>
      <path
        d="M44 60 Q 60 18 110 22 Q 168 28 178 80 Q 188 138 140 168 Q 90 196 50 158 Q 14 118 44 60 Z"
        fill={color}
        stroke="var(--color-plum)"
        strokeWidth="3"
      />
    </svg>
  );
}