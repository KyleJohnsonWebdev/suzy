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
          {title: 'Post', value: 'post'},
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
      name: 'postBody',
      title: 'Post',
      type: 'array',
      description:
        'Long-form writing. Use the toolbar for headings, bold, italics, lists, quotes and links; the + button adds a photo or embeds a video or link.',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading', value: 'h2'},
            {title: 'Subheading', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullets', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
        },
        {
          type: 'image',
          title: 'Photo',
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
            {name: 'caption', type: 'string', title: 'Caption', description: 'Optional'},
          ],
        },
        {
          type: 'object',
          name: 'embed',
          title: 'Video or link',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'URL',
              description:
                'A YouTube or Vimeo link plays in the post. Any other link shows as a card.',
              validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
            },
            {
              name: 'title',
              type: 'string',
              title: 'Title',
              description: 'Names the video for screen readers, or labels the link card',
            },
            {name: 'caption', type: 'string', title: 'Caption', description: 'Optional'},
          ],
          preview: {
            select: {title: 'title', subtitle: 'url'},
            prepare: ({title, subtitle}) => ({title: title || subtitle, subtitle: title ? subtitle : 'Embed'}),
          },
        },
      ],
      hidden: ({document}) => document?.entryType !== 'post',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.document?.entryType === 'post' && (!value || value.length === 0)) {
            return 'Write something for this post'
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
      hidden: ({document}) => !['image', 'video'].includes(document?.entryType),
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