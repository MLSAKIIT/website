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
    useAsTitle: "projectName",
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
      name: "projectName",
      type: "text",
      required: true,
      admin: {
        description: "Enter the Project Name",
      },
    },
    {
      name: "date",
      type: "date",
      required: true,
      admin: {
        description: "Enter date of event",
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
      name: "isButton",
      type: "checkbox",
      required: true,
      defaultValue: false,
    },
    {
      name: "isHero",
      type: "checkbox",
      required: true,
      defaultValue: false,
    },
    {
      name: "link",
      type: "text",
      required: true,
      admin: {
        description: "Add the link to the project.",
      },
    },
    {
      name: "description",
      type: "text",
      required: true,
      admin: {
        description: "Add short description of the project",
      },
    },
  ],
}
