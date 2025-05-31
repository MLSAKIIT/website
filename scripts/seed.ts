import { CollectionSlug, getPayload, RequiredDataFromCollectionSlug } from "payload"
import config from "@payload-config"
import { faker } from "@faker-js/faker"
import { Member } from "@/payload-types"

const collectionsToDeleteInOrder: CollectionSlug[] = [
  "yearbook",
  "yearbook-profiles",
  "events",
  "members",
  "sponsors",
  "domains",
  "media",
  "users",
]

const domains = [
  // TECH
  { label: "Web Development", slug: "web", weight: 1 },
  { label: "App Development", slug: "app", weight: 2 },
  { label: "AI / Machine Learning", slug: "aiml", weight: 3 },
  { label: "Cloud", slug: "cloud", weight: 4 },
  { label: "Cybersecurity", slug: "cyber", weight: 5 },
  { label: "XR & Game Development", slug: "xr", weight: 6 },
  { label: "UI/UX", slug: "uiux", weight: 7 },
  // NON-TECH
  { label: "Broadcasting", slug: "broadcasting", weight: 20 },
  { label: "Content", slug: "content", weight: 21 },
  { label: "Corporate Relations", slug: "cr", weight: 22 },
  { label: "Creative", slug: "creative", weight: 23 },
  { label: "Graphic Design", slug: "gd", weight: 24 },
  { label: "Public Relations", slug: "pr", weight: 25 },
] as const

const REGULAR_MEMBERS = 15
const NUM_SPONSORS = 5
const NUM_EVENTS = 5
const NUM_YEARBOOKS = 2
const NUM_MEDIA = 5

const LOCAL_ADMIN = {
  email: "test@test.com",
  password: "test123",
}

async function main() {
  const payload = await getPayload({
    config: config,
  })

  payload.logger.info("Clearing collections sequentially...")

  for (const collectionSlug of collectionsToDeleteInOrder) {
    try {
      payload.logger.info(`  Clearing collection: ${collectionSlug}`)
      await payload.db.deleteMany({ collection: collectionSlug, where: {} })

      const collectionConfig = payload.collections[collectionSlug]?.config
      if (collectionConfig && collectionConfig.versions) {
        payload.logger.info(`  Clearing versions for collection: ${collectionSlug}`)
        await payload.db.deleteVersions({ collection: collectionSlug, where: {} })
      }
    } catch (error) {
      payload.logger.error(`Error clearing collection ${collectionSlug}: ${error}`)

      throw error
    }
  }

  payload.logger.info("Seeding demo admin user...")

  await payload.create({
    collection: "users",
    data: LOCAL_ADMIN,
  })

  payload.logger.info("Seeding media...")
  const mediaItems: Array<RequiredDataFromCollectionSlug<"media">> = []
  for (let i = 0; i < NUM_MEDIA; i++) {
    mediaItems.push(createMedia())
  }
  const seededMedia = await Promise.all(
    mediaItems.map((media) =>
      payload.create({
        collection: "media",
        data: media,
      }),
    ),
  )

  if (seededMedia.length === 0 && (REGULAR_MEMBERS > 0 || NUM_YEARBOOKS > 0)) {
    payload.logger.warn(
      "No media items were seeded. Some dependent items might fail or lack images.",
    )
  }

  payload.logger.info("Seeding domains...")
  const seededDomains = await Promise.all(
    domains.map((domain) =>
      payload.create({
        collection: "domains",
        data: {
          name: domain.label,
          slug: domain.slug,
          weight: domain.weight,
        },
      }),
    ),
  )

  payload.logger.info("Seeding members...")
  const membersToCreate: Array<RequiredDataFromCollectionSlug<"members">> = []

  const getRandomMediaId = () => {
    if (seededMedia.length === 0) return undefined
    return faker.helpers.arrayElement(seededMedia).id
  }

  membersToCreate.push(createMember({ role: "lead", profilePic: getRandomMediaId() }))
  membersToCreate.push(createMember({ role: "vice-lead", profilePic: getRandomMediaId() }))
  membersToCreate.push(createMember({ role: "executive", profilePic: getRandomMediaId() }))
  membersToCreate.push(createMember({ role: "tech-lead", profilePic: getRandomMediaId() }))

  const domainsToGetLeads = seededDomains.slice(0, Math.min(3, seededDomains.length))
  for (const domainDoc of domainsToGetLeads) {
    membersToCreate.push(
      createMember({
        role: "domain-lead",
        domainLed: domainDoc.id,
        domains: [domainDoc.id],
        profilePic: getRandomMediaId(),
      }),
    )
  }

  const webDomain = seededDomains.find((d) => d.slug === "web")
  if (webDomain) {
    const multipleRoles = createMember({
      role: "tech-lead",
      domainLed: webDomain.id,
      domains: [webDomain.id],
      profilePic: getRandomMediaId(),
    })
    multipleRoles.email = faker.internet.email()
    membersToCreate.push(multipleRoles)
  }

  for (let i = 0; i < REGULAR_MEMBERS; i++) {
    const randomDomains: number[] = []
    const count = faker.number.int({ min: 1, max: Math.min(3, seededDomains.length) })
    const shuffledDomains = faker.helpers.shuffle(seededDomains)
    for (let j = 0; j < count; j++) {
      if (shuffledDomains[j]) {
        randomDomains.push(shuffledDomains[j].id)
      }
    }
    membersToCreate.push(
      createMember({
        role: "member",
        domains: randomDomains.length > 0 ? randomDomains : undefined,
        profilePic: getRandomMediaId(),
      }),
    )
  }

  const seededMembers = await Promise.all(
    membersToCreate.map((member) =>
      payload.create({
        collection: "members",
        data: member,
      }),
    ),
  )

  payload.logger.info("Seeding sponsors...")
  const sponsorsToCreate: Array<RequiredDataFromCollectionSlug<"sponsors">> = []
  for (let i = 0; i < NUM_SPONSORS; i++) {
    sponsorsToCreate.push(createSponsor())
  }
  await Promise.all(
    sponsorsToCreate.map((sponsor) =>
      payload.create({
        collection: "sponsors",
        data: sponsor,
      }),
    ),
  )

  payload.logger.info("Seeding events...")
  const eventsToCreate: Array<RequiredDataFromCollectionSlug<"events">> = []
  for (let i = 0; i < NUM_EVENTS; i++) {
    eventsToCreate.push(createEvent())
  }
  await Promise.all(
    eventsToCreate.map((event) =>
      payload.create({
        collection: "events",
        data: event,
      }),
    ),
  )

  payload.logger.info("Seeding yearbook profiles...")
  const yearbookProfileAssignments: { year: number; profileIds: number[] }[] = []
  const currentYear = new Date().getFullYear()

  if (seededMembers.length > 0) {
    for (let i = 0; i < NUM_YEARBOOKS; i++) {
      const year = currentYear - i
      const randomMembers = faker.helpers.shuffle(seededMembers).slice(
        0,
        faker.number.int({
          min: Math.min(1, seededMembers.length),
          max: Math.min(10, seededMembers.length),
        }),
      )
      const profileIds: number[] = []

      if (randomMembers.length > 0 && seededMedia.length > 0) {
        for (const member of randomMembers) {
          const yearbookProfilePicId = getRandomMediaId()
          if (!yearbookProfilePicId) {
            payload.logger.warn(
              `Skipping yearbook profile for member ${member.name} due to missing media.`,
            )
            continue
          }
          const profile = await payload.create({
            collection: "yearbook-profiles",
            data: createYearbookProfile(member, yearbookProfilePicId),
          })
          profileIds.push(profile.id)
        }
      }
      if (profileIds.length > 0) {
        yearbookProfileAssignments.push({ year, profileIds })
      }
    }
  } else {
    payload.logger.warn("No members seeded, skipping yearbook profiles and yearbooks creation.")
  }

  payload.logger.info("Seeding yearbooks...")
  const yearbooksToCreate: Array<RequiredDataFromCollectionSlug<"yearbook">> = []
  for (const assignment of yearbookProfileAssignments) {
    yearbooksToCreate.push(createYearbook(assignment.year, assignment.profileIds))
  }
  if (yearbooksToCreate.length > 0) {
    await Promise.all(
      yearbooksToCreate.map((yearbook) =>
        payload.create({
          collection: "yearbook",
          data: yearbook,
        }),
      ),
    )
  }

  payload.logger.info("Database seeded successfully")
  payload.logger.info("Admin Dashboard Account Details:")
  payload.logger.info(`Email: ${LOCAL_ADMIN.email}`)
  payload.logger.info(`Password: ${LOCAL_ADMIN.password}`)
}

const createMember = ({
  role,
  domainLed,
  domains,
  profilePic,
}: {
  role: Member["role"]
  domainLed?: number
  domains?: number[]
  profilePic?: number
}): RequiredDataFromCollectionSlug<"members"> => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    rollNumber: faker.number.int({ min: 1000000, max: 9999999 }).toString(),
    phoneNumbers: [{ number: faker.phone.number() }],
    linkedin: `https://linkedin.com/in/${faker.internet.username({ firstName, lastName })}`,
    github: `https://github.com/${faker.internet.username({ firstName, lastName })}`,
    instagram: `https://instagram.com/${faker.internet.username({ firstName, lastName })}`,
    role: role,
    domainLed: domainLed,
    domain: domains,
    profilePic: profilePic,
    isActive: faker.datatype.boolean(),
  }
}

const createMedia = (): RequiredDataFromCollectionSlug<"media"> => {
  const width = faker.number.int({ min: 200, max: 2000 })
  const height = faker.number.int({ min: 200, max: 2000 })
  const filename = faker.system.commonFileName("jpg")
  return {
    alt: faker.lorem.words(3),
    filename: filename,
    mimeType: "image/jpeg",
    filesize: faker.number.int({ min: 1000, max: 5000000 }),
    url: faker.image.url({ width, height }),
    thumbnailURL: faker.image.url({ width: 150, height: 150 }),
  }
}

const createSponsor = (): RequiredDataFromCollectionSlug<"sponsors"> => {
  return {
    name: faker.company.name(),
    site: faker.internet.url(),

    filename: faker.system.commonFileName("png"),
    mimeType: "image/png",
    filesize: faker.number.int({ min: 1000, max: 5000000 }),
    url: faker.image.url({ width: 200, height: 200 }),
    thumbnailURL: faker.image.url({ width: 150, height: 150 }),
  }
}

const createEvent = (): RequiredDataFromCollectionSlug<"events"> => {
  const width = faker.number.int({ min: 200, max: 2000 })
  const height = faker.number.int({ min: 200, max: 2000 })
  const filename = faker.system.commonFileName("jpg")
  return {
    name: faker.lorem.words(3),
    bgColor: faker.color.rgb({ format: "hex", casing: "lower" }),
    date: faker.date.future().toISOString(),
    numParticipant: faker.number.int({ min: 10, max: 500 }),
    link: faker.internet.url(),
    featured: false,
    filename: filename,
    mimeType: "image/jpeg",
    filesize: faker.number.int({ min: 1000, max: 5000000 }),
    url: faker.image.url({ width, height }),
  }
}

const createYearbook = (
  year: number,
  profileIds: number[],
): RequiredDataFromCollectionSlug<"yearbook"> => {
  return {
    year: year,
    profiles: profileIds,
  }
}

const createYearbookProfile = (
  member: Member,
  mediaId: number,
): RequiredDataFromCollectionSlug<"yearbook-profiles"> => {
  return {
    member: member.id,
    name: member.name,
    yearbookProfilePic: mediaId,
    role: member.role,
    testimonial: faker.lorem.paragraph(),
  }
}

main()
  .then(() => process.exit(0))
  .catch(() => {
    console.error("Seeding failed. Try again...")
    process.exit(1)
  })
