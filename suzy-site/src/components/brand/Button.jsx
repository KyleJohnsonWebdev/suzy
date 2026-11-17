import { Link } from 'react-router-dom'

/**
 * Brand button (brand book, Components › Buttons).
 * primary:   accent fill, on-accent text. One primary per view.
 * secondary: 1px ink outline, transparent.
 * Both: radius-sm, 15px/500 (type-ui), 48px tall.
 * <Button> is a real <button>; <ButtonLink> is a link styled the same.
 */
const VARIANTS = {
  primary: 'bg-accent text-on-accent hover:bg-accent/90',
  secondary: 'border border-ink text-ink hover:bg-ink/5',
}

const base =
  'inline-flex h-12 items-center justify-center rounded-sm px-space-6 text-type-ui transition-colors'

function Button({ variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`${base} disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  )
}

export function ButtonLink({ variant = 'primary', className = '', ...props }) {
  return <Link className={`${base} ${VARIANTS[variant]} ${className}`} {...props} />
}

export default Button
