/**
 * Brand button (brand book, Components › Buttons).
 * primary:   accent fill, on-accent text. One primary per view.
 * secondary: 1px ink outline, transparent.
 * Both: radius-sm, 15px/500 (type-ui), 48px tall.
 */
const VARIANTS = {
  primary: 'bg-accent text-on-accent hover:bg-accent/90',
  secondary: 'border border-ink text-ink hover:bg-ink/5',
}

function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`inline-flex h-12 items-center justify-center rounded-sm px-space-6 text-type-ui transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}

export default Button
