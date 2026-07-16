export function Logo({
  className = "h-10 w-10",
  variant: _variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="NuDawn"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sunburst rays (gold) — 5 tapered wedges radiating from center bottom */}
      <g fill="var(--gold)">
        {/* Center vertical ray */}
        <polygon points="94,10 106,10 110,95 90,95" />
        {/* Inner-left ray */}
        <polygon points="60,20 72,18 100,95 82,95" />
        {/* Inner-right ray */}
        <polygon points="128,18 140,20 118,95 100,95" />
        {/* Outer-left ray */}
        <polygon points="18,55 32,45 92,95 62,95" />
        {/* Outer-right ray */}
        <polygon points="168,45 182,55 138,95 108,95" />
        {/* Half-sun disc at horizon */}
        <path d="M60,100 A40,40 0 0 1 140,100 Z" />
      </g>
      {/* Inverted diamond base (navy) */}
      <polygon
        points="10,102 190,102 100,192"
        fill="var(--navy)"
      />
    </svg>
  );
}
