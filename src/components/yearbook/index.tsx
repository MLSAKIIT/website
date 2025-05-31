import type { RelationshipFieldServerComponent } from "payload"
import { YearbookMemberSelectorClient } from "./member-selector"

export const YearbookMemberSelectorServer: RelationshipFieldServerComponent = ({
  clientField,
  path,
  schemaPath,
  permissions,
}) => {
  return (
    <YearbookMemberSelectorClient
      field={clientField}
      path={path}
      schemaPath={schemaPath}
      permissions={permissions}
    />
  )
}
