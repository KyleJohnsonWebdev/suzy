/**
 * Facts come from a page's `facts` field in Sanity ({ label, value } pairs).
 * Both components render nothing until there are facts to show.
 */

/** Facts strip (brand book, Components): four label/value pairs on surface between hairlines. */
export function FactsStrip({ facts }) {
  if (!facts?.length) return null
  return (
    <section aria-label="Facts" className="border-y border-border bg-surface">
      <dl className="container-page grid grid-cols-2 gap-space-6 py-space-8 lg:grid-cols-4">
        {facts.map((f) => (
          <div key={f._key ?? f.label}>
            <dt className="text-type-label text-muted">{f.label}</dt>
            <dd className="mt-space-1 text-type-ui text-ink">{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/** About sidebar facts: a `rule` divider above each fact (brand book, tokens: rule, space-4, space-1). */
export function SidebarFacts({ facts }) {
  if (!facts?.length) return null
  return (
    <dl className="space-y-space-6">
      {facts.map((f) => (
        <div key={f._key ?? f.label} className="border-t border-rule pt-space-4">
          <dt className="text-type-label text-muted">{f.label}</dt>
          <dd className="mt-space-1 text-type-body text-ink">{f.value}</dd>
        </div>
      ))}
    </dl>
  )
}
