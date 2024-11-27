import { type UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useContributorPrerequisite } from "~/hooks/contribution/useContributorPrerequisite";
import { Form, FormLabel } from "~/components/ui/form";
import DialogForm from "~/components/form/dialog-form";
import FormInput from "~/components/form/form-input";
import FormSelect from "~/components/form/form-select";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import useCourseModuleList, {
  type CourseModuleInfo,
} from "~/hooks/course/useCourseModuleList";
import { Checkbox } from "~/components/ui/checkbox";
import { type CoursePublic } from "~/types/db";
import toast from "react-hot-toast";

const FormSchema = z.object({
  title: z.string().optional(),
  courseRequirements: z
    .array(
      z.object({
        id: z.string().optional(), // For existing requirements
        courseCode: z.string().min(1, "Course is required"),
        requiredModules: z
          .array(z.string())
          .min(1, "At least one module is required"),
      }),
    )
    .min(1, "At least one course requirement is needed"),
});

type FormValues = z.infer<typeof FormSchema>;

interface DialogPrerequisiteProps {
  id?: string;
  courseCode?: string;
  openButtonSize?: "sm" | "lg";
}

export default function DialogPrerequisite({
  id,
  courseCode: defaultCourseCode,
  openButtonSize,
}: DialogPrerequisiteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditMode = !!id;

  // Get course data
  const { data: courses } = api.course.getCourses.useQuery();

  const {
    prerequisite,
    createPrerequisite,
    updatePrerequisite,
    isCreating,
    isUpdating,
  } = useContributorPrerequisite(id);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      courseRequirements: defaultCourseCode
        ? [{ courseCode: defaultCourseCode, requiredModules: [] }]
        : [],
    },
  });

  // Get all selected course codes from the form
  const selectedCourseCodes = form
    .watch("courseRequirements")
    .map((req) => req.courseCode);

  // Use our updated hook to get module lists
  const { courseModuleLists } =
    useCourseModuleList(selectedCourseCodes);

  // Update form when prerequisite data is loaded
  useEffect(() => {
    if (prerequisite && isEditMode) {
      form.reset({
        title: prerequisite.title ?? "",
        courseRequirements: prerequisite.courseRequirements.map((req) => ({
          id: req.id,
          courseCode: req.courseCode,
          requiredModules: req.requiredModules,
        })),
      });
    }
  }, [prerequisite, form, isEditMode]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const addCourseRequirement = () => {
    const currentRequirements = form.getValues("courseRequirements");
    form.setValue("courseRequirements", [
      ...currentRequirements,
      { courseCode: "", requiredModules: [] },
    ]);
  };

  const removeCourseRequirement = (index: number) => {
    const currentRequirements = form.getValues("courseRequirements");
    form.setValue(
      "courseRequirements",
      currentRequirements.filter((_, i) => i !== index),
    );
  };

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEditMode) {
        void updatePrerequisite({
          id,
          title: data.title,
          courseRequirements: data.courseRequirements,
        });
      } else {
        void createPrerequisite({
          title: data.title,
          courseRequirements: data.courseRequirements,
        });
      }
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to save prerequisite");
    }
  };

  const isLoading = isCreating || isUpdating;


  return (
    <Form {...form}>
      <DialogForm
        openButton={
          isEditMode ? "Edit Prerequisite" : "Create New Prerequisite"
        }
        openButtonIntent="default"
        openButtonSize={openButtonSize}
        icon={isEditMode ? "pencil" : "plus"}
        title={isEditMode ? "Edit Prerequisite" : "Create New Prerequisite"}
        description={
          isEditMode
            ? "Update the prerequisite's details."
            : "Create a new prerequisite by selecting courses and required modules."
        }
        buttonLabel={isEditMode ? "Save Changes" : "Create Prerequisite"}
        buttonLoading={isLoading}
        buttonDisabled={isLoading}
        handleSubmit={form.handleSubmit(onSubmit)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <div className="grid gap-4 py-4">
          <FormInput
            name="title"
            label="Title"
            form={form}
            placeholder="Enter a title for this prerequisite"
          />

          {/* Course Requirements Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3>Course Requirements</h3>
              <Button
                type="button"
                onClick={addCourseRequirement}
                disabled={isLoading}
                size="sm"
                intent="secondary"
              >
                Add Course
              </Button>
            </div>

            {form.watch("courseRequirements").map((requirement, index) => (
              <CourseRequirementField
                key={index}
                index={index}
                courses={courses ?? []}
                form={form}
                onRemove={() => removeCourseRequirement(index)}
                isRemoveDisabled={form.watch("courseRequirements").length === 1}
                isLoading={isLoading}
                courseModules={courseModuleLists[requirement.courseCode] ?? []}
              />
            ))}
          </div>
        </div>
      </DialogForm>
    </Form>
  );
}

interface CourseRequirementFieldProps {
  index: number;
  courses: CoursePublic[];
  form: UseFormReturn<FormValues>;
  onRemove: () => void;
  isRemoveDisabled: boolean;
  isLoading: boolean;
  courseModules: CourseModuleInfo[];
}

function CourseRequirementField({
  index,
  courses,
  form,
  onRemove,
  isRemoveDisabled,
  isLoading,
  courseModules,
}: CourseRequirementFieldProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <FormSelect
            name={`courseRequirements.${index}.courseCode`}
            label="Course"
            form={form}
            options={courses.map((course) => ({
              value: course?.courseCode,
              label: `${course?.courseCode} - ${course?.title}`,
            }))}
            placeholder="Select a course"
            disabled={isLoading}
          />
        </div>
        <Button
          type="button"
          intent="destructive"
          size="sm"
          onClick={onRemove}
          disabled={isRemoveDisabled || isLoading}
        >
          Remove Course
        </Button>
      </div>

      {courseModules.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <FormLabel>Required Modules</FormLabel>
            <Button
              type="button"
              intent="secondary"
              size="sm"
              onClick={() => {
                const allModuleCodes = courseModules.map((m) => m.moduleCode);
                const currentModules = form.getValues(
                  `courseRequirements.${index}.requiredModules`,
                );

                form.setValue(
                  `courseRequirements.${index}.requiredModules`,
                  currentModules.length === allModuleCodes.length
                    ? []
                    : allModuleCodes,
                  { shouldValidate: true },
                );
              }}
              disabled={isLoading}
            >
              {form.watch(`courseRequirements.${index}.requiredModules`)
                .length === courseModules.length
                ? "Unselect All"
                : "Select All"}
            </Button>
          </div>

          <div className="mt-2 max-h-60 overflow-y-auto rounded border p-2">
            {courseModules.map((module) => (
              <div
                key={module.moduleCode}
                className="flex items-center gap-2 py-1"
              >
                <Checkbox
                  id={`module-${index}-${module.moduleCode}`}
                  checked={form
                    .watch(`courseRequirements.${index}.requiredModules`)
                    .includes(module.moduleCode)}
                  onCheckedChange={(checked) => {
                    const currentModules = form.getValues(
                      `courseRequirements.${index}.requiredModules`,
                    );
                    const newModules = checked
                      ? [...currentModules, module.moduleCode]
                      : currentModules.filter((m) => m !== module.moduleCode);

                    form.setValue(
                      `courseRequirements.${index}.requiredModules`,
                      newModules,
                      { shouldValidate: true },
                    );
                  }}
                  disabled={isLoading}
                />
                <label
                  htmlFor={`module-${index}-${module.moduleCode}`}
                  className="cursor-pointer"
                >
                  {module.moduleCode}: {module.title}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
