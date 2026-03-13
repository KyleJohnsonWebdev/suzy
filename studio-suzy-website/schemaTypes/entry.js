import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'entry',
  title: 'Entry',
  type: 'document',
  fields: [
    defineField({
      name: 'entryType',
      title: 'Entry Type',
      type: 'string',
      options: {
        list: [
          {title: 'Statement', value: 'statement'},
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional - leave blank if this entry doesn\'t need a title',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => doc.title || `entry-${new Date().getTime()}`,
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Main content for statement entries',
      hidden: ({document}) => document?.entryType !== 'statement',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.entryType === 'statement' && (!value || value.length === 0)) {
            return 'Body is required for statement entries'
          }
          return true
        }),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for accessibility and SEO',
          validation: (Rule) => Rule.required(),
        },
      ],
      hidden: ({document}) => document?.entryType !== 'image',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.entryType === 'image' && !value) {
            return 'Image is required for image entries'
          }
          return true
        }),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube, Vimeo, or other embed URL',
      hidden: ({document}) => document?.entryType !== 'video',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.entryType === 'video' && !value) {
            return 'Video URL is required for video entries'
          }
          return true
        }),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 3,
      description: 'Optional caption for image or video entries',
      hidden: ({document}) => document?.entryType === 'statement',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      description: 'Optional - add tags to organize entries',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this entry on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      description: 'This controls when the entry appears on the site',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      entryType: 'entryType',
      media: 'image',
      publishedAt: 'publishedAt',
    },
    prepare(selection) {
      const {title, entryType, publishedAt} = selection
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Not published'
      return {
        title: title || `Untitled ${entryType}`,
        subtitle: `${entryType} • ${date}`,
        media: selection.media,
      }
    },
  },
  orderings: [
    {
      title: 'Published Date, Newest',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Published Date, Oldest',
      name: 'publishedAtAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
  ],
})