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
import { useTerminology } from "~/contexts/terminology-context";

const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  treasuryOwnerId: z.string().min(1, "Must have treasury owner"),
});

type FormValues = z.infer<typeof FormSchema>;

export default function DialogTreasury({
  treasuryId,
  openButtonSize,
}: {
  treasuryId?: string;
  openButtonSize?: "sm";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditMode = !!treasuryId;
  const { data: sessionData } = useSession()
  const { translate, translatePlural, translateCaps, translateCapsPlural } = useTerminology()

  const {
    treasury,
    createTreasury,
    updateTreasury,
    isCreating,
    isUpdating,
    isLoading: isTreasuryLoading,
    treasuryError,
  } = useTreasury(treasuryId ?? undefined);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      treasuryOwnerId: sessionData?.user.treasuryOwnerId,
    },
  });

  // Update form when treasury data is loaded
  useEffect(() => {
    if (treasury && isEditMode) {
      form.reset({
        title: treasury.title,
      });
    }
  }, [treasury, form, isEditMode]);

  const onSubmit = async (data: FormValues) => {
    if (isEditMode) {
      updateTreasury({
        id: treasuryId ?? "",
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
            openButton={isEditMode ? `${translateCaps('treasury')} Settings` : `Create ${translateCaps('treasury')}`}
            openButtonIntent="default"
            openButtonSize={openButtonSize ?? undefined}
            icon={isEditMode ? "pencil" : "plus"}
            title={isEditMode ? `Edit ${translateCaps('treasury')}` : `Create New ${translateCaps('treasury')}`}
            description={
              isEditMode
                ? `Update the ${translatePlural('treasury')} title.`
                : `Create a new ${translate('treasury')} by providing a title and NFT policy ID.`
            }
            buttonLabel={isEditMode ? "Save Changes" : `Create ${translateCaps('treasury')}`}
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
                placeholder={`Enter ${translate('treasury')} title`}
              />
            </div>
          </DialogForm>
        </Form>

      ) : (
        <Card>
          <h1>You cannot have more {translateCapsPlural('treasury')}</h1>
          <Button>Upgrade Andamio Subscription to Create Additional {translateCapsPlural('treasury')}</Button>
        </Card>

      )}
    </>
  );
}
