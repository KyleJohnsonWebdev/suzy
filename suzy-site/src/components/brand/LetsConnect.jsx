import { useState } from 'react'
import { useContactSettings } from '../../hooks/useContactSettings'
import Button from './Button'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/maqjyval'
const INITIAL_FORM = { name: '', email: '', message: '' }

// Fallbacks match what's in Sanity, so nothing shifts while settings load.
// Suzy's wording (email, 2026-11-24).
const DEFAULT_HEADING = 'Get in Touch'
const DEFAULT_NOTE = 'Response within a few days.'
const DEFAULT_LINE = 'If you find you would like to work with or share thoughts with me—This would be the place.'

const fieldClass =
  'block w-full rounded-sm border border-field-border bg-field px-space-4 text-type-body text-ink ' +
  'transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30'

/**
 * Let's Connect band (brand book, Components › Let's Connect).
 * A lavender band ending Home and About, id="contact" for the nav's Contact
 * item. Short accent rule, heading, the line, reply-time note, then
 * Name / Email / Message and "Send message". Messages go through Formspree.
 * No social links here: they live only in the footer.
 */
function LetsConnect() {
  const { settings } = useContactSettings()
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...formData,
          _replyto: formData.email,
          _subject: `New message from ${formData.name}`,
        }),
      })
      if (response.ok) {
        setStatus('success')
        setFormData(INITIAL_FORM)
      } else {
        setStatus('error')
      }
    } catch (err) {
      console.error('Contact form error:', err)
      setStatus('error')
    }
  }

  return (
    <section id="contact" tabIndex={-1} aria-labelledby="contact-heading" className="bg-lavender py-space-11 focus:outline-none">
      <div className="container-page grid gap-space-10 lg:grid-cols-2">
        <div>
          <div className="mb-space-8 h-0.5 w-10 bg-accent" aria-hidden="true" />
          <h2 id="contact-heading" className="text-type-heading-contact text-ink">
            {settings?.contactFormHeading || DEFAULT_HEADING}
          </h2>
          <p className="mt-space-6 max-w-lead text-type-lead text-body">
            {settings?.contactFormDescription || DEFAULT_LINE}
          </p>
          <p className="mt-space-6 text-type-meta text-muted">{settings?.contactReplyNote || DEFAULT_NOTE}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-space-5">
          {/* Name and Email share a row when there's room (Refresh mockups). */}
          <div className="grid gap-space-5 sm:grid-cols-2">
            <Field id="name" label="Name">
              <input id="name" name="name" type="text" required autoComplete="name" value={formData.name} onChange={handleChange} className={`${fieldClass} h-12`} />
            </Field>
            <Field id="email" label="Email">
              <input id="email" name="email" type="email" required autoComplete="email" value={formData.email} onChange={handleChange} className={`${fieldClass} h-12`} />
            </Field>
          </div>
          <Field id="message" label="Message">
            <textarea id="message" name="message" required rows={6} value={formData.message} onChange={handleChange} className={`${fieldClass} resize-y py-space-3`} />
          </Field>

          <Button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </Button>

          {/* Status is in words, not color: the brand has no success/error colors,
              and green or red text fails contrast on the lavender band. */}
          <div aria-live="polite">
            {status === 'success' && <p className="text-type-body text-ink">Message sent — thank you.</p>}
            {status === 'error' && (
              <p className="text-type-body text-ink" role="alert">
                Something went wrong. Please email directly
                {settings?.contactEmail && (
                  <>
                    {' '}at{' '}
                    <a href={`mailto:${settings.contactEmail}`} className="text-accent underline">
                      {settings.contactEmail}
                    </a>
                  </>
                )}
                .
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-space-2 block text-type-ui text-ink">
        {label}
      </label>
      {children}
    </div>
  )
}

export default LetsConnect
