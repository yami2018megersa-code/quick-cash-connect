import logoAsset from "@/assets/nudawn-logo.png.asset.json";

export function Logo({ className = "", variant: _variant = "dark" }: { className?: string; variant?: "dark" | "light" }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoAsset.url}
        alt="NuDawn Financial Services — New tomorrow, together"
        className="h-10 w-auto"
      />
    </div>
  );
}
