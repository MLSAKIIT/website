import { CollectionConfig } from "payload"

const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "techStack", "updatedAt"],
    description: "Showcase club or member projects.",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Project Title",
    },
    {
      name: "techStack",
      type: "text",
      hasMany: true,
      label: "Tech Stack",
      admin: {
        description:
          "Enter technologies one at a time. Press Tab or Enter after each technology to add it to the list.",
      },
    },
    {
      name: "githubLink",
      type: "text",
      label: "GitHub Link",
    },
    {
      name: "projectCoverImage",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Project Cover Image",
    },
  ],
}

export default Projects
