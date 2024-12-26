import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "~/components/ui/form";
import FormInput from "~/components/form/form-input";
import { useEffect, useState } from "react";
import { useTreasury } from "~/hooks/db/contribution/useTreasury";
import DialogForm from "~/components/form/dialog-form";
import { useSession } from "next-auth/react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { useTerminology } from "~/contexts/terminology-context";
import FormTextArea from "~/components/form/form-textarea";

const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function DialogUpdateTreasury({
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
      description: "",
      imageUrl: "",
      videoUrl: "",
    },
  });

  // Update form when treasury data is loaded
  useEffect(() => {
    if (treasury && isEditMode) {
      form.reset({
        title: treasury.title,
        description: treasury.description ?? "",
        imageUrl: treasury.imageUrl ?? "",
        videoUrl: treasury.videoUrl ?? "",
      });
    }
  }, [treasury, isEditMode]);

  const onSubmit = async (data: FormValues) => {
    if (!!treasury) {
      updateTreasury({ id: treasury.id, ...data });
      setIsOpen(false);
      form.reset();
    }
  };

  const isLoading = isCreating || isUpdating;

  if (!sessionData?.user.treasuryOwnerId) return null

  return (
    <>
      {!treasuryError ? (
        <Form {...form}>
          <DialogForm
            openButton={`${translateCaps('treasury')} Settings`}
            openButtonIntent="default"
            openButtonSize={openButtonSize ?? undefined}
            icon={isEditMode ? "pencil" : "plus"}
            title={`Edit ${translateCaps('treasury')}`}
            description={`Update ${translateCaps('treasury')} details.`}
            buttonLabel="Save Changes"
            buttonLoading={isLoading}
            buttonDisabled={isLoading || !form.formState.isValid}
            handleSubmit={form.handleSubmit(onSubmit)}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          >
            <div className="grid gap-4 py-4">
              {isEditMode ? ("this is edit mode") : ("that is not edit mode")}
              <FormInput
                name="title"
                label="Title"
                form={form}
                placeholder={`Enter ${translate('treasury')} title`}
              />
              <FormTextArea
                name="description"
                label="Description"
                form={form}
                placeholder={`Enter ${translate('treasury')} description`}
              />
              <FormInput
                name="imageUrl"
                label="Image URL"
                form={form}
                placeholder={`Enter ${translate('treasury')} image URL`}
              />
              <FormInput
                name="videoUrl"
                label="Video URL"
                form={form}
                placeholder={`Enter ${translate('treasury')} video URL`}
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
