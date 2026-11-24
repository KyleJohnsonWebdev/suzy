import {defineField, defineType} from 'sanity'

// A short label on the home page, with the site's default as the placeholder.
const labelField = (name, title, placeholder, description) =>
  defineField({
    name,
    title,
    type: 'string',
    fieldset: 'homeLabels',
    placeholder,
    description,
    validation: (Rule) => Rule.max(40),
  })

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fieldsets: [
    {
      name: 'homeLabels',
      title: 'Buttons and labels',
      description: 'Leave any of these empty to use the default shown in grey.',
      options: {collapsible: true, collapsed: false},
      hidden: ({document}) => document?.slug?.current !== 'home',
    },
  ],
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
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 2,
      description:
        'One or two sentences under the page heading (shown on About). Up to 200 characters.',
      validation: (Rule) => Rule.max(200),
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
              type: 'text',
              rows: 2,
              description: 'e.g. "Orlando, Florida". A line break starts a second line.',
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
    labelField('blogButtonLabel', 'Blog button', 'Good Thoughts', 'The main button under the intro. Opens the blog. (Once Selected Work has projects, the work button takes its place.)'),
    labelField('workButtonLabel', 'Work button', 'See my work', 'The main button under the intro once Selected Work has projects.'),
    labelField('aboutButtonLabel', 'About button', 'Who am I?', 'The second button under the intro. Opens About.'),
    labelField('workHeading', 'Selected Work heading', 'Selected Work', 'Heading over your projects (once there are some).'),
    labelField('blogLinkLabel', 'Blog link', 'See the blog', 'Link beside the featured entries heading. An arrow is added after it.'),
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