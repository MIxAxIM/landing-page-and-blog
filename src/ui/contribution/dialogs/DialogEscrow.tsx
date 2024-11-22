import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useEscrow } from "~/hooks/contribution/useEscrow";
import { Form } from "~/components/ui/form";
import DialogForm from "~/components/form/dialog-form";
import FormInput from "~/components/form/form-input";
import FormSelect from "~/components/form/form-select";
import useTreasuries from "~/hooks/contribution/useTreasuries";
import { Button } from "~/components/ui/button";
import PrerequisiteManager from "../selection/PrerequisiteSelectionManager";
import { useTerminology } from "~/contexts/terminology-context";

const FormSchema = z.object({
  title: z.string().optional(),
  escrowNftPolicyId: z.string().min(1, "Policy ID is required"),
  treasuryId: z.string().min(1, "Treasury is required"),
  savedAcceptanceCriteria: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof FormSchema>;

interface DialogEscrowProps {
  id?: string;
  treasuryId?: string;
  openButtonSize?: "sm" | "lg";
}

export default function DialogEscrow({
  id,
  treasuryId: defaultTreasuryId,
  openButtonSize,
}: DialogEscrowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditMode = !!id;

  const { escrow, createEscrow, updateEscrow, isCreating, isUpdating } =
    useEscrow({ id });

  const { treasuries } = useTreasuries();
  const { translateCaps, translate, translateCapsPlural } = useTerminology()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      escrowNftPolicyId: "",
      treasuryId: defaultTreasuryId ?? "",
      savedAcceptanceCriteria: [],
    },
  });

  // Update form when escrow data is loaded
  useEffect(() => {
    if (escrow && isEditMode && isOpen) {
      form.reset({
        title: escrow.title ?? "",
        escrowNftPolicyId: escrow.escrowNftPolicyId ?? "",
        treasuryId: escrow.treasuryId,
        savedAcceptanceCriteria: escrow.savedAcceptanceCriteria,
      });
    }
  }, [escrow, form, isEditMode, isOpen]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const savedCriteria = form.watch("savedAcceptanceCriteria");

  const handleAddCriterion = () => {
    const newCriteria = [...savedCriteria, ""];
    form.setValue("savedAcceptanceCriteria", newCriteria, {
      shouldValidate: true,
    });
  };

  const handleRemoveCriterion = (index: number) => {
    const newCriteria = savedCriteria.filter((_, i) => i !== index);
    form.setValue("savedAcceptanceCriteria", newCriteria, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: FormValues) => {
    if (isEditMode) {
      updateEscrow({
        id: id,
        title: data.title ?? "",
        escrowNftPolicyId: data.escrowNftPolicyId,
        savedAcceptanceCriteria: data.savedAcceptanceCriteria,
        isSyncedWithNetwork: false,
      });
    } else {
      createEscrow({
        title: data.title,
        escrowNftPolicyId: data.escrowNftPolicyId,
        treasuryId: data.treasuryId,
        savedAcceptanceCriteria: data.savedAcceptanceCriteria,
      });
    }
    setIsOpen(false);
    form.reset();
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Form {...form}>
      <DialogForm
        openButton={isEditMode ? `Edit ${translateCaps('escrow')}` : `Create ${translateCaps('escrow')}`}
        openButtonIntent="default"
        openButtonSize={openButtonSize}
        icon={isEditMode ? "pencil" : "plus"}
        title={isEditMode ? `Edit ${escrow?.title}` : `Create New ${translateCaps('escrow')}`}
        description={
          isEditMode
            ? `Update ${translateCaps('escrow')} details.`
            : `After you initialize this ${translateCaps('escrow')}, you will be able to create ${translateCapsPlural('task')}.`
        }
        buttonLabel={isEditMode ? "Save Changes" : `Create ${translateCaps('escrow')}`}
        buttonLoading={isLoading}
        buttonDisabled={isLoading}
        handleSubmit={form.handleSubmit(onSubmit)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <div className="grid gap-4 py-4">
          <FormInput
            name="title"
            label={`${translateCaps('escrow')} Name`}
            form={form}
            placeholder={`Enter a name for this ${translateCaps('escrow')}`}
          />
          <FormInput
            name="escrowNftPolicyId"
            label="NFT Policy ID"
            form={form}
            placeholder="Enter NFT policy ID"
            disabled={isEditMode}
          />
          {!isEditMode && (
            <FormSelect
              name="treasuryId"
              label={`${translateCaps('treasury')}`}
              form={form}
              options={
                treasuries?.map((t) => ({
                  value: t.id,
                  label: t.title,
                })) ?? []
              }
              placeholder={`Select a ${translate('treasury')}`}
              disabled={!!defaultTreasuryId}
            />
          )}

          {/* Saved Acceptance Criteria Section */}

          {id && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Acceptance Criteria
              </label>
              <p className="pb-3 text-xs text-gray-500">
                Can be used on any {translateCaps('task')} published in this {translateCaps('escrow')}
              </p>
              {savedCriteria.map((criterion, index) => (
                <div
                  key={index}
                  className="flex w-full flex-row items-center gap-2"
                >
                  <div className="w-full">
                    <FormInput
                      name={`savedAcceptanceCriteria.${index}`}
                      form={form}
                      placeholder={`Criterion ${index + 1}`}
                      disabled={isLoading}
                      className=""
                    />
                  </div>
                  {savedCriteria.length > 0 && (
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
              <Button
                type="button"
                intent="secondary"
                size="sm"
                onClick={handleAddCriterion}
                disabled={isLoading}
              >
                Add Criterion
              </Button>
            </div>
          )}
          {id && <PrerequisiteManager escrowId={id} />}
        </div>
      </DialogForm>
    </Form>
  );
}
