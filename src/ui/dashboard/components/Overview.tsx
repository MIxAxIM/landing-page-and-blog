import { type AggregateUserInfoResponse } from "@andamiojs/datum-utils";
import Loading from "~/components/common/loading";

export function Overview({
  aggregateUserInfo,
  isLoadingAggregateUserInfo,
}: {
  aggregateUserInfo: AggregateUserInfoResponse | undefined;
  isLoadingAggregateUserInfo: boolean;
}) {
  return (
    <div className="explore-course-bar">
      <div className="category">
        {isLoadingAggregateUserInfo ? (
          <Loading />
        ) : (
          <div className="flex gap-x-40 max-w-full">
            <div>
              <h3>Andamio ID: {aggregateUserInfo?.alias}</h3>
              <h3>Bio: {aggregateUserInfo?.userInfo}</h3>
            </div>
            <div className="flex flex-col gap-y-4">
              <div>
                <h3>
                  course Enrolled: {aggregateUserInfo?.courses.ongoing.length}
                </h3>
                <h3>
                  course Completed:{" "}
                  {aggregateUserInfo?.courses.completed.length}
                </h3>
              </div>
              <div>
                <h3>
                  Projects Joined: {aggregateUserInfo?.projects.ongoing.length}
                </h3>
                <h3>
                  Projects Closed:{" "}
                  {aggregateUserInfo?.projects.completed.length}
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

