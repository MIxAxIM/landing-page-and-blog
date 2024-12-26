import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { type CourseModuleOverview, type ModuleSLT } from "~/types/db";
import DialogForm from "~/components/form/dialog-form";

export default function DialogSLTDelete({
  sltDeleteDialogOpen,
  setSltDeleteDialogOpen,
  slt,
  module,
  courseCode,
}: {
  sltDeleteDialogOpen: boolean;
  setSltDeleteDialogOpen: (open: boolean) => void;
  slt: ModuleSLT;
  module: CourseModuleOverview;
  courseCode: string;
}) {
  const ctx = api.useUtils();

  const { handleSubmit } = useForm();

  const { mutate: sltDelete, isLoading: isLoadingDelete } =
    api.slt.delete.useMutation({
      onSuccess: () => {
        setSltDeleteDialogOpen(false);
        toast.success("Student Learning Target deleted");
        void ctx.slt.getModuleSLTs.invalidate({
          courseCode: courseCode,
          moduleCode: module.moduleCode,
        });
        void ctx.module.getCourseModuleOverviews.invalidate({
          courseCode: courseCode,
        });
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors;
        if (errorMessage) {
          toast.error("Some SLT inputs are missing or invalid");
        } else {
          toast.error(e.message ?? "Cannot delete SLT");
        }
      },
    });

  function onSubmit() {
    if (slt) {
      sltDelete({
        id: slt.id,
      });
    }
  }

  return (
    <DialogForm
      openButton="delete"
      openButtonIntent="dialog"
      title="Confirm Delete Student Learning Target"
      icon="delete"
      buttonLabel="Delete SLT"
      buttonLoading={isLoadingDelete}
      buttonDisabled={isLoadingDelete}
      handleSubmit={handleSubmit(() => onSubmit())}
      isOpen={sltDeleteDialogOpen}
      setIsOpen={setSltDeleteDialogOpen}
    >
      <p>Are you sure?</p>
    </DialogForm>
  );
}
