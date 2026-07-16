
## Scope
Visual branding only. No changes to routes, server functions, DB/storage code, or `@/lib/supabase` usage.

## 1. `src/components/Logo.tsx` — icon-only mark
Replace the `<img>` (which renders the full logotype with tagline) with an inline SVG recreating just the brand mark from the uploaded image: a golden half-sunburst (5 tapered rays) sitting on top of a deep-navy inverted triangle/diamond.

- Pure inline SVG using `currentColor` + token colors (`var(--gold)`, `var(--navy)`) so it inherits theme and stays crisp at any DPI.
- `viewBox` square, `role="img"`, `aria-label="NuDawn"`, size via `className` (default `h-10 w-10`).
- Keeps the existing named export signature `Logo({ className, variant })` so no caller changes.
- Delete the `nudawn-logo.png` asset pointer via `lovable-assets delete` (no longer referenced).

## 2. `src/styles.css` — token alignment to logo
Current palette is already navy + warm gold, so keep the structure and only tighten values to match the logo exactly:

- `--navy` → tuned to the logo's deep indigo-navy (`oklch(0.19 0.09 275)`).
- `--gold` → tuned to the logo's saturated amber-yellow (`oklch(0.82 0.17 82)`).
- Re-point `--primary`, `--ring`, `--accent`, gradients, and shadows to the updated navy/gold so buttons, focus rings, card borders on hover, and CTA gradients all reflect the brand.
- Typography: keep Plus Jakarta Sans (geometric sans matches the logotype's rounded bold sans); add a slightly tighter tracking utility for headings to echo the logo's condensed weight. No new font imports required.

## 3. Verification
- Visually inspect `/` and `/apply` in the preview after edits: header logo renders as icon only, primary CTA buttons and focus rings use updated gold, navy surfaces match the logo's navy.
- Confirm no route/handler/`lib/supabase` files were touched.

## Out of scope
Route files, form logic, Supabase client, storage/DB code, file restructuring.
