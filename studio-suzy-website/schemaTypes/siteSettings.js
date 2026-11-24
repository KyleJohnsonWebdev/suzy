import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fieldsets: [
    {name: 'blog', title: 'Blog page', options: {collapsible: true, collapsed: false}},
    {name: 'contact', title: 'Contact section', description: 'The band at the end of Home and About.', options: {collapsible: true, collapsed: false}},
  ],
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
      description:
        'Brief description for SEO and social sharing. Up to 160 characters. Used by pages without their own Search Description.',
      validation: (Rule) => Rule.max(160),
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
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      description: 'Full LinkedIn profile URL',
    }),
    defineField({
      name: 'threadsUrl',
      title: 'Threads URL',
      type: 'url',
      description: 'Full Threads profile URL',
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
      name: 'blogHeading',
      title: 'Heading',
      type: 'string',
      fieldset: 'blog',
      placeholder: "Recent Things I've Thought or Done",
      description: 'The big heading at the top of the blog page. Leave empty for the default shown in grey.',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'blogIntro',
      title: 'Intro',
      type: 'text',
      rows: 2,
      fieldset: 'blog',
      description: 'Optional. A sentence or two under the heading. Up to 200 characters.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'contactFormHeading',
      title: 'Heading',
      type: 'string',
      fieldset: 'contact',
      placeholder: 'Get in Touch',
      description: 'Leave empty for the default shown in grey.',
    }),
    defineField({
      name: 'contactFormDescription',
      title: 'Description',
      type: 'text',
      rows: 2,
      fieldset: 'contact',
      description: 'The line under the heading.',
    }),
    defineField({
      name: 'contactReplyNote',
      title: 'Reply note',
      type: 'string',
      fieldset: 'contact',
      placeholder: 'Response within a few days.',
      description: 'The small note under the description. Leave empty for the default shown in grey.',
      validation: (Rule) => Rule.max(80),
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