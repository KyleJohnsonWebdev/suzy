import { useState, useEffect } from 'react'
import { client } from '../sanityClient'

function Contact() {
  const [settings, setSettings] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [status, setStatus] = useState('')

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "siteSettings"][0]{
            contactFormHeading,
            contactFormDescription,
            contactEmail
          }
        `)
        setSettings(data)
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }

    fetchSettings()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      // Using Formspree - you'll need to set this up at formspree.io
      // For now, this is a placeholder
      const response = await fetch('https://formspree.io/f/maqjyval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          _replyto: formData.email,
          _subject: `New message from ${formData.name}`
        })
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setStatus('error')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-normal mb-4">
        {settings?.contactFormHeading || 'Get in touch'}
      </h1>
      
      {settings?.contactFormDescription && (
        <p className="text-lg text-warm-black/70 mb-12">
          {settings.contactFormDescription}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-warm-black/20 bg-neutral-white focus:border-lavender focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-warm-black/20 bg-neutral-white focus:border-lavender focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="6"
            className="w-full px-4 py-3 border border-warm-black/20 bg-neutral-white focus:border-lavender focus:outline-none transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="px-8 py-3 bg-lavender text-warm-black hover:bg-warm-black hover:text-neutral-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? 'Sending...' : 'Send message'}
        </button>

        {status === 'success' && (
          <p className="text-lavender">Message sent successfully!</p>
        )}

        {status === 'error' && (
          <p className="text-red-600">
            Something went wrong. Please email directly at {settings?.contactEmail}
          </p>
        )}
      </form>

      {settings?.contactEmail && (
        <p className="text-sm text-warm-black/60 mt-8">
          Or email directly: <a href={`mailto:${settings.contactEmail}`} className="text-lavender hover:text-warm-black underline">{settings.contactEmail}</a>
        </p>
      )}
    </div>
  )
}

export default Contact