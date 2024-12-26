import { useState } from "react";
import { Button } from "~/components/ui/button";
import { type Course } from "~/types/db";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import DialogCourseManager from "~/ui/studio/course/components/dialogs/DialogCourseManager";
import { Card, CardContent, CardFooter, CardTitle } from "~/components/ui/card";

export default function ListCourseManagers({ course }: { course: Course }) {
  const [showAddManagerDialog, setShowAddManagerDialog] =
    useState<boolean>(false);

  const ctx = api.useUtils();

  const { mutate: removeCourseManager, isLoading } =
    api.course.removeCourseManager.useMutation({
      onSuccess: () => {
        toast.success("Course manager remove!");
        void ctx.course.getCoursesByOwner.invalidate();
      },
      onError: (e) => {
        // const errorMessage = e.data?.zodError?.fieldErrors;
        toast.error("Something went wrong. Please try again.");
        console.log(e);
      },
    });

  const { data: sessionData } = useSession();
  const isOwner = course?.createdById === sessionData?.user?.creatorId;

  return (
    <>
      <Card>
        <CardTitle className="my-5">Course Contributors</CardTitle>
        <CardContent className="my-5">
          {course?.contributors?.map((contributor) => (
            <div
              key={contributor.id}
              className="flex w-full flex-row items-center justify-between"
            >
              <div className="flex items-center">
                {contributor.user.image && (
                  <div className="h-11 w-11 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="h-11 w-11 rounded-full"
                      src={contributor.user.image}
                      alt=""
                    />
                  </div>
                )}
                <div className="ml-4">
                  <div className="font-medium text-foreground">
                    {contributor.user.name}
                  </div>
                </div>
              </div>
              {isOwner && (
                <Button
                  color="red"
                  onClick={() =>
                    removeCourseManager({
                      courseCode: course.courseCode,
                      userId: contributor.id,
                    })
                  }
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    <>Remove</>
                  )}
                </Button>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter className="my-0">
          <DialogCourseManager
            dialogOpen={showAddManagerDialog}
            setDialogOpen={setShowAddManagerDialog}
            course={course}
          />
        </CardFooter>
      </Card>
    </>
  );
}
