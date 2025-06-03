// src/globals/current-announcement.ts
import { GlobalConfig } from 'payload'

const CurrentAnnouncement: GlobalConfig = {
  slug: 'current-announcement',
  label: 'Current Announcement',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'buttonText',
      type: 'text',
      required: false,
    },
    {
      name: 'buttonLink',
      type: 'text',
      required: false,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Is Active',
      defaultValue: false,
    },
  ],
}

export default CurrentAnnouncement

