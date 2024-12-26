import { type FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { type CourseModuleOverview } from "~/types/db";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import FormInput from "~/components/form/form-input";
import { useCallback, useEffect } from "react";
import FormSelect from "~/components/form/form-select";
import useCourseModuleOverviews from "~/hooks/db/course/useCourseModuleOverviews";
import Loading from "~/components/common/loading";
import DialogForm from "~/components/form/dialog-form";

export default function DialogSLT({
  sltDialogOpen,
  setSltDialogOpen,
  courseCode,
  currentModule,
}: {
  sltDialogOpen: boolean;
  setSltDialogOpen: (open: boolean) => void;
  courseCode: string;
  currentModule: CourseModuleOverview;
}) {
  const ctx = api.useUtils();

  const { courseModuleOverviews, isLoadingCourseModules } =
    useCourseModuleOverviews(courseCode);

  const { mutate: sltCreate, isLoading: isLoadingCreate } =
    api.slt.create.useMutation({
      onSuccess: (data) => {
        setSltDialogOpen(false);
        toast.success("Student Learning Target  created!");
        const _module = courseModuleOverviews?.find(
          (c) => c.id === data.moduleId,
        );
        void ctx.slt.getModuleSLTs.invalidate({
          courseCode: courseCode,
          moduleCode: _module?.moduleCode,
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
          toast.error("SLT ID taken. Please try again.");
        }
      },
    });

  const FormSchema = z.object({
    sltText: z.string().min(4),
    moduleId: z.string().min(1),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sltText: "",
      moduleId: module.id,
    },
  });

  function onSubmit(data: FieldValues) {
    sltCreate({
      moduleId: currentModule.id,
      moduleIndex: currentModule.slts.length + 1,
      sltText: data.sltText,
    });
  }
  const resetForm = useCallback(() => {
    form.reset({
      sltText: "",
      moduleId: currentModule.id ?? "",
    });
  }, [currentModule]);

  useEffect(() => {
    resetForm();
  }, [sltDialogOpen, isLoadingCreate, resetForm]);

  return (
    <>
      {isLoadingCourseModules ? (
        <Loading />
      ) : (
        <Form {...form}>
          <DialogForm
            openButton="Add SLT"
            openButtonIntent="dialog"
            title="Create New SLT"
            description={`Write Student Learning Target ${currentModule.moduleCode}.${currentModule.slts.length + 1}`}
            icon="plus"
            buttonLabel="Add SLT"
            buttonLoading={isLoadingCreate}
            buttonDisabled={isLoadingCreate}
            handleSubmit={form.handleSubmit(onSubmit)}
            isOpen={sltDialogOpen}
            setIsOpen={setSltDialogOpen}
          >
            <p></p>
            {/* Todo: look at the line above. If a different module is selected from the menu below, then the SLT id should update dynamically */}

            <div className="mt-4 grid grid-cols-1 gap-y-4">
              <FormInput name="sltText" label="Enter SLT Text" form={form} />

              <FormSelect
                name="moduleId"
                form={form}
                options={
                  courseModuleOverviews
                    ? courseModuleOverviews.map((module) => ({
                      value: module.id,
                      label: `${module.title} (${module.moduleCode})`,
                    }))
                    : []
                }
              />
            </div>
          </DialogForm>
        </Form>
      )}
    </>
  );
}
