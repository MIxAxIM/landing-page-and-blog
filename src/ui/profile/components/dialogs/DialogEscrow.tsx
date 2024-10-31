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

const FormSchema = z.object({
  title: z.string().min(1, "Escrow name is required"),
  escrowNftPolicyId: z.string().min(1, "Policy ID is required"),
  treasuryId: z.string().min(1, "Treasury is required"),
  contributorPolicyIds: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof FormSchema>;

export default function DialogEscrow({
  id,
  treasuryId: defaultTreasuryId,
}: {
  id?: string;
  treasuryId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditMode = !!id;

  const {
    escrow,
    createEscrow,
    updateEscrow,
    isCreating,
    isUpdating,
    isLoading: isEscrowLoading,
  } = useEscrow({ id: id });

  const { treasuries } = useTreasuries();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      escrowNftPolicyId: "",
      treasuryId: defaultTreasuryId ?? "",
      contributorPolicyIds: [],
    },
  });

  // Update form when escrow data is loaded
  useEffect(() => {
    if (escrow && isEditMode) {
      form.reset({
        title: escrow.title,
        escrowNftPolicyId: escrow.escrowNftPolicyId,
        treasuryId: escrow.treasuryId,
        contributorPolicyIds: escrow.contributorPolicyIds,
      });
    }
  }, [escrow, form, isEditMode]);

  const onSubmit = async (data: FormValues) => {
    if (isEditMode) {
      updateEscrow({
        title: data.title,
        id: id,
        escrowNftPolicyId: data.escrowNftPolicyId,
        contributorPolicyIds: data.contributorPolicyIds,
      });
    } else {
      createEscrow({
        title: data.title,
        escrowNftPolicyId: data.escrowNftPolicyId,
        treasuryId: data.treasuryId,
        contributorPolicyIds: data.contributorPolicyIds,
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
            disabled={!!isEditMode}
          />
          <FormInput
            name="escrowNftPolicyId"
            label="NFT Policy ID"
            form={form}
            placeholder="Enter NFT policy ID"
            disabled={!!isEditMode}
          />
          {!isEditMode && (
            <FormSelect
              name="treasuryId"
              label="Treasury"
              form={form}
              options={
                treasuries?.map((t) => {
                  return {
                    value: t.treasuryNftPolicyId,
                    label: t.title,
                  };
                }) ?? []
              }
              placeholder="Select a treasury"
              disabled={!!defaultTreasuryId}
            />
          )}
        </div>
      </DialogForm>
    </Form>
  );
}
