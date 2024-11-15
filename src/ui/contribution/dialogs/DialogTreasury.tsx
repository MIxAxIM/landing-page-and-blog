import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "~/components/ui/form";
import FormInput from "~/components/form/form-input";
import { useEffect, useState } from "react";
import { useTreasury } from "~/hooks/contribution/useTreasury";
import DialogForm from "~/components/form/dialog-form";
import { useSession } from "next-auth/react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  treasuryNftPolicyId: z.string().min(1, "Policy ID is required"),
  treasuryOwnerId: z.string().min(1, "Must have treasury owner"),
});

type FormValues = z.infer<typeof FormSchema>;

export default function DialogTreasury({
  treasuryNftPolicyId,
  openButtonSize,
}: {
  treasuryNftPolicyId?: string;
  openButtonSize?: "sm";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditMode = !!treasuryNftPolicyId;
  const { data: sessionData } = useSession()

  const {
    treasury,
    createTreasury,
    updateTreasury,
    isCreating,
    isUpdating,
    isLoading: isTreasuryLoading,
    treasuryError,
  } = useTreasury(treasuryNftPolicyId ?? undefined);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      treasuryNftPolicyId: treasuryNftPolicyId ?? "",
      treasuryOwnerId: sessionData?.user.treasuryOwnerId,
    },
  });

  // Update form when treasury data is loaded
  useEffect(() => {
    if (treasury && isEditMode) {
      form.reset({
        title: treasury.title,
        treasuryNftPolicyId: treasury.treasuryNftPolicyId,
      });
    }
  }, [treasury, form, isEditMode]);

  const onSubmit = async (data: FormValues) => {
    if (isEditMode) {
      updateTreasury({
        treasuryNftPolicyId: data.treasuryNftPolicyId,
        title: data.title,
      });
    } else {
      createTreasury(data);
    }
    setIsOpen(false);
    form.reset();
  };

  const isLoading = isCreating || isUpdating;

  return (
    <>
      {!treasuryError ? (
        <Form {...form}>
          <DialogForm
            openButton={isEditMode ? "Treasury Settings" : "Create Treasury"}
            openButtonIntent="default"
            openButtonSize={openButtonSize ?? undefined}
            icon={isEditMode ? "pencil" : "plus"}
            title={isEditMode ? "Edit Treasury" : "Create New Treasury"}
            description={
              isEditMode
                ? "Update the treasury's title."
                : "Create a new treasury by providing a title and NFT policy ID."
            }
            buttonLabel={isEditMode ? "Save Changes" : "Create Treasury"}
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
                placeholder="Enter treasury title"
              />
              <FormInput
                name="treasuryNftPolicyId"
                label="NFT Policy ID"
                form={form}
                placeholder="Enter NFT policy ID"
                disabled={!!isEditMode}
              />
            </div>
          </DialogForm>
        </Form>

      ) : (
        <Card>
          <h1>You cannot have more Treasuries</h1>
          <Button>Upgrade Andamio Subscription to Create Additional Treasuries</Button>
        </Card>

      )}
    </>
  );
}
