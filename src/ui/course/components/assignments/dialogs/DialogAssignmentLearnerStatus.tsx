import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "~/components/ui/form";
import DialogForm from "~/components/form/dialog-form";
import { type AssignmentCommitment } from "~/types/db";
import { useSession } from "next-auth/react";
import { AssignmentStatus } from "@prisma/client";
import FormTextArea from "~/components/form/form-textarea";
import FormSelectRadioGroup from "~/components/form/form-select-radio-group";

export default function DialogAssignmentLearnerStatus({
  assignmentId,
  assignmentCommitment,
}: {
  assignmentId: string;
  assignmentCommitment?: AssignmentCommitment;
}) {
  const ctx = api.useUtils();
  const { update: updateSession } = useSession();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutate: create, isLoading: isLoadingCreate } =
    api.assignmentStatus.setAssignmentStatus.useMutation({
      onSuccess: () => {
        setIsOpen(false);
        toast.success("Assignment Completed!");
        void ctx.assignmentStatus.getLearnerCommitments.invalidate();
        void ctx.assignmentStatus.getAssignmentCommitments.invalidate();
        void updateSession();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors;
        if (errorMessage) {
          toast.error("Some inputs are missing or invalid");
        } else {
          toast.error("Error completing Assignment");
        }
      },
    });

  const { mutate: updateEvidence, isLoading: isLoadingUpdate } =
    api.assignmentStatus.updateLearnerNotes.useMutation({
      onSuccess: () => {
        setIsOpen(false);
        toast.success("Successfully added personal notes to Assignment");
        void ctx.assignmentStatus.getLearnerCommitments.invalidate();
        void ctx.assignmentStatus.getAssignmentCommitments.invalidate();
        void updateSession();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors;
        if (errorMessage) {
          toast.error(JSON.stringify(errorMessage));
        } else {
          toast.error("Error updating the Assignment");
        }
      },
    });

  const FormSchema = z.object({
    learnerNotes: z.string().optional(),
    status: z.nativeEnum(AssignmentStatus),
    // Add favorite star that makes the assignment show up on dashboard
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      learnerNotes: assignmentCommitment?.learnerNotes ?? "",
      status: assignmentCommitment?.status ?? "IN_PROGRESS",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (assignmentCommitment) {
      updateEvidence({
        assignmentCommitmentId: assignmentCommitment.id,
        learnerNotes: data.learnerNotes ?? "",
        status: data.status,
      });
    } else {
      create({
        assignmentId: assignmentId,
        learnerNotes: data.learnerNotes ?? "",
        status: data.status,
      });
    }
  }
  const resetForm = useCallback(() => {
    if (assignmentId) {
      form.reset({
        learnerNotes: assignmentCommitment?.learnerNotes ?? "",
        status: assignmentCommitment?.status ?? "SAVE_FOR_LATER",
      });
    }
  }, [assignmentId, assignmentCommitment]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  return (
    <Form {...form}>
      <DialogForm
        openButton={
          assignmentCommitment ? "Update Status" : "Set Assignment Status"
        }
        openButtonIntent="dialog"
        title={assignmentCommitment ? "Update Status" : "Set Assignment Status"}
        description="You can use this space to write any personal notes about this Assignment. You will be able to review these notes on your dashboard. These notes will not be shared publicly."
        buttonLabel={
          assignmentCommitment ? "Update Status" : "Set Assignment Status"
        }
        buttonLoading={isLoadingCreate || isLoadingUpdate}
        buttonDisabled={isLoadingCreate || isLoadingUpdate}
        handleSubmit={form.handleSubmit(onSubmit)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <div className="mt-4 grid grid-cols-1 gap-4">
          <FormTextArea
            name="learnerNotes"
            label="What do you want to remember about this assignment?"
            defaultValue={form.getValues("learnerNotes")}
            form={form}
            height={300}
          />
          <FormSelectRadioGroup
            name="status"
            label="Set Assignment Status"
            form={form}
            options={Object.keys(AssignmentStatus).map((type) => {
              let _label = "Not Started";
              if (type === "SAVE_FOR_LATER") _label = "Save for Later";
              if (type === "IN_PROGRESS") _label = "In Progress";
              if (type === "COMMITMENT") _label = "Commitment";
              if (type === "COMPLETE") _label = "Complete!";
              if (type === "NETWORK_READY") _label = "Ready for Credential";
              return {
                value: type,
                label: _label,
              };
            })}
          />
        </div>
      </DialogForm>
    </Form>
  );
}
