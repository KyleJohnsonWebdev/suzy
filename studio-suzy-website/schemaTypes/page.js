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