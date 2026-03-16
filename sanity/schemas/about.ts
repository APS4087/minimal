import { defineType, defineField, defineArrayMember } from 'sanity';

export const aboutSchema = defineType({
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    /* ── Hero ─────────────────────────────────────────────── */
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'currentRoles',
      title: 'Current Roles',
      description: 'E.g. "IT Infrastructure Engineer · Maxwell Ship Management"',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),

    /* ── Stats ─────────────────────────────────────────────── */
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [defineArrayMember({
        name: 'stat',
        type: 'object',
        fields: [
          defineField({ name: 'value', title: 'Value', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
        ],
        preview: { select: { title: 'value', subtitle: 'label' } },
      })],
    }),

    /* ── Craft & Stack ─────────────────────────────────────── */
    defineField({
      name: 'stackGroups',
      title: 'Skill Groups',
      type: 'array',
      of: [defineArrayMember({
        name: 'stackGroup',
        type: 'object',
        fields: [
          defineField({ name: 'area', title: 'Area Name', type: 'string', validation: (r) => r.required() }),
          defineField({
            name: 'skills',
            title: 'Skills',
            type: 'array',
            of: [defineArrayMember({ type: 'string' })],
          }),
          defineField({
            name: 'accent',
            title: 'Accent Style',
            type: 'boolean',
            description: 'Enable for the "Currently Learning" group',
            initialValue: false,
          }),
        ],
        preview: { select: { title: 'area' } },
      })],
    }),

    /* ── Quotes ────────────────────────────────────────────── */
    defineField({
      name: 'pullQuote',
      title: 'Pull Quote',
      description: 'Large serif quote. E.g. "I build for people, not portfolios."',
      type: 'string',
    }),
    defineField({
      name: 'communityQuote',
      title: 'Community Quote',
      description: 'Smaller body quote in the Events section.',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'closingTagline',
      title: 'Closing Tagline',
      type: 'string',
    }),

    /* ── Events & Community ────────────────────────────────── */
    defineField({
      name: 'events',
      title: 'Events',
      type: 'array',
      of: [defineArrayMember({
        name: 'event',
        type: 'object',
        fields: [
          defineField({ name: 'year', title: 'Year', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'role', title: 'Role / Tagline', type: 'string' }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
          defineField({
            name: 'stats',
            title: 'Stats',
            type: 'array',
            of: [defineArrayMember({
              name: 'eventStat',
              type: 'object',
              fields: [
                defineField({ name: 'value', title: 'Value', type: 'string' }),
                defineField({ name: 'label', title: 'Label', type: 'string' }),
              ],
              preview: { select: { title: 'value', subtitle: 'label' } },
            })],
          }),
          defineField({
            name: 'heroImage',
            title: 'Hero Image',
            type: 'image',
            options: { hotspot: true },
          }),
          defineField({
            name: 'galleryImages',
            title: 'Gallery Images',
            description: 'Up to 3 images shown in the staggered row below the hero.',
            type: 'array',
            of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
            validation: (r) => r.max(3),
          }),
          defineField({
            name: 'featuredVideo',
            title: 'Featured Video',
            description: 'Shown in the middle slot of the gallery row.',
            type: 'file',
            options: { accept: 'video/*' },
          }),
        ],
        preview: { select: { title: 'title', subtitle: 'year' } },
      })],
    }),

    /* ── Achievements ──────────────────────────────────────── */
    defineField({
      name: 'achievements',
      title: 'Achievements / Recognition',
      type: 'array',
      of: [defineArrayMember({
        name: 'achievement',
        type: 'object',
        fields: [
          defineField({ name: 'year', title: 'Year', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
          defineField({
            name: 'result',
            title: 'Result',
            description: 'E.g. "1st Place" or "Finalist"',
            type: 'string',
          }),
          defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
          defineField({
            name: 'heroImage',
            title: 'Hero Image',
            type: 'image',
            options: { hotspot: true },
          }),
          defineField({
            name: 'featuredVideo',
            title: 'Featured Video',
            type: 'file',
            options: { accept: 'video/*' },
          }),
        ],
        preview: { select: { title: 'title', subtitle: 'year' } },
      })],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'About Page' }),
  },
});
