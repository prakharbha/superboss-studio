import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'seo',
  title: 'SEO & Page Content',
  type: 'document',
  fields: [
    defineField({
      name: 'page',
      title: 'Page Path',
      type: 'string',
      description: 'The page path (e.g., "/", "/studios", "/equipment")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'ogType',
      title: 'Open Graph Type',
      type: 'string',
      options: {
        list: [
          { title: 'Website', value: 'website' },
          { title: 'Article', value: 'article' },
        ],
      },
      initialValue: 'website',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'page',
      subtitle: 'title',
    },
  },
});

