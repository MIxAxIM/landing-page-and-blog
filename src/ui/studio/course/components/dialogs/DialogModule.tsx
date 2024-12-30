import { type FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { type Course, type CourseModuleOverview } from "~/types/db";
import { Button } from "~/components/ui/button";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import FormInput from "~/components/form/form-input";
import { useCallback, useEffect, useState } from "react";
import DialogForm from "~/components/form/dialog-form";
import FormSelect from "~/components/form/form-select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "~/components/ui/calendar";
import { format } from "date-fns";
import useCourseModuleOverviews from "~/hooks/db/course/useCourseModuleOverviews";

type ModuleOption = {
  value: string;
  label: string;
};

export default function DialogModule({
  moduleDialogOpen,
  setModuleDialogOpen,
  moduleCode,
  course,
}: {
  moduleDialogOpen: boolean;
  setModuleDialogOpen: (open: boolean) => void;
  moduleCode?: string;
  course: Course;
}) {
  const ctx = api.useUtils();

  // 2024-03-08
  // MUST FIX THIS TYPE
  const { courseModuleOverviews } = useCourseModuleOverviews(
    course?.courseCode ?? "",
  );
  const [currentCourseModule, setCurrentCourseModule] = useState<
    CourseModuleOverview | undefined
  >(undefined);
  const [newModuleCodeOptions, setNewModuleCodeOptions] = useState<
    ModuleOption[]
  >([]);

  const [moduleReleaseDate, setModuleReleaseDate] = useState<Date>();

  // Todo: Implement Course Variants
  // const [currentCourseVariant, setCurrentCourseVariant] = useState<
  //   CourseVariant | undefined
  // >(undefined);
  // const [currentModuleVariant, setCurrentModuleVariant] = useState<
  //   ModuleVariant | undefined
  // >(undefined);

  // const { data: courseVariants } = api.courseVariant.getCourseVariants.useQuery(
  //   {
  //     courseId: course ? course.id : "",
  //   },
  //   {
  //     enabled: course ? true : false,
  //   },
  // );

  // const { listCourseVariant, selectedVariantName, setSelectedVariantName } =
  //   useCourseVariants(course?.id);

  const { mutate: moduleCreate, isLoading: isLoadingCreate } =
    api.module.create.useMutation({
      onSuccess: () => {
        setModuleDialogOpen(false);
        toast.success("Module created");
        void ctx.module.getCourseModuleOverviews.invalidate({
          courseCode: course?.courseCode,
        });
        void ctx.course.getCourse.invalidate({
          courseCode: course?.courseCode,
        });
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors;
        if (errorMessage) {
          toast.error("Some inputs are missing or invalid");
        } else {
          toast.error("Module Code taken. Please try again.");
        }
      },
    });

  const { mutate: moduleUpdate, isLoading: isLoadingUpdate } =
    api.module.update.useMutation({
      onSuccess: () => {
        setModuleDialogOpen(false);
        toast.success("Module updated");
        void ctx.module.getCourseModuleOverviews.invalidate({
          courseCode: course?.courseCode,
        });
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

  const { mutate: moduleDelete, isLoading: isLoadingDelete } =
    api.module.delete.useMutation({
      onSuccess: () => {
        setModuleDialogOpen(false);
        toast.success("Module deleted");
        void ctx.module.getCourseModuleOverviews.invalidate({
          courseCode: course?.courseCode,
        });
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors;
        if (errorMessage) {
          toast.error("Some inputs are missing or invalid");
        } else {
          toast.error("Cannot delete this Module.");
        }
      },
    });

  // Implement Module Variants
  // const { mutate: moduleVariantUpsert, isLoading: isLoadingVariantUpsert } =
  //   api.moduleVariant.upsert.useMutation({
  //     onSuccess: () => {
  //       setModuleDialogOpen(false);
  //       toast.success("Module variant updated!");
  //       void ctx.moduleVariant.getModuleVariants.invalidate({
  //         moduleId: module ? module.id : "",
  //       });
  //     },
  //     onError: (e) => {
  //       const errorMessage = e.data?.zodError?.fieldErrors;
  //       if (errorMessage) {
  //         toast.error("Some inputs are missing or invalid");
  //       } else {
  //         toast.error("Please try again.");
  //       }
  //     },
  //   });

  const FormSchema = z.object({
    moduleCode: z.string().min(3).max(12),
    title: z.string().min(8),
    description: z.string().optional(),
    releaseDate: z.coerce.date().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      moduleCode: "",
      title: "",
      description: "",
      releaseDate: undefined,
    },
  });

  function onSubmit(data: FieldValues) {
    if (course) {
      if (currentCourseModule) {
        moduleUpdate({
          moduleId: currentCourseModule.id,
          courseCode: course.courseCode,
          moduleCode: data.moduleCode,
          title: data.title,
          description: data.description,
          releaseDate: moduleReleaseDate,
        });
      } else {
        moduleCreate({
          courseId: course.id,
          moduleCode: data.moduleCode,
          title: data.title,
          description: data.description,
          releaseDate: moduleReleaseDate,
        });
      }
    }
  }

  const { reset } = form;

  // Given a list of currentModuleCodes like this:
  // currentModuleCodes = ["101", "102", "201", "301", "302"]
  // Create a set of options in a drop-down menu for moduleCode, in the format
  // newModuleCodeOptions: {value: string, label: string}[] = []
  // Options should be:
  // - the next 100-level module
  // - the next 200-level module
  // - the next 300-level module
  // - a custom choice
  //
  // Example:
  // If the current list of modules is ["101", "102", "201"], then the output should be:
  // [{value: "103", label: "103"}, {value: "202", label: "202"}, {value: "301", label: "301"}]

  useEffect(() => {
    if (courseModuleOverviews) {
      const currentModuleCodes = courseModuleOverviews.map((m) => m.moduleCode);
      const _newModuleCodeOptions = makeModuleOptions(currentModuleCodes);
      if (_newModuleCodeOptions) {
        setNewModuleCodeOptions(_newModuleCodeOptions);
      }
    }

    if (!!currentCourseModule && currentCourseModule.releaseDate) {
      setModuleReleaseDate(currentCourseModule.releaseDate);
    }
  }, [moduleDialogOpen, courseModuleOverviews, currentCourseModule, course]);

  const resetForm = useCallback(() => {
    reset({
      moduleCode: moduleCode ?? "",
      title: currentCourseModule?.title ?? "",
      description: currentCourseModule?.description ?? "",
      releaseDate: currentCourseModule?.releaseDate ?? undefined,
    });
  }, [currentCourseModule, moduleCode, reset]);

  useEffect(() => {
    resetForm();
  }, [moduleDialogOpen, resetForm]);

  useEffect(() => {
    if (courseModuleOverviews && moduleCode) {
      const _module = courseModuleOverviews.find(
        (m) => m.moduleCode == moduleCode,
      );
      if (_module) {
        setCurrentCourseModule(_module);
      }
    }
  }, [course, moduleCode, courseModuleOverviews]);

  return (
    <Form {...form}>
      <DialogForm
        openButton={moduleCode ? "moduleSettings" : "Add Module"}
        openButtonIntent="dialog"
        title={
          currentCourseModule
            ? `Editing ${currentCourseModule?.title}`
            : "Create a new module"
        }
        description={
          currentCourseModule
            ? "You are editing a module. Make changes and click 'Save'."
            : "Create a new module by filling in the details below."
        }
        icon={moduleCode ? "settings" : "bigPlus"}
        buttonLabel={currentCourseModule ? "Save" : "Create"}
        buttonLoading={isLoadingCreate || isLoadingUpdate}
        buttonDisabled={isLoadingCreate || isLoadingUpdate}
        handleSubmit={form.handleSubmit(onSubmit)}
        isOpen={moduleDialogOpen}
        setIsOpen={setModuleDialogOpen}
      >
        <div className="mt-4 grid grid-cols-1 gap-y-4">
          <FormInput name="title" label="Module Title" form={form} />

          <FormInput
            name="description"
            label="Module Description"
            form={form}
          />

          {!currentCourseModule && (
            <FormSelect
              name="moduleCode"
              label="Select a suggested Module Code"
              form={form}
              options={newModuleCodeOptions}
            />
          )}
          <FormInput
            name="moduleCode"
            label={
              currentCourseModule
                ? "Edit Module Code"
                : "Or write your own custom code"
            }
            info="The Module Code is a string that appears in the course URL"
            form={form}
            disabled={false}
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button intent="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Module Release Date:{" "}
                {moduleReleaseDate ? (
                  format(moduleReleaseDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="">
              <div className="mx-auto flex w-full justify-center">
                <Calendar
                  mode="single"
                  selected={moduleReleaseDate}
                  onSelect={setModuleReleaseDate}
                  initialFocus
                />
              </div>
            </PopoverContent>
          </Popover>

          {currentCourseModule && (
            <div className="flex items-center gap-2">
              <div className="grow">{currentCourseModule.id}</div>
              <Button
                type="button"
                disabled={isLoadingDelete}
                color="red"
                onClick={() =>
                  // todo: change this is are you sure
                  moduleDelete({
                    moduleId: currentCourseModule.id,
                  })
                }
              >
                {isLoadingDelete ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <>Delete</>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogForm>
    </Form>
  );
}

function incrementCode(code: string): string {
  const lastChar = code.charAt(code.length - 1);
  let newLastChar;
  if (/\d/.test(lastChar)) {
    // If the last character is a digit
    newLastChar = String.fromCharCode(lastChar.charCodeAt(0) + 1);
  } else if (/[A-Y]/.test(lastChar)) {
    // If the last character is a letter from A to Y
    newLastChar = String.fromCharCode(lastChar.charCodeAt(0) + 1);
  } else {
    newLastChar = "H";
  }
  return code.substring(0, code.length - 1) + newLastChar;
}

function makeModuleOptions(currentModuleCodes: string[]): ModuleOption[] {
  if (currentModuleCodes.length === 0) {
    return [
      { value: "101", label: "101" },
      { value: "201", label: "201" },
      { value: "301", label: "301" },
    ];
  }

  const sortedCodes = currentModuleCodes.sort();
  const uniqueCategories = [
    ...new Set(sortedCodes.map((code) => code.substring(0, 2))),
  ];

  const newModuleCodeOptions: ModuleOption[] = uniqueCategories.map(
    (category) => {
      const codesInCategory = sortedCodes.filter((code) =>
        code.startsWith(category),
      );
      const lastCode = codesInCategory[codesInCategory.length - 1] ?? "";
      const nextCode = incrementCode(lastCode);
      return { value: nextCode, label: nextCode };
    },
  );

  const lastCode = sortedCodes[sortedCodes.length - 1];
  if (lastCode && lastCode.startsWith("1")) {
    newModuleCodeOptions.push(
      { value: "201", label: "201" },
      { value: "301", label: "301" },
    );
  } else if (lastCode && lastCode.startsWith("2")) {
    newModuleCodeOptions.push({ value: "301", label: "301" });
  }

  return newModuleCodeOptions;
}
