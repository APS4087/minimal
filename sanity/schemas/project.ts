import { defineType, defineField, defineArrayMember } from 'sanity';

export const projectSchema = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'techStack',
      title: 'Tech Stack',
      description: 'Add each technology as a separate item',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (r) => r.required().min(1),
    }),

    /* ── Cover media (shown on the project card) ─────────── */
    defineField({
      name: 'mediaType',
      title: 'Cover Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      description: 'Shown on the project card and index hover. Portrait crop recommended (5:4 ratio).',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'coverVideo',
      title: 'Cover Video',
      description: 'Short looping clip shown on the project card. Compress to MP4 before uploading.',
      type: 'file',
      options: { accept: 'video/mp4,video/webm' },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),

    /* ── Gallery (shown in the overlay filmstrip) ────────── */
    defineField({
      name: 'gallery',
      title: 'Gallery',
      description: 'Images and/or videos shown in the overlay filmstrip. Mix freely.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'galleryImage',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
        }),
        defineArrayMember({
          name: 'galleryVideo',
          title: 'Video',
          type: 'file',
          options: { accept: 'video/mp4,video/webm' },
        }),
      ],
    }),

    /* ── Meta ────────────────────────────────────────────── */
    defineField({
      name: 'layout',
      title: 'Layout Tag',
      description: 'Decorative label shown on the project card (top-right corner).',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
          { title: 'Center', value: 'center' },
          { title: 'Stacked', value: 'stacked' },
          { title: 'Offset', value: 'offset' },
          { title: 'Minimal', value: 'minimal' },
          { title: 'Hero', value: 'hero' },
          { title: 'Asymmetric', value: 'asymmetric' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'link',
      title: 'Live URL',
      type: 'url',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order — lower number appears first',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'layout', media: 'coverImage' },
    prepare: ({ title, subtitle, media }) => ({ title, subtitle, media }),
  },
});
