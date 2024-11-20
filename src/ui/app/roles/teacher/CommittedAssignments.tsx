import useAssignmentDatums from "~/hooks/onchain/useAssignmentDatums";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import LoadingCircle from "~/ui/studio/components/ContentEditor/ui/icons/loading-circle";
import useCourseByPolicyId from "~/hooks/onchain/useCourseByPolicyId";
import { useAccessToken } from "~/hooks/onchain/useAccessToken";
import AcceptDenyAssignmentDialog from "~/components/transactions/dialogs/AcceptDenyAssignmentDialog";

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
                  {assignment.CourseState.CsdUserName}
                </TableCell>
                <TableCell>{assignment.CommittedAssignmentId}</TableCell>
                <TableCell>{assignment.StudentAssignmentInfo}</TableCell>
                <TableCell>
                  {assignment.StudentAssignmentInfo ? (
                    <AcceptDenyAssignmentDialog
                      key={i}
                      courseNftPolicy={courseNftPolicy}
                      userAccessTokenUnit={accessTokenAsset!.unit}
                      studentAlias={assignment.CourseState.CsdUserName}
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
                      studentAlias={assignment.CourseState.CsdUserName}
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
