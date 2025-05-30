import { CollectionConfig } from "payload"

export const Sponsors: CollectionConfig = {
  slug: "sponsors",
  upload: {
    mimeTypes: ["image/*"],
    adminThumbnail: "image",
  },
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "site",
      type: "text",
    },
    {
      name: "width",
      type: "number",
      required: true,
    },
    {
      name: "height",
      type: "number",
      required: true,
    },
  ],
}
