// Central GROQ query definitions.
// All Sanity fetches use these — no inline template literals in components.
// If the schema changes, update the projection here once.

// ─── FIELD PROJECTIONS ────────────────────────────────────────────────────────

export const ENTRY_FIELDS = `
  _id,
  title,
  slug,
  entryType,
  image,
  body,
  videoUrl,
  caption,
  tags,
  publishedAt
`

export const ENTRY_CARD_FIELDS = `
  _id,
  title,
  slug,
  entryType,
  image,
  body,
  videoUrl,
  caption,
  tags,
  publishedAt
`

// ─── ENTRY QUERIES ────────────────────────────────────────────────────────────

/** All published entries, newest first */
export const ENTRIES_QUERY = `
  *[_type == "entry" && defined(publishedAt) && defined(slug.current)]
  | order(publishedAt desc){
    ${ENTRY_FIELDS}
  }
`

/** Featured entries for homepage, newest first */
export const FEATURED_ENTRIES_QUERY = `
  *[_type == "entry" && featured == true && defined(publishedAt) && defined(slug.current)]
  | order(publishedAt desc){
    ${ENTRY_CARD_FIELDS}
  }
`

/** Single entry by slug */
export const ENTRY_BY_SLUG_QUERY = `
  *[_type == "entry" && slug.current == $slug][0]{
    ${ENTRY_FIELDS}
  }
`

// ─── PAGE QUERIES ─────────────────────────────────────────────────────────────

export const HOME_PAGE_QUERY = `
  *[_type == "page" && slug.current == "home"][0]{
    title,
    heroText,
    body,
    showFeaturedEntries,
    featuredEntriesHeading,
    facts[]{ _key, label, value },
    metaDescription
  }
`

export const ABOUT_PAGE_QUERY = `
  *[_type == "page" && slug.current == "about"][0]{
    title,
    heroText,
    heroImage,
    body,
    facts[]{ _key, label, value },
    metaDescription
  }
`

// ─── PROJECT QUERIES ──────────────────────────────────────────────────────────
// The "project" type and the page "facts" field arrive with Phase 4's Studio
// changes. Until then these return nothing, and Selected Work, the Work nav
// item and the facts stay hidden.

/** Projects for Selected Work, newest first */
export const PROJECTS_QUERY = `
  *[_type == "project" && defined(title)] | order(year desc){
    _id,
    title,
    image,
    category,
    year,
    url
  }
`

// ─── SETTINGS QUERIES ─────────────────────────────────────────────────────────

// homeHeroText and defaultShareImage are SEO fallbacks: her home headline for
// pages without a description, and the About portrait for link previews.
export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0]{
    siteTitle,
    tagline,
    instagramHandle,
    instagramUrl,
    linkedinUrl,
    threadsUrl,
    instagramFeedHeading,
    contactEmail,
    contactFormHeading,
    contactFormDescription,
    "hasWork": count(*[_type == "project" && defined(title)]) > 0,
    siteDescription,
    "homeHeroText": *[_type == "page" && slug.current == "home"][0].heroText,
    "defaultShareImage": *[_type == "page" && slug.current == "about"][0].heroImage
  }
`

export const CONTACT_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0]{
    contactFormHeading,
    contactFormDescription,
    contactEmail,
    instagramHandle,
    instagramUrl,
    linkedinUrl,
    threadsUrl
  }
`
