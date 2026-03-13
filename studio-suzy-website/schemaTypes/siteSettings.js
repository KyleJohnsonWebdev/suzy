import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      description: 'Main site title - used in browser tab and SEO',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Optional tagline or subtitle',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      description: 'Brief description for SEO and social sharing',
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Instagram Handle',
      type: 'string',
      description: 'Without the @ symbol (e.g., "suzyjohnson")',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      description: 'Full Instagram profile URL',
    }),
    defineField({
      name: 'instagramFeedHeading',
      title: 'Instagram Feed Heading',
      type: 'string',
      description: 'Heading above Instagram section (e.g., "From Instagram" or "Recent posts")',
      initialValue: 'From Instagram',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'Email where contact form submissions will be sent',
      validation: (Rule) =>
        Rule.regex(
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          {
            name: 'email',
            invert: false,
          }
        ).error('Please enter a valid email address'),
    }),
    defineField({
      name: 'contactFormHeading',
      title: 'Contact Form Heading',
      type: 'string',
      description: 'Heading for the contact page/section',
      initialValue: 'Get in touch',
    }),
    defineField({
      name: 'contactFormDescription',
      title: 'Contact Form Description',
      type: 'text',
      rows: 2,
      description: 'Optional text that appears above the contact form',
    }),
  ],
  preview: {
    select: {
      title: 'siteTitle',
    },
    prepare(selection) {
      return {
        title: 'Site Settings',
        subtitle: selection.title,
      }
    },
  },
})