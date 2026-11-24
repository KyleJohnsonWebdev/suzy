# maybespecial: design guide

The design choices behind the November 2026 refresh of [maybespecial.com](https://maybespecial.com), the site for maybespecial, Suzy Johnson's design practice.

The refresh evolves the existing site rather than replacing it. It keeps the same headline, the same tooth doodles and one typeface. It also fixes what an audit of the old site found ([quality/baseline.md](../quality/baseline.md)). The site is quiet, typographic and personal: a calm off-white page, one sans-serif typeface, a single violet accent, lavender tints and a few hand-drawn tooth doodles.

Every value here comes from [`suzy-site/src/styles/tokens.json`](../suzy-site/src/styles/tokens.json), the one source for colors, type, spacing and radii. `npm run tokens` turns it into CSS, and `npm run check:contrast` fails the build if a text pairing drops below WCAG AA.

## The decisions

### 1. Fix the contrast failure in the brand, not just the page

**Before:** lavender text (`#C0BEF5`) on the off-white page scored **1.68:1**, against the 4.5:1 that WCAG AA requires. Two grey text tones (3.26:1 and 4.41:1) also failed. Together they caused all 16 color-contrast failures axe found on the old site.

**Chose:** one violet `accent` for links and actions, and darker text tones. Every text pairing is checked in both themes.
**Instead of:** darkening the lavender page by page.
**Cost:** lavender can't carry text anymore. It's a background tint only.

### 2. Let her edit in Sanity, not in code

**Chose:** fixed page templates with editable fields. Her bio, facts, entries, social links and the contact line all live in Sanity.
**Instead of:** a drag-and-drop page builder.
**Cost:** she can't rearrange layouts herself. A new kind of section needs a developer.

### 3. Write in her voice, not a résumé's

**Before:** the home page bio was in the third person.
**Chose:** a first-person bio ("Hi, I'm Suzy."), with credentials moved to the About page's facts.
**Cost:** she rewrote her bio in her own words.

## Brand at a glance

- **Name:** "maybespecial" (one word, all lowercase, as Suzy asked in November 2026) for the practice; "Suzy Johnson" for the person. Never "Maybe Special" or "MaybeSpecial".
- **Page titles:** `Page — maybespecial` (e.g. `About — maybespecial`). The home page is `maybespecial — Suzy Johnson`.
- **Personality:** warm, wry and unpretentious; expert without showing off. The "maybe" is humility with a wink.

## Voice and content

- First person. Short sentences, plain words, a little dry humor. From the site: *"my intentions were good, and my productivity was not."*
- Lead with what she makes and teaches, then credentials.
- Headings are sentence case, except the fixed labels **Selected Work**, **Recent Things** and **Let's Connect**.
- The hero headline stays as written: *"Designer, educator, writer, & creative person doing things."*
- No exclamation marks, no emoji, no buzzwords ("passionate", "creative solutions").

## Color

One accent, one tint, neutrals. The dark theme keeps the same tokens with swapped values. It follows the visitor's system setting, and a toggle saves their choice.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `bg` | `#F8F8F6` | `#141317` | Page. Never pure white or pure black. |
| `surface` | `#FFFFFF` | `#1C1B21` | Raised areas: facts strip, entry card, toggle |
| `ink` | `#1C1C1C` | `#F2F1F5` | Headings |
| `body` | `#444444` | `#C4C2CC` | Long reading |
| `muted` | `#616161` | `#A09EAA` | Dates, categories, fact labels |
| `accent` | `#5443C9` | `#B4A9FF` | Links and actions. The only saturated color. |
| `on-accent` | `#FFFFFF` | `#141317` | Text on accent buttons |
| `lavender` | `#E8E5FA` | `#24213A` | Brand tint: Let's Connect band, quote panels, image placeholders |
| `lavender-ink` | `#5443C9` | `#C9C0FF` | Small brand-colored text on lavender |
| `doodle` | `#D6D1F5` | `#3B3655` | Decorative strokes only |
| `border`, `rule` | `#E5E4E0`, `#D9D8D3` | `#2C2B33`, `#34323C` | 1px hairlines. No shadows anywhere. |

### Contrast (WCAG AA needs 4.5:1)

| Pairing | Light | Dark |
| --- | --- | --- |
| `ink` on `bg` | 16.03:1 | 16.45:1 |
| `body` on `bg` | 9.16:1 | 10.51:1 |
| `muted` on `bg` | 5.82:1 | 7.02:1 |
| `muted` on `lavender` | 5.02:1 | 5.88:1 |
| `accent` on `bg` | 6.53:1 | 8.86:1 |
| `on-accent` on `accent` | 6.95:1 | 8.86:1 |
| `lavender-ink` on `lavender` | 5.63:1 | 9.21:1 |

Don'ts: no gradients, no second accent color, no lavender text on off-white.

## Typography

One family, **Inter**, at weights 400 and 500. Hierarchy comes from size and tight tracking, not weight.

- `display-hero`: the home page headline, 92px, 500, −0.025em. It scales down to 52px on narrow screens (`clamp(52px, 6.4vw, 92px)`).
- `display-page`: page openers ("Hi, I'm Suzy.").
- `heading-section`: section titles. `heading-contact` is only for Let's Connect.
- `lead`: the intro under a display line, about 620px wide at most.
- `body`: long reading (the About bio), about 680px wide at most.
- `meta` and `label`: dates, categories and fact labels, in `muted`.

## Layout

- The container is 1280px wide at most, with 40px (`space-9`) gutters.
- Sections are separated by generous padding (96px, `space-11`) and 1px hairlines, never by boxes with shadows.
- Two-column sections wrap to one column on small screens, with the text column first.
- Images and cards have square corners. Only buttons and fields are rounded (`radius-sm`). Only the portrait and the theme toggle are circles.

## Motif: tooth doodles

Hand-drawn tooth outlines float in the background of the hero and the About opener on wide screens. One of them is also the site icon. Phones show no floating teeth; the tooth sits in a circle beside the wordmark instead.

- Outline only, in `doodle`, with a 2.5–4px stroke, mixing 2–3 sizes (about 44px to 140px tall).
- At most three per screen. Never behind text, and never in the contact band or footer. The old site broke both rules.
- Always decorative: `aria-hidden="true"`.

## Components

- **Header:** the "maybespecial" wordmark on the left (on phones, with the tooth in a 44px circle beside it). The nav is About, Blog and Contact, plus Work when there are projects to show, followed by the theme toggle. The active page gets a 2px `accent` underline and `aria-current="page"`.
- **Theme toggle:** a 44px circle with a moon icon in light and a sun in dark. Its label says what it switches *to*, and it uses `aria-pressed`.
- **Buttons:** primary is an `accent` fill with `on-accent` text, 48px tall; secondary is a 1px `ink` outline. One primary button per view.
- **Facts strip:** four label/value pairs on `surface`, between hairlines.
- **Work card:** a 4:3 image with square corners, the title, then `Category · Year` in `meta`.
- **Entry card:** full width, with a `lavender` quote panel and a `surface` text panel holding meta, title, excerpt and "Read more →".
- **Let's Connect:** a `lavender` band that ends Home and About. "Contact" in the nav scrolls to it. It holds a heading, a line she can edit, a reply-time note, and a Name / Email / Message form.
- **Footer:** the © line on the left; Instagram, LinkedIn and Threads on the right. This is the only place the social links appear.

## Accessibility

- Text is 4.5:1 at minimum (3:1 at 24px and up), in both themes.
- Touch targets are at least 44px.
- Real `<button>`, `<a href>` and labelled `<input>` elements, with visible focus rings in `accent`.
- Doodles and decorative SVGs are hidden from assistive tech.
- Every push runs axe on every page in both themes, at phone and desktop sizes, and the site deploys only if they pass.

Results before and after the refresh: [quality/after.md](../quality/after.md).
