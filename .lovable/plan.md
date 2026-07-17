## Client Content & Header Update

Scope: `src/routes/index.tsx` and `src/styles.css` only. No backend/logic changes.

### 1. Content replacements (in `src/routes/index.tsx`)
- Footer email: `hello@nudawn.co.za` → `Info@nudawngroup.co.za` (also update Privacy Policy body).
- Footer compliance: `NCRCPXXXXX` → `NCRCP20672`, `FSPXXXXX` → `FSP51669`.
- Terms modal: same NCRCP + FSP replacements.
- Funeral WhatsApp CTA (Pricing cards): update `wa.me/27731869932` → `wa.me/27872651832` on all 3 plan buttons.
  - Hero "Explore Funeral Cover" remains as an in-page anchor to `#funeral`.
- Slogan trim:
  - Hero paragraph: remove the trailing sentence so only **"New Tomorrow, Together."** remains.
  - Footer tagline: replace with just **"New Tomorrow, Together."**

### 2. Header background change
Make the header much lighter than the current navy `glass-nav`. Use a warm off-white/cream background (`#FAF8F4` or `oklch(0.98 0.01 85)`) with a subtle bottom border, while keeping the brand palette intact for text and logo.

- Update `glass-nav` utility in `src/styles.css`:
  - Background: warm off-white at 95% opacity + blur.
  - Border: soft gold/navy tint.
  - Nav link color: navy (`var(--navy)`), hover: gold (`var(--gold)`).

### 3. Verification
- Visually inspect `/` and `/apply` in the preview: header is light, logo reads clearly, content updates render correctly.
- Confirm no route/handler/`lib/supabase` files were touched.
