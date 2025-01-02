import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import type { Task, Escrow } from "~/types/db";
import { TaskStatus } from "@prisma/client";
import { FormSchema, type FormValues, MIN_ADA, getMinDate } from "./config";

interface UseTaskFormProps {
  task: Task | null | undefined;
  escrow: Escrow;
  isEditMode: boolean;
  createTask: (data: any) => void;
  updateTask: (data: any) => void;
}

export function useTaskForm({
  task,
  escrow,
  isEditMode,
  createTask,
  updateTask,
}: UseTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasLoadedCriteria, setHasLoadedCriteria] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      acceptanceCriteria: [""],
      ada: MIN_ADA,
      expirationTime: getMinDate(),
    },
  });

  const { reset, setValue } = form

  // Load escrow criteria
  useEffect(() => {
    if (escrow?.savedAcceptanceCriteria?.length && isOpen && !hasLoadedCriteria) {
      setValue(
        "acceptanceCriteria",
        escrow.savedAcceptanceCriteria.filter(c => c.trim() !== ""),
        { shouldValidate: true }
      );
      setHasLoadedCriteria(true);
    }
  }, [escrow, isOpen, hasLoadedCriteria, setValue]);

  // Load task data
  useEffect(() => {
    if (task && isEditMode && isOpen) {
      reset({
        title: task.title,
        description: task.description,
        acceptanceCriteria: task.acceptanceCriteria,
        ada: parseInt(task.lovelace) / 1000000,
        expirationTime: new Date(parseInt(task.expirationTime)),
      });
    }
  }, [task, isEditMode, isOpen, reset]);

  // Reset form on close
  useEffect(() => {
    if (isOpen) {
      reset();
      setHasLoadedCriteria(false);
    }
  }, [isOpen, reset]);

  const handleSubmit = async (data: FormValues) => {
    try {
      const taskData = {
        title: data.title,
        description: data.description,
        acceptanceCriteria: data.acceptanceCriteria.filter(c => c.trim() !== ""),
        lovelace: (data.ada * 1000000).toString(),
        expirationTime: data.expirationTime.getTime().toString(),
      };

      if (isEditMode && task?.id) {
        updateTask({
          id: task.id,
          ...taskData,
        });
      } else {
        createTask({
          escrowId: escrow.id,
          task: {
            ...taskData,
            status: TaskStatus.DRAFT,
          },
        });
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to submit task:", error);
    }
  };

  return {
    form,
    isOpen,
    setIsOpen,
    handleSubmit: form.handleSubmit(handleSubmit),
    resetForm: reset,
  };
}
