import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import type { Task, Escrow } from "~/types/db";
import { TaskStatus } from "@prisma/client";
import { FormSchema, FormValues, MIN_ADA, getMinDate } from "./config";

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

  // Load escrow criteria
  useEffect(() => {
    if (escrow?.savedAcceptanceCriteria?.length && isOpen && !hasLoadedCriteria) {
      form.setValue(
        "acceptanceCriteria",
        escrow.savedAcceptanceCriteria.filter(c => c.trim() !== ""),
        { shouldValidate: true }
      );
      setHasLoadedCriteria(true);
    }
  }, [escrow, isOpen, hasLoadedCriteria, form]);

  // Load task data
  useEffect(() => {
    if (task && isEditMode && isOpen) {
      form.reset({
        title: task.title,
        description: task.description,
        acceptanceCriteria: task.acceptanceCriteria,
        ada: parseInt(task.lovelace) / 1000000,
        expirationTime: new Date(parseInt(task.expirationTime)),
      });
    }
  }, [task, isEditMode, isOpen, form]);

  // Reset form on close
  useEffect(() => {
    if (isOpen) {
      form.reset();
      setHasLoadedCriteria(false);
    }
  }, [isOpen, form]);

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
    resetForm: form.reset,
  };
}
