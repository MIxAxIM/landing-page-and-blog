import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { type Course, type CourseOnChainInstance } from "~/types/db";
import { useSession } from "next-auth/react";
import DialogCourseOnChain from "./dialogs/DialogCourseOnChain";
import { type Network } from "@prisma/client";
import useNetworkCourseConfig from "~/hooks/onchain/useNetworkCourseConfig";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default function ShowCourseOnchain({
  course,
  network,
}: {
  course: Course;
  network: Network;
}) {
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const [selectedOnChainInstance, setSelectedOnchainInstance] = useState<
    CourseOnChainInstance | undefined
  >(undefined);

  const { data: sessionData } = useSession();
  const isOwner = course?.createdById === sessionData?.user?.creatorId;

  const { courseOnchain } = useNetworkCourseConfig(
    course?.courseCode ?? "",
    network,
  );

  useEffect(() => {
    if (courseOnchain) {
      setSelectedOnchainInstance(courseOnchain);
    }
  }, [courseOnchain]);

  return (
    <>
      {selectedOnChainInstance && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <p className="text-2xl font-bold">
              Andamio Network Configuration (Network:{" "}
              {selectedOnChainInstance.network})
            </p>
            {isOwner && (
              <div className="">
                <Button
                  onClick={() => {
                    setShowDialog(true);
                  }}
                >
                  Update
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1">
              <div className="my-2 items-center gap-x-2 font-mono leading-5 text-foreground">
                <div className="text-xs font-light text-foreground">
                  CourseCreatorNFTPolicyID
                </div>
                <span className="break-normal text-sm">
                  {selectedOnChainInstance.CourseCreatorNFTPolicyID}
                </span>
              </div>


              <div className="my-2 items-center gap-x-2 font-mono leading-5 text-foreground">
                <div className="text-xs font-light text-foreground">
                  Instance ID
                </div>
                <span className="break-normal text-sm">
                  {selectedOnChainInstance.id}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="mt-5">
        <DialogCourseOnChain
          dialogOpen={showDialog}
          setDialogOpen={setShowDialog}
          course={course}
          courseOnchain={selectedOnChainInstance}
          selectedNetwork={network}
        />
      </div>
    </>
  );
}
