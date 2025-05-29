import { CollectionConfig, Option, OptionObject } from "payload"

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
  {
    label: "Domain Lead",
    value: "domain-lead",
  },
  {
    label: "Member",
    value: "member",
  },
]

const Members: CollectionConfig = {
  slug: "members",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role", "domain"],
  },
  access: {
    read: () => true,
    // TODO: change to admin access
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
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
          type: "text",
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
      name: "domainLed",
      label: "Leads Domain",
      type: "relationship",
      relationTo: "domains",
      hasMany: false,
      validate: (value, { data }) => {
        if (data.role === "domain-lead" && !value) {
          return "If Role is `Domain Lead`, a specific domain must be selected."
        }
        return true
      },
    },
    {
      name: "domain",
      type: "relationship",
      relationTo: "domains",
      hasMany: true,
      admin: {
        description: "Domains this member is part of.",
      },
    },
  ],
}

export default Members
