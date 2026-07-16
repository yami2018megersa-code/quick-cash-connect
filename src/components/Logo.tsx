export function Logo({
  className = "h-10 w-10",
  variant: _variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="NuDawn"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sun rays (gold) */}
      <g fill="var(--gold)">
        <polygon points="50,8 42,50 58,50" />
        <polygon points="24,18 34,50 47,50" />
        <polygon points="76,18 66,50 53,50" />
        <polygon points="8,38 22,50 34,50" />
        <polygon points="92,38 78,50 66,50" />
      </g>
      {/* Inverted triangle base (navy) */}
      <polygon points="10,50 90,50 50,94" fill="var(--navy)" />
    </svg>
  );
}
