import useAssignmentDatums from "~/hooks/cardano-indexer-api/useAssignmentDatums";

export default function CommittedAssignment({
  courseNftPolicy,
  alias,
}: {
  courseNftPolicy: string;
  alias: string;
}) {
  const { assignmentDatum } = useAssignmentDatums(courseNftPolicy, alias);

  return (
    assignmentDatum && (
      <div>
        {courseNftPolicy} - {assignmentDatum.CommittedAssignmentId} -{" "}
        {assignmentDatum.StudentAssignmentInfo
          ? assignmentDatum.StudentAssignmentInfo
          : "No Assignment Info"}
      </div>
    )
  );
}
