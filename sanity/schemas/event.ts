import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Event Title',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Exhibition', value: 'Exhibition' },
          { title: 'Workshop', value: 'Workshop' },
          { title: 'Launch Event', value: 'Launch Event' },
          { title: 'Networking', value: 'Networking' },
          { title: 'Performance', value: 'Performance' },
          { title: 'Screening', value: 'Screening' },
          { title: 'Fashion Show', value: 'Fashion Show' },
          { title: 'Product Launch', value: 'Product Launch' },
          { title: 'Corporate Event', value: 'Corporate Event' },
          { title: 'Other', value: 'Other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date & Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date & Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Which studio or space?',
      options: {
        list: [
          { title: 'Boss Unit', value: 'Boss Unit' },
          { title: 'Boss Frame', value: 'Boss Frame' },
          { title: 'Boss Cell', value: 'Boss Cell' },
          { title: 'Super Cell', value: 'Super Cell' },
          { title: 'Super Frame', value: 'Super Frame' },
          { title: 'Boss Arena', value: 'Boss Arena' },
          { title: 'Super Feast', value: 'Super Feast' },
          { title: 'Super Voice', value: 'Super Voice' },
          { title: 'Super Station', value: 'Super Station' },
          { title: 'Super Lounge', value: 'Super Lounge' },
          { title: 'Multiple Spaces', value: 'Multiple Spaces' },
          { title: 'Entire Facility', value: 'Entire Facility' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'capacity',
      title: 'Expected Capacity',
      type: 'number',
      description: 'Number of attendees',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Upcoming', value: 'upcoming' },
          { title: 'Ongoing', value: 'ongoing' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'upcoming',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Event',
      type: 'boolean',
      description: 'Show this event prominently on the website',
      initialValue: false,
    }),
    defineField({
      name: 'image',
      title: 'Featured Image',
      type: 'image',
      description: 'Main event image',
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
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      description: 'Additional event photos',
      of: [
        {
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
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      description: 'Event videos (YouTube, Vimeo, or file URLs)',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'Video URL',
              description: 'YouTube, Vimeo, or direct video file URL',
            },
            {
              name: 'title',
              type: 'string',
              title: 'Video Title',
            },
            {
              name: 'thumbnail',
              type: 'image',
              title: 'Custom Thumbnail',
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'filters',
      title: 'Filters/Categories',
      type: 'array',
      description: 'Tags for filtering events (e.g., Fashion, Music, Art)',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'organizer',
      title: 'Organizer',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Organizer Name',
          type: 'string',
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
        },
        {
          name: 'phone',
          title: 'Phone',
          type: 'string',
        },
        {
          name: 'website',
          title: 'Website',
          type: 'url',
        },
      ],
    }),
    defineField({
      name: 'ticketInfo',
      title: 'Ticket Information',
      type: 'object',
      fields: [
        {
          name: 'isFree',
          title: 'Free Event',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'price',
          title: 'Ticket Price (AED)',
          type: 'number',
        },
        {
          name: 'ticketUrl',
          title: 'Ticket Purchase URL',
          type: 'url',
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'eventType',
      media: 'image',
      startDate: 'startDate',
    },
    prepare({ title, subtitle, media, startDate }) {
      const date = startDate
        ? new Date(startDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : 'No date';
      return {
        title,
        subtitle: `${subtitle} • ${date}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Start Date, Newest',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
    {
      title: 'Start Date, Oldest',
      name: 'startDateAsc',
      by: [{ field: 'startDate', direction: 'asc' }],
    },
  ],
});

