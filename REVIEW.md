# Code Review — suzy-site / studio-suzy-website

Scope: `suzy-site/src/**`, `studio-suzy-website/**` (config + schema), deploy workflow, build config.
`docs/` and `studio-suzy-website/dist/`, `.sanity/` are build output — not reviewed.

No fixes applied. Findings only, grouped by severity.

---

## Critical (will crash the page for a real visitor)

### 1. Missing null-guard in `urlFor()` throws on any non-standard asset ref
**File:** `suzy-site/src/sanityClient.js:15`
```js
const [, id, dimensions, format] = ref.match(/image-([a-f\d]+)-(\d+x\d+)-(\w+)/)
```
`.match()` returns `null` if the ref doesn't fit the expected image-asset pattern, and the destructure on the next line throws `TypeError: Cannot read properties of null`. Any entry whose `image` field ends up pointing at a non-image asset, or a malformed/legacy ref, crashes the whole render tree with no try/catch upstream.

### 2. `entry.slug.current` accessed with no null-check, and queries don't guarantee a slug exists
**Files:** `suzy-site/src/pages/Home.jsx:70`, `suzy-site/src/components/entries/ImageEntryCard.jsx:18`, `StatementEntryCard.jsx:22`, `VideoEntryCard.jsx:20`
None of the list/card queries in `suzy-site/src/queries/index.js` (`ENTRIES_QUERY`, `FEATURED_ENTRIES_QUERY`) filter on `defined(slug)`. Since this is a solo-authored Sanity CMS, nothing stops publishing an entry without a slug set. If that happens, every card component throws on `entry.slug.current` and the feed/homepage goes blank.

---

## High

### 3. `useEntry` has no stale-response guard — race condition on fast navigation
**File:** `suzy-site/src/hooks/useEntry.js:14-28`
The effect re-fetches whenever `slug` changes but has no cancellation/ignore flag. If a visitor navigates from one entry detail page directly to another (e.g. a "next entry" link) fast enough that the first fetch resolves *after* the second request was issued, the stale response can overwrite the newer one — showing the wrong entry's content with no visible error.

### 4. Direct DOM manipulation to hide the header can leave it permanently hidden
**File:** `suzy-site/src/components/detail/ImageDetail.jsx:36-43`
```js
useEffect(() => {
  const header = document.querySelector('header')
  if (header) header.style.display = 'none'
  return () => { if (header) header.style.display = '' }
}, [])
```
This mutates a DOM node outside React's control, once per mount, with no dependency on route/slug. Rapid back/forward navigation between two image entries can interleave mount/cleanup order such that a stale cleanup runs after a newer effect already touched `header.style.display`, leaving the site nav hidden after the visitor has navigated away from the image view.

---

## Medium

### 5. Lightbox-style backdrop declares `role="button"` but only handles Enter, not Space
**File:** `suzy-site/src/components/detail/ImageDetail.jsx:49-56`
`onKeyDown={(e) => e.key === 'Enter' && handleClose()}` — a keyboard/screen-reader user pressing Space (the standard activation key for anything marked `role="button"`) cannot close the lightbox.

### 6. No focus management when the full-screen image lightbox opens
**File:** `suzy-site/src/components/detail/ImageDetail.jsx`
The component hides the header and takes over the full screen like a modal, but has no `role="dialog"`/`aria-modal`, and focus is never moved into it on open. A keyboard user tabbing after navigating in continues from wherever focus previously was rather than landing inside the new view. (`InstagramFlower.jsx`'s panel does this correctly with `role="dialog"` + `aria-modal="true"` — this component doesn't.)

### 7. `ENTRY_FIELDS` and `ENTRY_CARD_FIELDS` are byte-for-byte identical
**File:** `suzy-site/src/queries/index.js:7-31`
Two separately-named GROQ field-projection constants with identical contents. Real divergence risk: trimming the card projection later (e.g. dropping `body`/`videoUrl` for a leaner list fetch) will likely touch only one constant, or an edit meant for one will be assumed to cover the other.

### 8. Escape-key-close handling duplicated
**Files:** `suzy-site/src/components/detail/ImageDetail.jsx:27-33`, `suzy-site/src/components/InstagramFlower.jsx:56-65`
Same `useEffect` + `window.addEventListener('keydown', ...)` + cleanup pattern implemented independently in two places. A future change to the dismiss behavior (e.g. ignoring Escape while focus is in a text input) is likely to be made in one and forgotten in the other.

---

## Low

### 9. `SITE_SETTINGS_QUERY` is defined but never used
**File:** `suzy-site/src/queries/index.js:72-82`
Fully redundant with `CONTACT_SETTINGS_QUERY` + `INSTAGRAM_SETTINGS_QUERY`, which are what's actually imported (`useContactSettings.js`, `useHomeData.js`). Dead code.

### 10. `FlowerMask` component is exported but unused
**File:** `suzy-site/src/components/icons/FlowerIcon.jsx:17-46`
Only `FlowerIcon` is imported anywhere (by `InstagramFlower.jsx`). Dead code.

### 11. `App.css` is entirely unused Vite/React template boilerplate
**File:** `suzy-site/src/App.css`
`.logo`, `.logo:hover`, `.logo.react:hover`, `@keyframes logo-spin`, `.card`, `.read-the-docs` — none of these classes appear anywhere in `App.jsx` or elsewhere in the codebase. Leftover from `create-vite` scaffolding.

### 12. Card queries fetch more data than card components render
**File:** `suzy-site/src/queries/index.js:36-49` (`ENTRIES_QUERY`, `FEATURED_ENTRIES_QUERY`)
Both pull the full `body` portable-text field and the complete `image` asset object for every entry, even though cards only render a truncated excerpt and a single thumbnail. Visitor impact: `/entries` and the homepage feed fetch full body text for image/video entries that never render `body` at all, and payload grows with entry count.

### 13. No caching across route navigation — loading flash on revisit
**File:** `suzy-site/src/hooks/useEntries.js`, `useHomeData.js`, `useEntry.js`
Every mount re-fetches from Sanity even if the visitor was just on that page seconds ago (e.g. Home → Entries → Home). `useCdn: true` softens server load but a visitor still sees a fresh loading spinner each time rather than an instant re-render of unchanged data.

### 14. `EntriesFeed` has no pagination/virtualization
**File:** `suzy-site/src/pages/EntriesFeed.jsx:25-39`
Fine at current entry counts; flagging only because if the archive grows into the hundreds, every card (including full images) mounts at once and a visitor would notice a slow initial load. Not urgent.

---

## None found
- **Accessibility:** no missing `alt` text, no unlabeled form inputs (`Contact.jsx` labels are correctly wired via `htmlFor`/`id`).
- **Build/deploy config:** `deploy.yml` working directory, build step, and `suzy-site/dist` → `docs` copy are consistent; asset paths in `docs/index.html` match the custom-domain root serve via `CNAME`; Node version matches between CI and local. Sanity schema type references (`entry`, `page`, `siteSettings`) are all internally consistent.
- **Studio schema:** no dangling field/type references found.
