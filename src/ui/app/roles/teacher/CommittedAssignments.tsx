import useAssignmentDatums from "~/hooks/cardano-indexer-api/course/useAssignmentDatums";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import LoadingCircle from "~/components/editor/ContentEditor/ui/icons/loading-circle";
import useCourseByPolicyId from "~/hooks/cardano-indexer-api/course/useCourseByPolicyId";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import AcceptDenyAssignmentDialog from "~/components/cardano/tx/course-creator/accept-deny-assignment/AcceptDenyAssignmentDialog";

export default function CommittedAssignments({
  courseNftPolicy,
  showCourseDetails,
}: {
  courseNftPolicy: string;
  showCourseDetails?: boolean;
}) {
  const { listCourseAssignmentDatums } = useAssignmentDatums(courseNftPolicy);

  const { accessTokenAsset } = useAccessToken();

  const { courseInfo, isLoadingCourseInfo } =
    useCourseByPolicyId(courseNftPolicy);

  if (isLoadingCourseInfo) return <LoadingCircle />;

  return (
    <div className="my-5 flex w-full flex-col border-t border-accent pt-5">
      {showCourseDetails && !!courseInfo && (
        <h2>{courseInfo.title}</h2>
      )}
      <h3>
        Review Student Assignments
      </h3>

      {listCourseAssignmentDatums && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alias</TableHead>
              <TableHead>Assignment</TableHead>
              <TableHead>Assignment Info</TableHead>
              <TableHead>Accept</TableHead>
              <TableHead>Deny</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-left">
            {listCourseAssignmentDatums.map((assignment, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">
                  {assignment.CourseUserName}
                </TableCell>
                <TableCell>{assignment.CommittedAssignmentId}</TableCell>
                <TableCell>{assignment.StudentAssignmentInfo}</TableCell>
                <TableCell>
                  {assignment.StudentAssignmentInfo ? (
                    <AcceptDenyAssignmentDialog
                      key={i}
                      courseNftPolicy={courseNftPolicy}
                      userAccessTokenUnit={accessTokenAsset!.unit}
                      studentAlias={assignment.CourseUserName}
                      decision="accept"
                    />
                  ) : (
                    "No Assignment Info"
                  )}
                </TableCell>
                <TableCell>
                  {assignment.StudentAssignmentInfo ? (
                    <AcceptDenyAssignmentDialog
                      key={i}
                      courseNftPolicy={courseNftPolicy}
                      userAccessTokenUnit={accessTokenAsset!.unit}
                      studentAlias={assignment.CourseUserName}
                      decision="deny"
                    />
                  ) : (
                    "No Assignment Info"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
