import useGlobalStateDatum from "~/hooks/cardano-indexer-api/useGlobalStateDatum";
import LoadingCircle from "~/ui/studio/components/ContentEditor/ui/icons/loading-circle";
import CurrentCourseListItem from "./CurrentCourseListItem";
import { type LearnerAssignment } from "~/hooks/db/course/useLearnerAssignmentStatuses";

// TODO: Rename

export default function LearnerCourses({
  alias,
  learnerAssignments,
}: {
  alias: string;
  learnerAssignments: LearnerAssignment[];
}) {
  const {
    globalStateDatum,
    isLoadingGlobalStateDatum,
    isErrorGlobalStateDatum,
    errorGlobalStateDatum,
  } = useGlobalStateDatum(alias);
  if (isLoadingGlobalStateDatum) {
    return <LoadingCircle />;
  }
  if (isErrorGlobalStateDatum) {
    return (
      <div>
        <pre>{JSON.stringify(errorGlobalStateDatum, null, 2)}</pre>
      </div>
    );
  }
  return (
    <>
      <div className="mb-3 flex w-full flex-col rounded-md border border-primary p-3">
        <h2>Current Courses</h2>
        <p>You are currently enrolled in these courses:</p>
        {globalStateDatum &&
          globalStateDatum.TokenInfos.map((c, i) => {
            if (c.Minted) {
              return (
                <div key={i}>
                  <CurrentCourseListItem
                    lsCs={c.LsCs}
                    learnerAssignments={learnerAssignments}
                    key={i}
                    alias={globalStateDatum.UserName}
                  />
                </div>
              );
            }
          })}
      </div>
      <div className="mb-3 flex w-full flex-col rounded-md border border-primary p-3">
        <h2>Previous Courses</h2>
        <p>You have completed the following courses:</p>
        {globalStateDatum &&
          globalStateDatum.TokenInfos.map((c, i) => {
            if (!c.Minted) {
              return (
                <div key={i}>
                  <p>{c.LsCs}</p>
                  <div>
                    <h3>Completed Assignments</h3>
                    {c.AssignmentList.map((a, i) => (
                      <p key={i}>{a}</p>
                    ))}
                  </div>
                </div>
              );
            }
          })}
        <p>
          Todo: Show completion status as Modules complete out of total Modules
        </p>
      </div>
    </>
  );
}
