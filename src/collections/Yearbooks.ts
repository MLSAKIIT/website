import { CollectionConfig } from "payload"

const Yearbooks: CollectionConfig = {
  slug: "yearbook",
  admin: {
    useAsTitle: "year",
    defaultColumns: ["year", "profiles"],
  },
  fields: [
    {
      name: "year",
      type: "number",
      required: true,
      label: "Academic year",
      admin: {
        placeholder: `${new Date().getFullYear()}`,
      },
    },
    {
      name: "profiles",
      type: "relationship",
      relationTo: "yearbook-profiles",
      hasMany: true,
      required: true,
      label: "People in this yearbook.",
    },
  ],
}

export default Yearbooks
