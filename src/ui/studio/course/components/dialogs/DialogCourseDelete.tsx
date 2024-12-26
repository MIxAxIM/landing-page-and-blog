import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import DialogForm from "~/components/form/dialog-form";
import { useRouter } from "next/router";

export default function DialogCourseDelete({
  courseDeleteDialogOpen,
  setCourseDeleteDialogOpen,
  courseId,
}: {
  courseDeleteDialogOpen: boolean;
  setCourseDeleteDialogOpen: (open: boolean) => void;
  courseId: string;
}) {
  const ctx = api.useUtils();

  const { handleSubmit } = useForm();
  const router = useRouter();

  const { mutate: courseDelete, isLoading: isLoadingDelete } =
    api.course.delete.useMutation({
      onSuccess: () => {
        setCourseDeleteDialogOpen(false);
        toast.success("Course deleted");
        void ctx.course.getCoursesByOwner.invalidate();
        void router.push("/studio");
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors;
        if (errorMessage) {
          toast.error("Cannot delete this Course");
        } else {
          toast.error(e.message ?? "Cannot delete Course");
        }
      },
    });

  function onSubmit() {
    if (courseId) {
      courseDelete({
        id: courseId,
      });
    }
  }

  return (
    <DialogForm
      openButton="Delete Course"
      openButtonIntent="delete"
      title="Are you sure you want to delete this course?"
      buttonLabel="This action cannot be undone"
      buttonLoading={isLoadingDelete}
      buttonDisabled={isLoadingDelete}
      handleSubmit={handleSubmit(() => onSubmit())}
      isOpen={courseDeleteDialogOpen}
      setIsOpen={setCourseDeleteDialogOpen}
    >
      <p>Confirm</p>
    </DialogForm>
  );
}
