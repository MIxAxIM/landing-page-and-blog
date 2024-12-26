export default function AssignmentDetails({
  courseTitle,
  moduleTitle,
  assignmentTitle,
  assignmentCode,
}: {
  courseTitle: string;
  moduleTitle: string;
  assignmentTitle: string;
  assignmentCode: string;
}) {
  return (
    <div className="col-span-4 rounded-md border border-secondary-foreground p-3">
      <p>
        <span className="font-mono text-xs uppercase">Course:</span>{" "}
        {courseTitle}
      </p>
      <p>
        <span className="font-mono text-xs uppercase">Module:</span>{" "}
        {moduleTitle}
      </p>
      <p>
        <span className="font-mono text-xs uppercase">Assignment:</span>{" "}
        {assignmentTitle}
      </p>
      <p>
        <span className="font-mono text-xs uppercase">Code:</span>{" "}
        {assignmentCode}
      </p>
    </div>
  );
}
