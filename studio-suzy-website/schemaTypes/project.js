import {defineField, defineType} from 'sanity'

// Projects for the home page's Selected Work section. The site shows them
// newest first; the Work link appears in the menu once there's one project.
export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description:
        'Shown at 4:3 with square corners. Use the hotspot to choose what stays in frame.',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description:
            'Describe the image for people who can’t see it (screen readers, search engines). Required.',
          validation: (Rule) =>
            Rule.required().error('Add alternative text to describe this image'),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'e.g. "Branding" or "Packaging". Shown as "Category · Year".',
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1990).max(2100),
    }),
    defineField({
      name: 'url',
      title: 'Link',
      type: 'url',
      description: 'Optional. Where the card links to (a case study, Behance, the live site).',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  orderings: [{title: 'Newest first', name: 'yearDesc', by: [{field: 'year', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', category: 'category', year: 'year', media: 'image'},
    prepare: ({title, category, year, media}) => ({
      title,
      subtitle: [category, year].filter(Boolean).join(' · '),
      media,
    }),
  },
})
