import { CollectionConfig } from "payload"

const Domains: CollectionConfig = {
  slug: "domains",
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
      name: "slug",
      label: "Slug (Short Value)",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
        description: "Short unique identifier (e.g. web, app, aiml). Used internally",
      },
    },
    {
      name: "weight",
      type: "number",
      admin: {
        description: "Lower numbers appear first",
        position: "sidebar",
        step: 1,
      },
      required: false,
      defaultValue: 99,
    },
  ],
}

export default Domains
