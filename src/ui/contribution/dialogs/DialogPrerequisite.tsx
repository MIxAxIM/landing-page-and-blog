import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useContributorPrerequisite } from "~/hooks/contribution/useContributorPrerequisite";
import { Form } from "~/components/ui/form";
import DialogForm from "~/components/form/dialog-form";
import FormInput from "~/components/form/form-input";
import FormSelect from "~/components/form/form-select";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import useCourseModuleList from "~/hooks/course/useCourseModuleList";

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
      if (name === "courseCode") {
        setSelectedCourseCode(value.courseCode ?? "");
        // Reset module selections when course changes
        if (!isEditMode) {
          form.setValue("requiredCourseModules", []);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, isEditMode, isOpen]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      if (!defaultCourseCode) {
        setSelectedCourseCode("");
      }
    }
  }, [isOpen, form, defaultCourseCode]);

  const requiredModules = form.watch("requiredCourseModules");

  const handleAddModule = () => {
    const newModules = [...requiredModules, ""];
    form.setValue("requiredCourseModules", newModules, {
      shouldValidate: true,
    });
  };

  const handleRemoveModule = (index: number) => {
    const newModules = requiredModules.filter((_, i) => i !== index);
    form.setValue("requiredCourseModules", newModules, {
      shouldValidate: true,
    });
  };

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
        openButton={isEditMode ? "Edit Prerequisite" : "Create Prerequisite"}
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
          <pre>{JSON.stringify(courseModuleList, null, 2)}</pre>
          <pre>SELECTED COURSE CODE: {selectedCourseCode}</pre>
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

          {selectedCourseCode && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Required Modules
              </label>
              {requiredModules.map((_, index) => (
                <div key={index} className="flex gap-2">
                  <FormSelect
                    name={`requiredCourseModules.${index}`}
                    form={form}
                    options={
                      courseModuleList?.map((module) => ({
                        value: module.moduleCode,
                        label: module.title,
                      })) ?? []
                    }
                    placeholder={`Select module ${index + 1}`}
                    disabled={isLoading}
                  />
                  {requiredModules.length > 1 && (
                    <Button
                      type="button"
                      intent="destructive"
                      size="sm"
                      onClick={() => handleRemoveModule(index)}
                      disabled={isLoading}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                intent="secondary"
                size="sm"
                onClick={handleAddModule}
                disabled={isLoading}
              >
                Add Module
              </Button>
            </div>
          )}
        </div>
      </DialogForm>
    </Form>
  );
}
