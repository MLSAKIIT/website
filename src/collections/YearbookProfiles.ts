import { CollectionConfig } from "payload"

const YearbookProfiles: CollectionConfig = {
  slug: "yearbook-profiles",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role"],
  },
  fields: [
    {
      name: "member",
      type: "relationship",
      relationTo: "members",
      label: "Link to Member Record",
      admin: {
        description:
          "Select the member this yearbook entry is for. Some fields below will auto-populate if a member is selected. You can then override them if needed.",
        appearance: "drawer",
        components: {
          Field: "@/components/yearbook/index#YearbookMemberSelectorServer",
        },
      },
    },
    {
      name: "name",
      type: "text",
      required: true,
      label: "Full Name",
    },
    {
      name: "yearbookProfilePic",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Profile Picture",
    },
    {
      name: "role",
      type: "text",
      required: true,
      label: "Role",
      admin: {
        placeholder: "EX LEAD",
      },
    },
    {
      name: "testimonial",
      type: "textarea",
    },
  ],
}

export default YearbookProfiles
