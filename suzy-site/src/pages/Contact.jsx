import { useState } from 'react'
import { useContactSettings } from '../hooks/useContactSettings'
import LoadingScreen from '../components/shared/LoadingScreen'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/maqjyval'
const INITIAL_FORM = { name: '', email: '', message: '' }

/**
 * Contact page — V2 with character.
 *
 * Case study called out: "The contact page has no character.
 * It's a utility form in a brand context that's otherwise trying
 * to feel authored."
 *
 * Changes from pure-utility version:
 * - Two-column layout at desktop: statement left, form right
 * - Left column carries Suzy's voice — not just a heading
 * - Lavender used as a decorative accent line above the heading
 * - The form itself is unchanged — just given more context
 */
function Contact() {
  const { settings, loading } = useContactSettings()
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
        headers: { 'Content-Type': 'application/json' },
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

  if (loading) return <LoadingScreen />

  const inputClass =
    'w-full px-4 py-3 border border-warm-black/20 bg-neutral-white ' +
    'focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender/30 ' +
    'transition-colors'

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-12 py-20">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

        {/* Left column — voice and context */}
        <div>
          {/* Lavender accent line */}
          <div className="w-12 h-0.5 bg-lavender mb-8" />

          <h1 className="text-5xl font-normal leading-tight mb-8">
            {settings?.contactFormHeading || 'Get in touch'}
          </h1>

          {settings?.contactFormDescription ? (
            <p className="text-xl text-warm-black/70 leading-relaxed mb-8">
              {settings.contactFormDescription}
            </p>
          ) : (
            <p className="text-xl text-warm-black/70 leading-relaxed mb-8">
              Whether it's a project, a question, or just something
              worth saying — this is the place.
            </p>
          )}

          <div className="space-y-3 text-sm text-warm-black/50">
            <p>Response within a few days.</p>
            <a
              href="https://www.instagram.com/maybespecial/"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-lavender transition-colors"
            >
              Instagram → @maybespecial
            </a>
          </div>
        </div>

        {/* Right column — form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="name" className="block text-sm mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={8}
                className={`${inputClass} resize-y`}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="px-8 py-3 bg-lavender text-warm-black hover:bg-warm-black hover:text-neutral-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-lavender focus:ring-offset-2"
            >
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>

            {status === 'success' && (
              <p className="text-green-700" role="alert">
                Message sent — thank you.
              </p>
            )}

            {status === 'error' && (
              <p className="text-red-600" role="alert">
                Something went wrong. Please email directly
                {settings?.contactEmail && (
                  <>
                    {' '}at{' '}
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="underline hover:text-warm-black transition-colors"
                    >
                      {settings.contactEmail}
                    </a>
                  </>
                )}
                .
              </p>
            )}
          </form>
        </div>

      </div>
    </div>
  )
}

export default Contact
