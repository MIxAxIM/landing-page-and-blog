import { type FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { useCallback, useEffect } from "react";
import { type Course, type CourseVariant } from "~/types/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "~/components/form/form-input";
import { Form } from "~/components/ui/form";
import DialogForm from "~/components/form/dialog-form";

export default function DialogCourseVariant({
  dialogOpen,
  setDialogOpen,
  course,
  courseVariant,
}: {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  course: Course;
  courseVariant?: CourseVariant;
}) {
  const ctx = api.useUtils();

  const { mutate: create, isLoading: isLoadingCreate } =
    api.courseVariant.create.useMutation({
      onSuccess: () => {
        setDialogOpen(false);
        toast.success("New course variant created!");
        void ctx.courseVariant.getCourseVariants.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors;
        if (errorMessage) {
          toast.error("Some inputs are missing or invalid");
        } else {
          toast.error("Course variant code taken. Please try again.");
        }
      },
    });

  const { mutate: update, isLoading: isLoadingUpdate } =
    api.courseVariant.update.useMutation({
      onSuccess: () => {
        setDialogOpen(false);
        toast.success("Course updated!");
        void ctx.courseVariant.getCourseVariants.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors;
        if (errorMessage) {
          toast.error("Some inputs are missing or invalid");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      },
    });

  const FormSchema = z.object({
    variantCode: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    videoUrl: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      variantCode: "",
      title: "",
      description: "",
      videoUrl: "",
    },
  });

  function onSubmit(data: FieldValues) {
    if (course) {
      if (courseVariant) {
        update({
          courseVariantId: courseVariant.id,
          variantCode: data.variantCode,
          title: data.title,
          description: data.description,
          videoUrl: data.videoUrl,
        });
      } else {
        const _data = {
          variantCode: data.variantCode,
          title: data.title,
          description: data.description,
          videoUrl: data.videoUrl,
          courseId: course.id,
        };
        create(_data);
      }
    }
  }

  const resetForm = useCallback(() => {
    form.reset({
      variantCode: courseVariant?.variantCode ?? "",
      title: courseVariant?.title ?? "",
      description: courseVariant?.description ?? "",
      videoUrl: courseVariant?.videoUrl ?? "",
    });
  }, [courseVariant, form]);

  useEffect(() => {
    resetForm();
  }, [dialogOpen, resetForm]);

  return (
    <Form {...form}>
      <DialogForm
        openButton="Add a Variant"
        openButtonIntent="dialog"
        title={
          courseVariant
            ? `Editing ${courseVariant.variantCode}`
            : "Create a new course variant"
        }
        buttonLabel={courseVariant ? "Save" : "Create"}
        buttonLoading={isLoadingCreate || isLoadingUpdate}
        buttonDisabled={isLoadingCreate || isLoadingUpdate}
        handleSubmit={form.handleSubmit(onSubmit)}
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
      >
        <p>
          {courseVariant
            ? "You are editing an existing variant. Make changes and click 'Save'."
            : "Creating a new variant is easy. lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, consequuntur molestias numquam amet blanditiis voluptate sunt illo inventore atque hic, asperiores recusandae, reiciendis quae nostrum sit quis accusamus possimus quisquam?"}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-y-4">
          <FormInput name="title" label="Variant Title" form={form} />

          <FormInput
            name="description"
            label="Variant Description"
            form={form}
          />

          <FormInput name="videoUrl" label="Variant Video URL" form={form} />

          <FormInput name="variantCode" label="Variant Code" form={form} />
        </div>
      </DialogForm>
    </Form>
  );
}
