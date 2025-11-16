import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'prop',
  title: 'Prop',
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
          { title: 'Furniture', value: 'Furniture' },
          { title: 'Display', value: 'Display' },
          { title: 'Lighting Props', value: 'Lighting Props' },
          { title: 'Textiles', value: 'Textiles' },
          { title: 'Decor', value: 'Decor' },
          { title: 'Backdrops', value: 'Backdrops' },
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
      name: 'color',
      title: 'Color',
      type: 'string',
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Modern', value: 'Modern' },
          { title: 'Vintage', value: 'Vintage' },
          { title: 'Luxury', value: 'Luxury' },
          { title: 'Industrial', value: 'Industrial' },
          { title: 'Minimalist', value: 'Minimalist' },
          { title: 'Traditional', value: 'Traditional' },
          { title: 'Art Deco', value: 'Art Deco' },
          { title: 'Rustic', value: 'Rustic' },
          { title: 'Various', value: 'Various' },
        ],
      },
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

