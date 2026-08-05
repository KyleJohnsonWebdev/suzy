// Named exports only — no default export.
// Fixes Safari "binding name 'default'" error caused by mixing
// named exports with export default in the same file.

export function Tag({ label }) {
  return (
    <span className="text-xs px-3 py-1 bg-light-lavender text-warm-black rounded">
      {label}
    </span>
  )
}

export function TagList({ tags, className = '' }) {
  if (!tags || tags.length === 0) return null
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, i) => (
        <Tag key={i} label={tag} />
      ))}
    </div>
  )
}
