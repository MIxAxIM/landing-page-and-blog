import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import DialogForm from "~/components/form/dialog-form"
import { useUserOrganizations } from "~/hooks/organization/useUserOrganizations";
import { Form } from "~/components/ui/form";
import { useTerminology } from "~/contexts/terminology-context";
import FormInput from "~/components/form/form-input";
import FormTextArea from "~/components/form/form-textarea";

const organizationFormSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

export default function DialogOrganization({ openButtonSize }: { openButtonSize?: "sm" }) {
  const [isOpen, setIsOpen] = useState(false);
  const { createOrganization } = useUserOrganizations();
  const { translate, translatePlural, translateCaps } = useTerminology()
  // TODO: Add access control to form fields
  const isEditMode = true;

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: OrganizationFormValues) => {
    createOrganization.mutate(
      {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl || undefined,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          form.reset();
        },
      }
    );
  };

  return (
    <>
      <Form {...form}>
        <DialogForm
          openButton={isEditMode ? `${translateCaps('organization')} Settings` : `Create ${translateCaps('organization')}`}
          openButtonIntent="default"
          openButtonSize={openButtonSize ?? undefined}
          icon={isEditMode ? "pencil" : "plus"}
          title={isEditMode ? `Edit ${translateCaps('treasury')}` : `Create New ${translateCaps('treasury')}`}
          description={
            isEditMode
              ? `Update the ${translatePlural('organization')} title`
              : `Create a new ${translate('organization')}`
          }
          buttonLabel={isEditMode ? "Save Changes" : `Create ${translateCaps('organization')}`}
          buttonLoading={createOrganization.isLoading}
          buttonDisabled={createOrganization.isLoading}
          handleSubmit={form.handleSubmit(onSubmit)}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        >
          <div className="grid gap-4 py-4">
            <FormInput
              name="name"
              label="Name of Organization"
              form={form}
              placeholder={`Enter ${translate('organization')} name`}
            />
            <FormInput
              name="imageUrl"
              label="Image URL (optional)"
              form={form}
              placeholder="e.g. https://andamio.io/andamio.png"
              disabled={!!isEditMode}
            />
            <FormTextArea
              name="description"
              label="About this organization"
              form={form}
              placeholder=""
              disabled={!!isEditMode}
            />
          </div>
        </DialogForm>



      </Form>
    </>
  );
}
