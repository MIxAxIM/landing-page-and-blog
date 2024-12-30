import { memo } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { Task, Escrow } from "~/types/db";
import FormInput from "~/components/form/form-input";
import FormTextArea from "~/components/form/form-textarea";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { TaskStatus } from "@prisma/client";
import { useTerminology } from "~/contexts/terminology-context";
import { type FormValues } from "./config";

interface TaskFormViewProps {
  form: UseFormReturn<FormValues>;
  escrow: Escrow;
  isLoading: boolean;
}

export const TaskFormView = memo(({
  form,
  escrow,
  isLoading,
}: TaskFormViewProps) => {

  const { translateCaps, translate } = useTerminology()

  return (
    <div className="grid gap-4 py-4">
      <p>in {escrow.title}</p>
      <div className="grid grid-cols-4 gap-5">
        <div className="col-span-3">
          <FormInput
            name="title"
            label={`${translateCaps('task')} Title`}
            form={form}
            placeholder={`Enter a title for this ${translate('task')}`}
            disabled={isLoading}
          />
          <FormTextArea
            name="description"
            label="Description"
            form={form}
            placeholder="Enter description"
            height={150}
            disabled={isLoading}
          />
        </div>

        {/* Rest of the form JSX */}
      </div>
    </div>
  );
});

interface TaskDisplayViewProps {
  task: Task;
  isUpdating: boolean;
  onRevertToDraft: () => void;
}

export const TaskDisplayView = memo(({
  task,
  isUpdating,
  onRevertToDraft,
}: TaskDisplayViewProps) => {
  const { translateCaps, translate } = useTerminology()
  return (
    <div className="space-y-4">
      {task?.status === TaskStatus.APPROVED && (
        <>
          <Alert>
            <AlertTitle>{translateCaps('task')} is locked</AlertTitle>
            <AlertDescription>
              This {translate('task')} is approved and its content is locked.
              To make changes, you must first revert it to draft status.
            </AlertDescription>
          </Alert>
          <Button
            onClick={onRevertToDraft}
            disabled={isUpdating}
            className="w-full"
          >
            Revert to Draft
          </Button>
        </>
      )}
    </div>
  );
});

TaskFormView.displayName = 'TaskFormView';
TaskDisplayView.displayName = 'TaskDisplayView';
