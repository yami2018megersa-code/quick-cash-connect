import logoAsset from "@/assets/nudawn-mark.png.asset.json";

export function Logo({
  className = "h-10 w-10",
  variant: _variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <img
      src={logoAsset.url}
      alt="NuDawn"
      className={`${className} object-contain`}
      loading="eager"
      decoding="async"
    />
  );
}
