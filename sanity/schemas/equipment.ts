import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'equipment',
  title: 'Equipment',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Camera', value: 'Camera' },
          { title: 'Lens', value: 'Lens' },
          { title: 'Lighting', value: 'Lighting' },
          { title: 'Audio', value: 'Audio' },
          { title: 'Support', value: 'Support' },
          { title: 'Stabilization', value: 'Stabilization' },
          { title: 'Effects', value: 'Effects' },
          { title: 'Backdrop', value: 'Backdrop' },
          { title: 'Monitor', value: 'Monitor' },
          { title: 'Accessories', value: 'Accessories' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pricePerHour',
      title: 'Price Per Hour (AED)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'pricePerDay',
      title: 'Price Per Day (AED)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      initialValue: 'AED',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'specifications',
      title: 'Specifications',
      type: 'array',
      of: [{ type: 'string' }],
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
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'available',
      title: 'Available',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'image',
    },
  },
});

