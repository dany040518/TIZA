import { Link } from 'react-router-dom';

interface MarkProps {
  to?: string;
  tagline?: string;
}

export function Mark({ to = '/dashboard', tagline }: MarkProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-baseline gap-2.5 font-serif text-[24px] tracking-[-0.01em] text-ink no-underline"
    >
      <span className="inline-block w-[7px] h-[7px] rounded-full bg-orange -translate-y-[2px] flex-shrink-0" />
      <span>tiza</span>
      {tagline && (
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute ml-1">
          {tagline}
        </span>
      )}
    </Link>
  );
}
