import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContributorPrerequisite } from "~/hooks/db/contribution/useContributorPrerequisite";
import { api } from "~/utils/api";
import useCourseModuleList from "~/hooks/db/course/useCourseModuleList";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { Checkbox } from "~/components/ui/checkbox";
import FormInput from "~/components/form/form-input";
import FormSelect from "~/components/form/form-select";
import { useTerminology } from "~/contexts/terminology-context";

const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  courseRequirements: z
    .array(
      z.object({
        courseCode: z.string().min(1, "Course is required"),
        requiredModules: z
          .array(z.string())
          .min(1, "At least one module is required"),
      }),
    )
    .min(1, "At least one course requirement is needed"),
});

type FormValues = z.infer<typeof FormSchema>;

export default function PrerequisiteForm() {
  // Get course data
  const { data: courses } = api.course.getCourses.useQuery();
  const { createPrerequisite, isCreating } = useContributorPrerequisite({});
  const { translateCaps } = useTerminology()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      courseRequirements: [{ courseCode: "", requiredModules: [] }],
    },
  });

  // Get selected course codes for module lists
  const selectedCourseCodes = form
    .watch("courseRequirements")
    .map((req) => req.courseCode);

  // Get module lists for selected courses
  const { courseModuleLists } = useCourseModuleList(selectedCourseCodes);

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
      createPrerequisite({
        title: data.title,
        courseRequirements: data.courseRequirements,
      });
      form.reset();
    } catch (error) {
      console.error("Failed to save prerequisite:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex w-full flex-col gap-4">
          <FormInput
            name="title"
            label="Title"
            form={form}
            placeholder={`Enter a title for this ${translateCaps('prerequisite')}`}
          />

          {/* Course Requirements Section */}
          <div className="space-y-4 rounded-md border border-black p-5">
            <div className="flex items-center justify-between">
              <h3>Course Requirements</h3>
            </div>

            {form.watch("courseRequirements").map((requirement, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <FormSelect
                      name={`courseRequirements.${index}.courseCode`}
                      label="Course"
                      form={form}
                      options={
                        courses?.map((course) => ({
                          value: course.courseCode,
                          label: `${course.courseCode} - ${course.title}`,
                        })) ?? []
                      }
                      placeholder="Select a course"
                      disabled={isCreating}
                    />
                  </div>
                  <Button
                    type="button"
                    intent="destructive"
                    size="sm"
                    onClick={() => removeCourseRequirement(index)}
                    disabled={
                      form.watch("courseRequirements").length === 1 ||
                      isCreating
                    }
                  >
                    x
                  </Button>
                </div>

                {requirement.courseCode &&
                  !!courseModuleLists[requirement.courseCode]?.length && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">
                          Required Modules
                        </label>
                        <Button
                          type="button"
                          intent="secondary"
                          size="sm"
                          onClick={() => {
                            const allModuleCodes =
                              courseModuleLists[requirement.courseCode]?.map(
                                (m) => m.moduleCode,
                              ) ?? [];
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
                          disabled={isCreating}
                        >
                          {form.watch(
                            `courseRequirements.${index}.requiredModules`,
                          ).length ===
                            courseModuleLists[requirement.courseCode]?.length
                            ? "Unselect All"
                            : "Select All"}
                        </Button>
                      </div>

                      <div className="mt-2 max-h-60 overflow-y-auto rounded border p-2">
                        {courseModuleLists[requirement.courseCode]?.map(
                          (module) => (
                            <div
                              key={module.moduleCode}
                              className="flex items-center gap-2 py-1"
                            >
                              <Checkbox
                                id={`module-${index}-${module.moduleCode}`}
                                checked={form
                                  .watch(
                                    `courseRequirements.${index}.requiredModules`,
                                  )
                                  .includes(module.moduleCode)}
                                onCheckedChange={(checked) => {
                                  const currentModules = form.getValues(
                                    `courseRequirements.${index}.requiredModules`,
                                  );
                                  const newModules = checked
                                    ? [...currentModules, module.moduleCode]
                                    : currentModules.filter(
                                      (m) => m !== module.moduleCode,
                                    );

                                  form.setValue(
                                    `courseRequirements.${index}.requiredModules`,
                                    newModules,
                                    { shouldValidate: true },
                                  );
                                }}
                                disabled={isCreating}
                              />
                              <label
                                htmlFor={`module-${index}-${module.moduleCode}`}
                                className="cursor-pointer"
                              >
                                {module.moduleCode}: {module.title}
                              </label>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ))}
            <Button
              type="button"
              onClick={addCourseRequirement}
              disabled={isCreating}
              size="sm"
              intent="secondary"
            >
              Add Course
            </Button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isCreating}>
          {isCreating ? "Creating..." : `Create ${translateCaps('prerequisite')}`}
        </Button>
      </form>
    </Form>
  );
}
