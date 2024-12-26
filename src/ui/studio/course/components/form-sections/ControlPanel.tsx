import React from "react";
import { Button } from "~/components/ui/button";
import {
  CrossCircledIcon,
  SymbolIcon,
  ExclamationTriangleIcon,
  CheckCircledIcon,
  GlobeIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

export default function ControlPanel({
  editContent,
  isLoadingUpdate,
  onCancel,
  courseCode,
  moduleCode,
  contentPath,
  live,
}: {
  editContent: boolean;
  isLoadingUpdate: boolean;
  onCancel: () => void;
  courseCode: string;
  moduleCode: string;
  contentPath: string;
  live: boolean | null;
}) {
  const publishedLink = `/course/${courseCode}/${moduleCode}/${contentPath}`;

  return (
    <div className="grid grid-cols-4 gap-5 px-5">
      <div className="flex h-[30px] w-[30px] items-center justify-center">
        <TooltipProvider>
          <>
            {editContent && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={isLoadingUpdate || !editContent}
                    size="bigIcon"
                    intent="ghost"
                  >
                    <ExclamationTriangleIcon
                      className="text-warning"
                      width="22"
                      height="22"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to save your work</p>
                </TooltipContent>
              </Tooltip>
            )}
          </>
        </TooltipProvider>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={(e) => {
                e.preventDefault();
                window.open(publishedLink, "_blank");
              }}
              size="bigIcon"
              intent="ghost"
            >
              <GlobeIcon
                width="22"
                height="22"
                className={`rounded-full ${live ? "bg-success-foreground text-success" : "bg-background text-primary"}`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {live
                ? "This content is published. Click here to view in the live course."
                : "This content is not published. Click here to view a preview."}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="col-start-3 flex flex-row justify-end">
        <Sheet>
          <SheetTrigger asChild>
            <div className="flex h-[30px] w-[30px] items-center justify-center">
              <QuestionMarkCircledIcon
                className="rounded-full bg-background text-primary"
                width="22"
                height="22"
              />
            </div>
          </SheetTrigger>
          <SheetContent className="p-5">
            <h3>Help</h3>
            <p className="prose">
              Can create custom components for this that are easy to edit -
              would be passed as props
            </p>
            <h3>Learn More</h3>
            <p className="prose">Andamio 101 Course</p>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex h-[30px] w-[30px] items-center justify-center">
        {isLoadingUpdate ? (
          <SymbolIcon className="animate-spin" width="22" height="22" />
        ) : (
          <TooltipProvider>
            {editContent ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button intent="ghost" size="bigIcon" onClick={onCancel}>
                    <CrossCircledIcon width="22" height="22" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cancel Changes</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger>
                  <CheckCircledIcon
                    className="rounded-full bg-success-foreground text-success"
                    width="22"
                    height="22"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your work is saved</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
