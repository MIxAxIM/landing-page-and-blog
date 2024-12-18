import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { useCallback, useEffect, useState } from "react";
import { type Course } from "~/types/db";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import FormInput from "~/components/form/form-input";
import DialogForm from "~/components/form/dialog-form";
import { AccessTier } from "@prisma/client";
import FormSelect from "~/components/form/form-select";
import FormTextArea from "~/components/form/form-textarea";

export default function DialogCourse({ course }: { course?: Course }) {
  const ctx = api.useUtils();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutate: create, isLoading: isLoadingCreate } =
    api.course.create.useMutation({
      onSuccess: () => {
        setIsOpen(false);
        toast.success("Course created!"); // trigger notification in top right
        void ctx.course.getCoursesByOwner.invalidate(); // make the new course appear on the page
        void ctx.creator.getCreatedCourses.invalidate();
        void ctx.creator.getContributedCourses.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors;
        if (errorMessage) {
          toast.error("Some inputs are missing or invalid");
        } else if (!!e.shape?.message) {
          toast.error(e.shape.message)
        } else {
          toast.error("Course Code taken. Please try again.");
        }
      },
    });

  const { mutate: update, isLoading: isLoadingUpdate } =
    api.course.update.useMutation({
      onSuccess: () => {
        setIsOpen(false);
        toast.success("Course updated!");
        void ctx.course.getCoursesByOwner.invalidate();
        void ctx.creator.getCreatedCourses.invalidate();
        void ctx.creator.getContributedCourses.invalidate();
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
    courseCode: z.string().min(4),
    title: z.string().min(8),
    description: z.string().optional(),
    category: z.string().optional(),
    imageUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    accessTier: z.nativeEnum(AccessTier),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      courseCode: "",
      title: "",
      description: "",
      category: "",
      imageUrl: "",
      videoUrl: "",
      accessTier: "HIDDEN",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (course) {
      update({
        courseCode: data.courseCode,
        title: data.title,
        description: data.description ?? "",
        category: "",
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        accessTier: data.accessTier,
      });
    } else {
      create({
        courseCode: data.courseCode,
        title: data.title,
        description: data.description ?? "",
        category: "",
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
      });
    }
  }

  const resetForm = useCallback(() => {
    form.reset({
      courseCode: course?.courseCode,
      title: course?.title,
      description: course?.description ?? "",
      category: "",
      imageUrl: course?.imageUrl ?? "",
      videoUrl: course?.videoUrl ?? "",
      accessTier: course?.accessTier ?? "HIDDEN",
    });
  }, [course]);

  useEffect(() => {
    if (course) {
      resetForm();
    }
  }, [course]);

  const getTitle = useCallback(() => form.getValues("title"), [form]);

  const setCourseCode = useCallback(
    (value: string) => form.setValue("courseCode", value),
    [form],
  );

  useEffect(() => {
    if (!course) {
      const courseTitle = getTitle();
      const abbrev = getFirstLetters(courseTitle);
      setCourseCode(abbrev + "2024");
    }
  }, [course, getTitle, setCourseCode]);

  return (
    <Form {...form}>
      <DialogForm
        openButton={course ? "Edit Course" : "Create a New Course"}
        openButtonIntent="dialog"
        title={course ? `Editing ${course.title}` : "Create a new course"}
        description={
          course
            ? "You are editing an existing course. Make changes and click 'Save'."
            : "To create a new course, give it a title and a unique Course Code. You can change the title and all other details later."
        }
        buttonLabel={course ? "Save" : "Create"}
        buttonLoading={isLoadingCreate || isLoadingUpdate}
        buttonDisabled={isLoadingCreate || isLoadingUpdate}
        handleSubmit={form.handleSubmit(onSubmit)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <div className="mt-4 grid grid-cols-1 gap-4">
          <FormInput
            name="title"
            label="Course Title"
            form={form}
            placeholder={`Add a Course Title`}
          />

          <FormTextArea
            name="description"
            label="Course Description"
            form={form}
            height={150}
          />

          <FormInput name="imageUrl" label="Cover Image URL" form={form} />

          <FormInput name="videoUrl" label="Video URL" form={form} />

          <FormInput
            name="courseCode"
            label="Course Code"
            info="The Course Code is a unique string that appears in the course URL, and can be used as a shorthand title for your course."
            form={form}
            disabled={course !== undefined}
          />

          <FormSelect
            name="accessTier"
            label="Set Course Access Tier"
            form={form}
            options={Object.keys(AccessTier).map((type) => ({
              value: type,
              label: type,
            }))}
          />
        </div>
      </DialogForm>
    </Form>
  );
}

function getFirstLetters(input: string): string {
  return input
    .split(" ")
    .map((word) => word[0]?.toLowerCase())
    .join("");
}
