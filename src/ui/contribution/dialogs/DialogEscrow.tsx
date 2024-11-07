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
import { useContributorPrerequisite } from "~/hooks/contribution/useContributorPrerequisite";
import { useEscrowPrerequisites } from "~/hooks/contribution/useEscrowPrerequisites";

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

  // TODO: Improve this query so that the user gets a sub-set of available prerequisites -- maybe at Org level?
  // TODO: Implement search of all prerequisites
  const { prerequisites } = useContributorPrerequisite();
  const {
    escrowPrerequisites,
    addPrerequisiteToEscrow,
    removePrerequisiteFromEscrow,
  } = useEscrowPrerequisites({ escrowId: id });
  const { treasuries } = useTreasuries();

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
        escrowNftPolicyId: escrow.escrowNftPolicyId,
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
        openButton={isEditMode ? "Edit Escrow" : "Create Escrow"}
        openButtonIntent="default"
        openButtonSize={openButtonSize}
        icon={isEditMode ? "pencil" : "plus"}
        title={isEditMode ? "Edit Escrow" : "Create New Escrow"}
        description={
          isEditMode
            ? "Update the escrow's details."
            : "Create a new escrow by providing an NFT policy ID and selecting a treasury."
        }
        buttonLabel={isEditMode ? "Save Changes" : "Create Escrow"}
        buttonLoading={isLoading}
        buttonDisabled={isLoading}
        handleSubmit={form.handleSubmit(onSubmit)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <div className="grid gap-4 py-4">
          <FormInput
            name="title"
            label="Escrow Name"
            form={form}
            placeholder="Enter a name for this Escrow"
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
              label="Treasury"
              form={form}
              options={
                treasuries?.map((t) => ({
                  value: t.treasuryNftPolicyId,
                  label: t.title,
                })) ?? []
              }
              placeholder="Select a treasury"
              disabled={!!defaultTreasuryId}
            />
          )}

          {/* Saved Acceptance Criteria Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Acceptance Criteria
            </label>
            <p className="pb-3 text-xs text-gray-500">
              Can be used on any Task published in this Cirle
            </p>
            {savedCriteria.map((criterion, index) => (
              <div key={index} className="flex gap-2">
                <FormInput
                  name={`savedAcceptanceCriteria.${index}`}
                  form={form}
                  placeholder={`Criterion ${index + 1}`}
                  disabled={isLoading}
                />
                {savedCriteria.length > 0 && (
                  <Button
                    type="button"
                    intent="destructive"
                    size="sm"
                    onClick={() => handleRemoveCriterion(index)}
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
              onClick={handleAddCriterion}
              disabled={isLoading}
            >
              Add Criterion
            </Button>
          </div>

          {/* Contributor Prerequisites Section */}
          {isEditMode && prerequisites && prerequisites.length > 0 && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Contributor Prerequisites
              </label>
              <div className="space-y-2">
                {prerequisites.map((prerequisite) => {
                  const isConnected = escrowPrerequisites.some(
                    (ep) =>
                      ep.contributorPolicyId ===
                      prerequisite.contributorPolicyId,
                  );

                  return (
                    <div
                      key={prerequisite.contributorPolicyId}
                      className="flex items-center justify-between gap-2 rounded border p-2"
                    >
                      <div>
                        <p className="font-medium">
                          {prerequisite.title ?? "Untitled Prerequisite"}
                        </p>
                        <p className="break-all text-xs text-muted-foreground">
                          {prerequisite.contributorPolicyId}
                        </p>
                      </div>
                      <Button
                        type="button"
                        intent={isConnected ? "destructive" : "secondary"}
                        size="sm"
                        onClick={() => {
                          if (isConnected) {
                            removePrerequisiteFromEscrow({
                              escrowId: id,
                              prerequisiteId: prerequisite.contributorPolicyId,
                            });
                          } else {
                            addPrerequisiteToEscrow({
                              escrowId: id,
                              prerequisiteId: prerequisite.contributorPolicyId,
                            });
                          }
                        }}
                        disabled={isLoading}
                      >
                        {isConnected ? "Remove" : "Add"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogForm>
    </Form>
  );
}
