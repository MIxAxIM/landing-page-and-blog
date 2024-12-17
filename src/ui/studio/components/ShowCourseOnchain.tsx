import { Button } from "~/components/ui/button";
import { type Course, type CourseOnChainInstance } from "~/types/db";
import { useSession } from "next-auth/react";
import { type Network } from "@prisma/client";
import useNetworkCourseConfig from "~/hooks/cardano-indexer-api/course/useNetworkCourseConfig";

export default function ShowCourseOnchain({
  course,
  network,
}: {
  course: Course;
  network: Network;
}) {

  const { data: sessionData } = useSession();
  const isOwner = course?.createdById === sessionData?.user?.creatorId;

  const { courseOnchain } = useNetworkCourseConfig(
    course?.courseCode ?? "",
    network,
  );

  return (
    <div className="bg-primary text-primary-foreground p-5 flex w-full col-span-10 justify-between">
      {courseOnchain ? (
        <p>
          CourseCreatorNFTPolicyID:{" "}{courseOnchain.CourseCreatorNFTPolicyID}
        </p>
      ) : (
        <div>
          <p>Ready to publish this course on the Andamio Network?</p>
          <Button>
            Publish Course on the Andamio Network
          </Button>
        </div>
      )}
    </div>
  );
}
