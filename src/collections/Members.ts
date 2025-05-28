import { CollectionConfig } from 'payload';

const Members: CollectionConfig = {
  slug: 'members',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true, // Allow public read access
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'rollNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'phoneNumbers',
      type: 'array',
      fields: [
        {
          name: 'number',
          type: 'text',
        },
      ],
    },
    {
      name: 'linkedin',
      type: 'text',
    },
    {
      name: 'github',
      type: 'text',
    },
    {
      name: 'instagram',
      type: 'text',
    },
    {
      name: 'profilePic',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'role',
      type: 'select',
      options: ['lead', 'vice lead', 'executive', 'leads', 'ex-leads'],
      required: true,
    },
    {
      name: 'domain',
      type: 'text',
    },
  ],
};

export default Members;
