
import { useOrganizationTreasuries } from "~/hooks/organization/useOrganizationTreasuries";

export default function CoursesList({ organizationId }: { organizationId: string }) {

  const { treasuries } = useOrganizationTreasuries(organizationId);
  return (
    <div>
      <h1>Organization Treasuries</h1>
      <pre>{JSON.stringify(treasuries, null, 2)}</pre>
    </div>
  )
}
