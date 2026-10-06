# Visual guide: Junior Evidence Review

Independent concept by Ayo Ahmed. Not affiliated with Junior AI. This guide records what was observed on the public site <https://junior.ai/> on 2026-10-06 and how the prototype mirrors it. Raw captures live in [`scrape/`](scrape/).

## What was scraped (actual artifacts)

| Artifact | File | How obtained |
|---|---|---|
| Official logo (literal, unmodified) | `scrape/logo.svg`, served as `public/brand/junior-logo.svg` | `GET https://junior.ai/images/logo.svg` (identical SHA-256) |
| CSS custom properties | `scrape/css-custom-properties.txt` | Extracted from the site's production stylesheet |
| Homepage, desktop 1366px | `scrape/ja_home_1366.png` | Headless Chrome capture |
| Homepage, mobile 390px | `scrape/ja_home_390.png` | Headless Chrome capture |
| Product preview section, desktop / mobile | `scrape/ja_product_1366.png`, `scrape/ja_product_390.png` | Capture after rejecting non-essential cookies, scrolled to the call-view preview |

Screenshots are reference material only and are not shipped in the app UI.

## Observed UI pattern (from the homepage product preview)

- Near-black canvas (`#0f0f0b`) with a slightly lifted panel (`#171817`) and 1px hairlines (`#1f2123`).
- Left rail headed by a small uppercase cyan label ("CALL TYPES") listing items with line icons; the active item gets a cyan-tinted fill and cyan text.
- Call header: square initial avatar, expert name, small outlined cohort chip ("Competitor"), role line in grey ("Former CEO @ Orion Labs"), date/time right-aligned in small grey text.
- Text tabs, not pills: "Key Takeaways · Stats · Call Summary · Transcript · My Notes"; the active tab is cyan, inactive tabs are grey.
- Section headings in medium weight; body in regular Geist with generous line height.
- Buttons: an outlined secondary ("Log in") and a cyan-tinted primary ("Book a demo"), both with small radii (6–8px).

## Tokens used (see `src/styles/tokens.css`)

| Role | Token | Value |
|---|---|---|
| Canvas | `--color-dark-primary` | `#0f0f0b` |
| Panel | `--color-dark-secondary` | `#171817` |
| Hairline | `--color-borderline` | `#1f2123` |
| Primary text | `--color-gray-light` | `#f3f3f3` |
| Secondary text | `--color-gray-mid` / `--color-gray` | `#afbac1` / `#8c99a1` |
| Accent / active | `--color-light-blue` | `#abedff` (10/20/40% tints for fills and rings) |
| Supported / ready | `--color-green-400` | `#05df72` |
| Needs attention | `--color-yellow-400` | `#fac800` |
| Blocking / disputed | `--color-error` | `#ff3939` |
| Radii | `--radius-sm…xl` | 4 / 6 / 8 / 12px |
| Type | Geist (sans), Geist Mono for IDs and timestamps | weights 300/400/500/600; heading tracking −1.92 / −1.28 / −0.96px |

## Font

The site uses Geist. Geist is released by Vercel under the SIL Open Font License 1.1, so the same family is self-hosted from `public/vendor/` with its licence alongside; no substitute is needed.

## Logo use

- The literal SVG sits top-left in the app header at its native 69×20 proportions, followed by a divider and the product name "Evidence Review".
- It is not recoloured, redrawn or animated.
- Every page carries the footer line: "Independent concept by Ayo Ahmed, not affiliated with Junior AI." The logo is used only to show where the increment would sit in the product. Junior AI owns its trademarks.

## Mirroring rules for the prototype

1. Reuse the call-view anatomy: rail, call header with cohort chip, text tabs, transcript list.
2. Status colours use only the site's own green, yellow and error tokens, and every status also carries a text label (it never relies on colour alone).
3. Keep the density modest: same base size (16px), 14px secondary text, 12px mono for IDs and timestamps.
4. At 390px the rail collapses to a horizontal scroll of sections, and the transcript opens as a full-height sheet.
5. Focus rings use the 40% light-blue ring seen on the site's hover states, at 2px.
