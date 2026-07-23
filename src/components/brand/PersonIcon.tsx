interface Props {
  admin?: boolean;
  className?: string;
}

/**
 * Person silhouette icon. When `admin` is true, the same figure is drawn
 * with a clear necktie under the collar.
 */
export function PersonIcon({ admin, className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* shoulders / body */}
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      {/* head */}
      <circle cx="12" cy="7" r="4" />
      {admin && (
        <g>
          {/* small shirt collar to frame the tie */}
          <path d="M9.7 14.8 11.2 16.1" strokeWidth={1.45} />
          <path d="M14.3 14.8 12.8 16.1" strokeWidth={1.45} />
          {/* diamond tie knot directly below the neck */}
          <path d="M12 14.2 13.1 15.25 12 16.25 10.9 15.25Z" fill="currentColor" stroke="none" />
          {/* long pointed tie blade */}
          <path d="M12 16.45 13.35 18.45 12 21 10.65 18.45Z" fill="currentColor" stroke="none" />
        </g>
      )}
    </svg>
  );
}
