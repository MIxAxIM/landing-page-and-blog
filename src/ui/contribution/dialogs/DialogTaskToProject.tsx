import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useTask } from "~/hooks/db/contribution/useTask";
import { useEscrow } from "~/hooks/db/contribution/useEscrow";
import { Form } from "~/components/ui/form";
import DialogForm from "~/components/form/dialog-form";
import FormInput from "~/components/form/form-input";
import FormTextArea from "~/components/form/form-textarea";
import FormSelect from "~/components/form/form-select";
import { TaskStatus } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "~/components/ui/calendar";
import { format, startOfDay } from "date-fns";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { type Escrow } from "~/types/db";
import { useTerminology } from "~/contexts/terminology-context";
import useUserRelationships from "~/hooks/app/useUserRelationships";

// Validation constants
const MIN_ADA = 2;
const MIN_HOURS_FUTURE = 48;

// Get minimum valid date
const getMinDate = () => {
  const date = new Date();
  date.setHours(date.getHours() + MIN_HOURS_FUTURE);
  return startOfDay(date);
};

const FormSchema = z.object({
  title: z.string().min(1, "Please enter a task title"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters long"),
  acceptanceCriteria: z
    .array(z.string())
    .transform((criteria) => criteria.filter((c) => c.trim() !== ""))
    .refine(
      (criteria) => criteria.length >= 1,
      "At least one criterion must be provided",
    ),
  treasuryId: z.string().min(1, "Please select a treasury"),
  ada: z
    .number()
    .min(MIN_ADA, `Minimum ${MIN_ADA} Ada required`)
    .max(1000000, "Maximum 1,000,000 Ada allowed"),
  expirationTime: z
    .date()
    .min(
      getMinDate(),
      `Must be at least ${MIN_HOURS_FUTURE} hours in the future`,
    ),
});

type FormValues = z.infer<typeof FormSchema>;


interface TaskDialogProps {
  treasuryId?: string;
  openButtonSize?: "sm" | "lg";
}

export default function DialogTaskToProject({
  treasuryId: defaultTreasuryId,
  openButtonSize,
}: TaskDialogProps) {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTreasuryId, setSelectedTreasuryId] = useState(
    defaultTreasuryId ?? "",
  );
  const [hasLoadedCriteria, setHasLoadedCriteria] = useState(false);

  // Custom hooks
  const {
    createTask,
    isCreating,
  } = useTask({ id: defaultTreasuryId });

  const { treasuries } = useUserRelationships();
  const { translate, translateCaps, translatePlural } = useTerminology()
  const { treasuryEscrows } = useEscrow({ treasuryId: selectedTreasuryId });

  const [currentEscrow, setCurrentEscrow] = useState<Escrow | null>(null);

  useEffect(() => {
    if (!!treasuryEscrows[0]) {
      setCurrentEscrow(treasuryEscrows[0])
    }
  }, [treasuryEscrows])

  // Form initialization with proper typing
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      acceptanceCriteria: [""],
      treasuryId: defaultTreasuryId ?? "",
      ada: MIN_ADA,
      expirationTime: getMinDate(),
    },
  });

  // Effect: Handle specified escrow on open
  useEffect(() => {
    if (isOpen && !hasLoadedCriteria) {
      if (currentEscrow?.savedAcceptanceCriteria?.length) {
        form.setValue(
          "acceptanceCriteria",
          currentEscrow.savedAcceptanceCriteria.filter(
            (criteria) => criteria.trim() !== "",
          ),
          { shouldValidate: true },
        );
        setHasLoadedCriteria(true);
      }
    }
  }, [currentEscrow, form, isOpen, hasLoadedCriteria]);

  // Effect: Handle treasury selection change
  useEffect(() => {
    if (!isOpen) return;

    const treasurySubscription = form.watch((value, { name }) => {
      if (name === "treasuryId") {
        setSelectedTreasuryId(value.treasuryId ?? "");
      }
    });

    return () => treasurySubscription.unsubscribe();
  }, [form, currentEscrow, isOpen]);


  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setHasLoadedCriteria(false);
      if (!defaultTreasuryId) {
        setSelectedTreasuryId("");
      }
    }
  }, [isOpen, form, defaultTreasuryId]);

  // Add this effect after the other useEffect hooks
  useEffect(() => {
    if (defaultTreasuryId && treasuries) {
      const treasury = treasuries.asOwner.find(
        (t) => t.treasuryNftPolicyId === defaultTreasuryId,
      );
      if (treasury) {
        form.setValue("treasuryId", treasury.id);
        setSelectedTreasuryId(treasury.id);
      }
    }
  }, [defaultTreasuryId, treasuries, form]);


  useEffect(() => {
    const subscription = form.watch(() => {
      if (
        !!currentEscrow &&
        !hasLoadedCriteria
      ) {

        if (currentEscrow?.savedAcceptanceCriteria?.length) {
          form.setValue(
            "acceptanceCriteria",
            currentEscrow.savedAcceptanceCriteria.filter(
              (criteria) => criteria.trim() !== "",
            ),
            { shouldValidate: true },
          );
          setHasLoadedCriteria(true);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, hasLoadedCriteria, currentEscrow]);

  // Handlers for acceptance criteria
  const acceptanceCriteria = form.watch("acceptanceCriteria");

  const handleAddCriterion = () => {
    const newCriteria = [...acceptanceCriteria, ""];
    form.setValue("acceptanceCriteria", newCriteria, {
      shouldValidate: true,
    });
  };

  const handleRemoveCriterion = (index: number) => {
    const newCriteria = acceptanceCriteria.filter((_, i) => i !== index);
    form.setValue("acceptanceCriteria", newCriteria, {
      shouldValidate: true,
    });
  };




  // Form submission handler
  const handleSubmit = async (data: FormValues) => {
    try {
      const taskData = {
        title: data.title,
        description: data.description,
        acceptanceCriteria: data.acceptanceCriteria.filter(
          (c) => c.trim() !== "",
        ),
        lovelace: (data.ada * 1000000).toString(),
        expirationTime: data.expirationTime.getTime().toString(),
      };

      createTask({
        escrowId: currentEscrow?.id ?? "",
        task: {
          ...taskData,
          status: TaskStatus.DRAFT,
        },
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to submit task:", error);
    }
  };

  const isLoading =
    isCreating;

  return (
    <Form {...form}>
      <DialogForm
        openButton={`Draft a new ${translateCaps('task')}`}
        openButtonIntent="default"
        openButtonSize={openButtonSize}
        icon={"plus"}
        title={`Draft a ${translateCaps('task')}`}
        description={`Draft a new ${translate('task')} to be published in the future`}
        buttonLabel={"Save Draft"}
        buttonLoading={isLoading}
        buttonDisabled={isLoading}
        handleSubmit={form.handleSubmit(handleSubmit)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <div className="flex flex-col gap-5">
          <FormSelect
            name="treasuryId"
            label={`${translateCaps('treasury')}`}
            form={form}
            options={
              treasuries.asOwner?.map((t) => ({
                value: t.id,
                label: t.title,
              })) ?? []
            }
            placeholder={`Select a ${translateCaps('treasury')}`}
            disabled={!!defaultTreasuryId || isLoading}
          />
          {!!currentEscrow && (
            <>
              <div>
                <FormInput
                  name="title"
                  label={`${translateCaps('task')} Title`}
                  form={form}
                  placeholder={`Enter a title for this ${translate('task')}`}
                  disabled={isLoading}
                />

                <FormTextArea
                  name="description"
                  label="Description"
                  form={form}
                  placeholder="Enter description"
                  height={150}
                  disabled={isLoading}
                />
                <FormInput
                  name="ada"
                  label="Ada Reward"
                  type="number"
                  min={MIN_ADA}
                  max={1000000}
                  form={form}
                  disabled={isLoading}
                />
                <div className="space-y-2 my-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Expiration Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button intent="outline" disabled={isLoading}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch("expirationTime") ? (
                          format(form.watch("expirationTime"), "PPP")
                        ) : (
                          <span>Select Expiration Date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="z-50 w-auto p-0"
                      align="start"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <div onClick={(e) => e.stopPropagation()}>
                        <Calendar
                          mode="single"
                          selected={form.watch("expirationTime")}
                          onSelect={(date) => {
                            if (date) {
                              form.setValue("expirationTime", date, {
                                shouldValidate: true,
                              });
                            }
                          }}
                          disabled={(date) => date < getMinDate()}
                          initialFocus
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.expirationTime && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.expirationTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 flex w-full mx-auto flex-col space-y-2 border-t border-primary pt-3">
                <label className="block text-sm font-medium text-gray-700">
                  Acceptance Criteria
                </label>
                <div className="flex w-full flex-col">
                  {acceptanceCriteria.map((_criterion, index) => (
                    <div
                      key={index}
                      className="flex w-full items-center justify-between gap-2"
                    >
                      <div className="flex-1">
                        <FormInput
                          name={`acceptanceCriteria.${index}`}
                          form={form}
                          placeholder={`Criterion ${index + 1}`}
                          disabled={isLoading}
                        />
                      </div>
                      {acceptanceCriteria.length > 1 && (
                        <Button
                          type="button"
                          intent="destructive"
                          size="sm"
                          onClick={() => handleRemoveCriterion(index)}
                          disabled={isLoading}
                        >
                          X
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  intent="secondary"
                  size="sm"
                  onClick={handleAddCriterion}
                  disabled={isLoading}
                >
                  Add Acceptance Criterion
                </Button>

                {currentEscrow &&
                  (currentEscrow.savedAcceptanceCriteria?.length ?? 0) > 0 && (
                    <Alert>
                      <AlertTitle>Saved Criteria Loaded</AlertTitle>
                      <AlertDescription>
                        {translateCaps('acceptanceCriteria')} have been pre-loaded from the
                        selected {translate('escrow')}. You can modify or remove them as
                        needed.
                      </AlertDescription>
                    </Alert>
                  )}
              </div>
            </>
          )}
        </div>
      </DialogForm>
    </Form>
  );
}
