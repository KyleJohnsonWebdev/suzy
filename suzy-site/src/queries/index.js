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
  *[_type == "entry" && defined(publishedAt)]
  | order(publishedAt desc){
    ${ENTRY_FIELDS}
  }
`

/** Featured entries for homepage, newest first */
export const FEATURED_ENTRIES_QUERY = `
  *[_type == "entry" && featured == true && defined(publishedAt)]
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
    featuredEntriesHeading
  }
`

// ─── SETTINGS QUERIES ─────────────────────────────────────────────────────────

export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0]{
    siteTitle,
    tagline,
    instagramUrl,
    instagramFeedHeading,
    contactEmail,
    contactFormHeading,
    contactFormDescription
  }
`

export const CONTACT_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0]{
    contactFormHeading,
    contactFormDescription,
    contactEmail
  }
`

export const INSTAGRAM_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0]{
    instagramUrl
  }
`
