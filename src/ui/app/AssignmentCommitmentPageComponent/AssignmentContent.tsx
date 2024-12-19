import RenderEditor from "~/components/editor/components/render/RenderEditor";
import useAssignmentNetworkStatus from "~/hooks/cardano-indexer-api/course/useAssignmentNetworkStatus"
import { Assignment } from "~/types/db";

export default function AssignmentContent(
  { assignment }: {
    assignment: Assignment
  }
) {
  if (!assignment) return null

  const editor = RenderEditor({
    editable: false,
    initialContent: assignment.contentJson as object,
  });

  return (
    <div>
      {editor}
    </div>
  )
}
