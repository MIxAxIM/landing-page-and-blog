import { type FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import FormInput from "~/components/form/form-input";
import { useCallback, useEffect, useState } from "react";
import DialogForm from "~/components/form/dialog-form";
import useCourseModuleOverviews from "~/hooks/db/course/useCourseModuleOverviews";

export default function DialogImportModule({
  courseCode,
  courseId,
}: {
  courseCode: string;
  courseId: string;
}) {
  const ctx = api.useUtils();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { refetchCourseModules } = useCourseModuleOverviews(courseCode);

  const { mutate: importCourseModule, isLoading: isLoadingCreate } =
    api.module.copyModuleToCourse.useMutation({
      onSuccess: () => {
        toast.success("Module imported successfully");
        void ctx.module.getCourseModuleOverviews.invalidate({
          courseCode: courseCode,
        });
        void refetchCourseModules();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors;
        if (errorMessage) {
          toast.error("Cannot import module");
        } else {
          toast.error("Cannot import module");
        }
      },
    });

  const FormSchema = z.object({
    courseModuleId: z.string().min(4),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      courseModuleId: "",
    },
  });

  function onSubmit(data: FieldValues) {
    importCourseModule({
      originalCourseModuleId: data.courseModuleId,
      targetCourseId: courseId,
    });
  }
  const resetForm = useCallback(() => {
    form.reset({
      courseModuleId: "",
    });
  }, [form]);

  useEffect(() => {
    resetForm();
  }, [isLoadingCreate, resetForm]);

  return (
    <Form {...form}>
      <DialogForm
        openButton="Import Course Module"
        openButtonIntent="default"
        title="Import Existing Module"
        description="Import Course Module"
        icon="plus"
        buttonLabel="Import"
        buttonLoading={isLoadingCreate}
        buttonDisabled={isLoadingCreate}
        handleSubmit={form.handleSubmit(onSubmit)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <p></p>

        <div className="mt-4 grid grid-cols-1 gap-y-4">
          <FormInput
            name="courseModuleId"
            label="Enter Existing Module Id"
            form={form}
          />
        </div>
      </DialogForm>
    </Form>
  );
}
