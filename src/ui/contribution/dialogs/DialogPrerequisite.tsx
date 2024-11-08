import { useForm } from "react-hook-form";
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
import useCourseModuleList from "~/hooks/course/useCourseModuleList";
import { Checkbox } from "~/components/ui/checkbox";

const FormSchema = z.object({
  title: z.string().optional(),
  contributorPolicyId: z.string().min(1, "Policy ID is required"),
  courseCode: z.string().min(1, "Course is required"),
  requiredCourseModules: z
    .array(z.string())
    .min(1, "At least one module is required"),
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

  const [selectedCourseCode, setSelectedCourseCode] = useState(
    defaultCourseCode ?? "",
  );

  const { courseModuleList, isLoadingCourseModuleList } =
    useCourseModuleList(selectedCourseCode);

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
      contributorPolicyId: "",
      courseCode: defaultCourseCode ?? "",
      requiredCourseModules: [],
    },
  });

  // Update form when prerequisite data is loaded
  useEffect(() => {
    if (prerequisite && isEditMode) {
      form.reset({
        title: prerequisite.title ?? "",
        contributorPolicyId: prerequisite.contributorPolicyId,
        courseCode: prerequisite.courseCode,
        requiredCourseModules: prerequisite.requiredCourseModules,
      });
      setSelectedCourseCode(prerequisite.courseCode);
    }
  }, [prerequisite, form, isEditMode]);

  // Watch course selection changes
  useEffect(() => {
    if (!isOpen) return;

    const subscription = form.watch((value, { name }) => {
      if (name === "courseCode" && value.courseCode) {
        setSelectedCourseCode(value.courseCode ?? "");
        // Reset module selections when course changes
        if (!isEditMode && courseModuleList) {
          form.setValue(
            "requiredCourseModules",
            courseModuleList.map((m) => m.moduleCode),
            { shouldValidate: true },
          );
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, isEditMode, isOpen, courseModuleList]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      if (!defaultCourseCode) {
        setSelectedCourseCode("");
      }
    }
  }, [isOpen, form, defaultCourseCode]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEditMode) {
        void updatePrerequisite({
          contributorPolicyId: data.contributorPolicyId,
          title: data.title,
          courseCode: data.courseCode,
          requiredCourseModules: data.requiredCourseModules,
        });
      } else {
        void createPrerequisite(data);
      }
      setIsOpen(false);
    } catch (error) {
      alert(error);
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
            : "Create a new prerequisite by selecting a course and required modules."
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
          <FormInput
            name="contributorPolicyId"
            label="Contributor Policy ID"
            form={form}
            placeholder="Enter contributor policy ID"
            disabled={!!isEditMode}
          />
          <FormSelect
            name="courseCode"
            label="Course"
            form={form}
            options={
              courses?.map((course) => ({
                value: course.courseCode,
                label: `${course.courseCode} - ${course.title}`,
              })) ?? []
            }
            placeholder="Select a course"
            disabled={!!defaultCourseCode || isLoading}
          />

          {selectedCourseCode && courseModuleList && (
            <div className="mt-5 w-2/3 space-y-4">
              <div className="flex items-center gap-5">
                <FormLabel className="">Required Modules</FormLabel>
                <Button
                  type="button"
                  intent="secondary"
                  size="sm"
                  onClick={() => {
                    const allModuleCodes = courseModuleList.map(
                      (m) => m.moduleCode,
                    );
                    const currentModules = form.getValues(
                      "requiredCourseModules",
                    );

                    // If all are selected, clear the selection
                    if (currentModules.length === allModuleCodes.length) {
                      form.setValue("requiredCourseModules", [], {
                        shouldValidate: true,
                      });
                    } else {
                      // Otherwise, select all
                      form.setValue("requiredCourseModules", allModuleCodes, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  disabled={isLoading}
                >
                  {form.watch("requiredCourseModules").length ===
                  courseModuleList.length
                    ? "Unselect All"
                    : "Select All"}
                </Button>
              </div>

              <div className="overflow-y-auto rounded border">
                {courseModuleList.map((module) => {
                  const isSelected = form
                    .watch("requiredCourseModules")
                    .includes(module.moduleCode);

                  return (
                    <div
                      key={module.moduleCode}
                      className="flex items-center gap-3 py-1 text-foreground"
                    >
                      <Checkbox
                        id={`module-${module.moduleCode}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          const currentModules = form.getValues(
                            "requiredCourseModules",
                          );
                          let newModules: string[];

                          if (checked) {
                            newModules = [...currentModules, module.moduleCode];
                          } else {
                            newModules = currentModules.filter(
                              (m) => m !== module.moduleCode,
                            );
                          }

                          form.setValue("requiredCourseModules", newModules, {
                            shouldValidate: true,
                          });
                        }}
                        disabled={isLoading}
                      />
                      <label
                        htmlFor={`module-${module.moduleCode}`}
                        className="cursor-pointer"
                      >
                        <div className="">
                          {module.moduleCode}: {module.title}
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>

              {form.formState.errors.requiredCourseModules && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.requiredCourseModules.message}
                </p>
              )}
            </div>
          )}
        </div>
      </DialogForm>
    </Form>
  );
}
