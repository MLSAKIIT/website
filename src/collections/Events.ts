import type { CollectionConfig } from "payload"

export const Events: CollectionConfig = {
  slug: "events",
  upload: {
    mimeTypes: ["image/*"],
    adminThumbnail: "thumbnail",
    imageSizes: [
      {
        name: "thumbnail",
        width: 480,
        height: 320,
        position: "centre",
      },
    ],
  },
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "bgColor",
      type: "text",
      required: true,
    },
    {
      name: "name",
      type: "text",
      required: true,
      admin: {
        description: "Enter the event name.",
      },
    },
    {
      name: "date",
      type: "date",
      required: true,
      admin: {
        description: "Enter event date",
      },
    },
    {
      name: "numParticipant",
      type: "number",
      required: true,
      admin: {
        description: "Enter Number of Participants",
      },
    },
    {
      name: "link",
      type: "text",
      required: false,
      admin: {
        description: "Registration link.",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      required: true,
      defaultValue: false,
      admin: {
        description: "Feature this event at the top of the list.",
        position: "sidebar",
      },
      hooks: {
        beforeChange: [
          async ({ value, req, data, originalDoc }) => {
            if (value === true) {
              const payload = req.payload
              await payload.update({
                collection: "events",
                where: {
                  and: [
                    {
                      featured: { equals: true },
                    },
                    {
                      id: { not_equals: originalDoc?.id || data?.id },
                    },
                  ],
                },
                data: {
                  featured: false,
                },
              })
            }
            return value
          },
        ],
      },
    },
  ],
}
