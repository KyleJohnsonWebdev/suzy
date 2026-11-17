import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      description: 'Use "home" for the main page',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroText',
      title: 'Hero Text',
      type: 'text',
      rows: 3,
      description: 'Large statement at the top of the page',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
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
      description: 'Optional image displayed between the hero text and body content',
    }),
    defineField({
      name: 'body',
      title: 'Body Content',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Main page content',
    }),
    defineField({
      name: 'showFeaturedEntries',
      title: 'Show Featured Entries',
      type: 'boolean',
      description: 'Display featured entries on this page',
      initialValue: false,
    }),
    defineField({
      name: 'featuredEntriesHeading',
      title: 'Featured Entries Heading',
      type: 'string',
      description: 'Heading above featured entries section (e.g., "Selected work" or "Recent thoughts")',
      hidden: ({document}) => !document?.showFeaturedEntries,
    }),
    defineField({
      name: 'facts',
      title: 'Facts',
      type: 'array',
      description:
        'Short label/value pairs. Home shows four in a strip under the intro; About shows them beside the bio (e.g. degrees, AIGA role). Hidden on the site until you add some.',
      of: [
        {
          type: 'object',
          name: 'fact',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g. "Based in"',
              validation: (Rule) => Rule.required().max(40),
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'e.g. "Orlando, Florida"',
              validation: (Rule) => Rule.required().max(80),
            }),
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        },
      ],
      validation: (Rule) =>
        Rule.max(8).custom((facts, context) =>
          context.document?.slug?.current === 'home' && facts?.length && facts.length !== 4
            ? {
                message: 'The home page facts strip is designed for exactly four facts',
                level: 'warning',
              }
            : true,
        ),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Search Description',
      type: 'text',
      rows: 3,
      description:
        'Shown in search results and link previews. Up to 160 characters. Leave empty to use the start of the page text.',
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare(selection) {
      const {title, slug} = selection
      return {
        title: title,
        subtitle: `/${slug}`,
      }
    },
  },
})