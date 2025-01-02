import { Button } from "~/components/ui/button";
import type { CourseModuleOverview, ModuleSLT } from "~/types/db";
import DialogSLTDelete from "../dialogs/DialogSLTDelete";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DragHandleDots2Icon, FileIcon } from "@radix-ui/react-icons";
import { ToggleEditableField } from "~/components/ui/toggle-editable-field";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
  setNodeRef: (node: HTMLElement | null) => void;
}

const SortableSltContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref: () => {
    return;
  },
  setNodeRef: () => {
    return;
  },
});

// SortableSLT
export function SortableSLT({
  slt,
  module,
  courseCode,
  published,
}: {
  slt: ModuleSLT;
  module: CourseModuleOverview;
  courseCode: string;
  published: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id: slt.id,
    transition: { duration: 150, easing: "ease-in" },
  });

  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
      setNodeRef: setNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef, setNodeRef],
  );

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <SortableSltContext.Provider value={context}>
      <div style={style}>
        <div className="mx-auto my-1 flex w-11/12 flex-row items-center gap-1">
          {!published && <DragHandle />}
          <RowSLT
            courseCode={courseCode}
            module={module}
            slt={slt}
            {...attributes}
            {...listeners}
            published={published}
          />
        </div>
      </div>
    </SortableSltContext.Provider>
  );
}

// RowSLT is exported for use outside of a Draggable Element
export function RowSLT({
  courseCode,
  module,
  slt,
  published,
}: {
  courseCode: string;
  module: CourseModuleOverview;
  slt: ModuleSLT;
  published: boolean;
}) {
  const ctx = api.useUtils();
  const { setNodeRef } = useContext(SortableSltContext);

  const [sltDeleteDialogOpen, setSltDeleteDialogOpen] =
    useState<boolean>(false);
  const [editSltText, setEditSltText] = useState<boolean>(false);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setEditSltText(false);
      }
    },
    [],
  );

  const { mutate: sltTextUpdate, isLoading: isLoadingUpdate } =
    api.slt.update.useMutation({
      onSuccess: () => {
        toast.success("Student Learning Target updated!");
        setEditSltText(false);
        void ctx.slt.getModuleSLTs.invalidate({
          courseCode: courseCode,
          moduleCode: module.moduleCode,
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
    sltText: z.string().min(1),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      sltText: "",
    },
  });

  const { reset } = form;

  function onSubmit(data: FieldValues) {
    sltTextUpdate({
      id: slt.id,
      moduleId: slt.moduleId,
      moduleIndex: slt.moduleIndex,
      sltText: data.sltText,
    });
  }
  const resetForm = useCallback(() => {
    if (slt.sltText) {
      reset({
        sltText: slt.sltText,
      });
    }
  }, [slt, reset]);

  useEffect(() => {
    resetForm();
  }, [editSltText, resetForm]);

  return (
    <div ref={setNodeRef} onKeyDown={handleKeyDown} className="flex w-full">
      {module && (
        <div
          className={`mx-auto my-1 grid w-full grid-cols-12 items-center py-2 ${isLoadingUpdate && "opacity-50"}`}
          key={`${module.moduleCode}-${slt.moduleIndex}`}
        >
          <div className="col-span-1 flex items-center">
            <p className="px-2 tracking-wide">
              {module.moduleCode}.{slt.moduleIndex}
            </p>
          </div>
          {published ? (
            <div className="col-span-6 flex w-full items-center">
              <p>{slt.sltText}</p>
            </div>
          ) : (
            <div
              className={`${editSltText ? "col-span-11 w-full" : "col-span-6"} flex items-center`}
            >
              <ToggleEditableField
                name="sltText"
                form={form}
                intent="slt"
                formTextSize="slt"
                onSubmit={onSubmit}
                editText={editSltText}
                setEditText={setEditSltText}
                text={slt.sltText}
              />
            </div>
          )}

          {!editSltText && (
            <div className="col-span-2 col-start-11 flex items-center justify-end gap-1 px-8 lg:gap-3 xl:col-span-3 xl:col-start-10">
              <Link
                href={`/studio/course/${courseCode}/${module.moduleCode}/lesson/${slt.moduleIndex}`}
                className=""
              >
                <Button intent="ghost" size="icon">
                  <FileIcon className="h-[14px] w-[14px] xl:h-[16px] xl:w-[16px]" />
                  <p className="mx-1 text-xs">Edit Lesson</p>
                </Button>
              </Link>
              {!published && (
                <DialogSLTDelete
                  sltDeleteDialogOpen={sltDeleteDialogOpen}
                  setSltDeleteDialogOpen={setSltDeleteDialogOpen}
                  slt={slt}
                  courseCode={courseCode}
                  module={module}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// DragHandle
export function DragHandle() {
  const { attributes, listeners, setNodeRef } = useContext(SortableSltContext);

  return (
    <button
      className="duration-250 rounded-md px-1 transition-colors ease-in-out hover:bg-accent"
      {...attributes}
      {...listeners}
      ref={setNodeRef}
    >
      <DragHandleDots2Icon />
    </button>
  );
}
