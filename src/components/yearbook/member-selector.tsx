"use client"

import { MEMBER_ROLES } from "@/collections/Members"
import type { Media, Member } from "@/payload-types"
import { RelationshipField, useField, useForm } from "@payloadcms/ui"
import type { RelationshipFieldClientComponent } from "payload"
import { useCallback, useEffect } from "react"

export const YearbookMemberSelectorClient: RelationshipFieldClientComponent = (props) => {
  const { dispatchFields, getField } = useForm()
  const { value: memberId } = useField<number>({ path: props.path })

  const populateYearbookFields = useCallback(
    async (memberId: number) => {
      try {
        const response = await fetch(`/api/members/${memberId}?depth=1`)
        if (!response.ok) {
          console.error("Failed to fetch member details:", response.statusText)
          return
        }
        const member = (await response.json()) as Member

        if (member) {
          const yearbookNameState = getField("name")
          const yearbookRoleState = getField("role")
          const yearbookPicState = getField("yearbookProfilePic")

          if (!yearbookNameState?.value && member.name) {
            dispatchFields({ type: "UPDATE", path: "name", value: member.name })
          }

          if (!yearbookRoleState?.value && member.role) {
            const roleLabel = MEMBER_ROLES.find((r) => r.value === member.role)?.label.toString()
            dispatchFields({
              type: "UPDATE",
              path: "role",
              value: `EX ${roleLabel?.toUpperCase()}`,
            })
          }

          if (!yearbookPicState?.value && member.profilePic) {
            const picId =
              typeof member.profilePic === "number"
                ? member.profilePic
                : (member.profilePic as Media)?.id
            if (picId) {
              dispatchFields({
                type: "UPDATE",
                path: "yearbookProfilePic",
                value: picId,
              })
            }
          }
        }
      } catch (error) {
        console.error("Error auto-populating yearbook fields:", error)
      }
    },
    [dispatchFields, getField],
  )

  useEffect(() => {
    if (memberId) {
      populateYearbookFields(memberId)
    }
  }, [memberId, populateYearbookFields])

  return <RelationshipField {...props} />
}
