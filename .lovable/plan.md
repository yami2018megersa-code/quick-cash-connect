## Branding, colors & favicon update

Scope: `src/components/Logo.tsx`, `src/styles.css`, `src/routes/__root.tsx`, `src/routes/index.tsx`, plus favicon assets in `public/`. No backend/route logic changes.

### 1. Logo (`src/components/Logo.tsx`)
- Upload the attached square sun/diamond icon via `lovable-assets` and reference it from `Logo.tsx` as an `<img>` (replacing the current inline SVG).
- Keep the same `className` / `variant` props so all existing usages (Header, Footer, admin trigger) render the new mark unchanged.

### 2. Brand colors (`src/styles.css`)
- Update tokens to exact hex values:
  - `--navy: #0C003C`
  - `--gold: #FFB700`
- Leave existing `--primary`, `--accent`, `--ring`, gradients, and `glass-nav` mappings pointing at these variables so buttons, borders, and interactive states pick up the new palette automatically.

### 3. Logo contrast on dark backgrounds
- In `src/routes/index.tsx` Footer, wrap the logo in a white rounded padded container (`bg-white rounded-xl p-2 shadow-sm inline-block`) so the navy diamond stays visible on the navy footer.
- Preserve the existing hidden admin link: keep the `<Link to="/admin">` wrapper with its `aria-hidden`, `tabIndex={-1}`, and non-selectable styling — only add the white container inside it.
- Header already uses the light cream `glass-nav` background; no wrapper needed there.

### 4. Favicon
- Create `public/` (if missing) and place the square icon as `public/favicon.png` (copied from the uploaded file, not an asset pointer — favicons must be served from a real path).
- In `src/routes/__root.tsx`, replace the current favicon `<link rel="icon">` entry in `head().links` with `{ rel: "icon", type: "image/png", href: "/favicon.png" }` and delete the default `public/favicon.ico`.

### 5. Verification
- Visually check `/` header + footer: logo renders as new mark, footer logo sits on a white pill, colors reflect the new navy/gold.
- Confirm browser tab shows the new favicon.
- Confirm no changes to `src/routes/apply.tsx`, `admin.tsx`, or any Supabase/handler files.
