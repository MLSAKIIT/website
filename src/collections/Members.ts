import { CollectionConfig, Option, OptionObject } from "payload"

const domains: OptionObject[] = [
  // TECH
  { label: "Web Development", value: "web-dev" },
  { label: "AI / Machine Learning", value: "ai-ml" },
  { label: "App Development", value: "app-dev" },
  { label: "Cloud", value: "cloud" },
  { label: "Cybersecurity", value: "cybersecurity" },
  { label: "UI/UX", value: "ui-ux" },
  { label: "XR & Game Development", value: "xr-game-dev" },
  // NON-TECH
  { label: "Broadcasting", value: "broadcasting" },
  { label: "Content", value: "content" },
  { label: "Corporate Relations", value: "cr" },
  { label: "Creative", value: "creative" },
  { label: "Graphic Design", value: "graphic-design" },
  { label: "Public Relations", value: "pr" },
] as const

const memberRoles: Option[] = [
  {
    label: "Lead",
    value: "lead",
  },
  {
    label: "Vice Lead",
    value: "vice-lead",
  },
  {
    label: "Executive",
    value: "executive",
  },
  {
    label: "Tech Lead",
    value: "tech-lead",
  },

  ...domains.map((domain) => ({
    label: `${domain.label} Lead`,
    value: `${domain.value}-lead`,
  })),

  {
    label: "Member",
    value: "member",
  },
]

const Members: CollectionConfig = {
  slug: "members",
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
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "rollNumber",
      type: "text",
      required: true,
    },
    {
      name: "phoneNumbers",
      type: "array",
      fields: [
        {
          name: "number",
          type: "number",
        },
      ],
    },
    {
      name: "linkedin",
      type: "text",
    },
    {
      name: "github",
      type: "text",
    },
    {
      name: "instagram",
      type: "text",
    },
    {
      name: "profilePic",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "role",
      type: "select",
      options: memberRoles,
      required: true,
      defaultValue: "member",
    },
    {
      name: "domain",
      type: "select",
      options: domains,
    },
  ],
}

export default Members
