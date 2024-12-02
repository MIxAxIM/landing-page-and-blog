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

const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  treasuryOwnerId: z.string().min(1, "Must have treasury owner"),
});

type FormValues = z.infer<typeof FormSchema>;

export default function DialogInitializeProject({
  openButtonSize,
}: {
  openButtonSize?: "sm";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: sessionData } = useSession()
  const { translate, translatePlural, translateCaps, translateCapsPlural } = useTerminology()

  const {
    initializeTreasuryWithEscrow,
    treasuryError
  } = useTreasury();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      treasuryOwnerId: sessionData?.user.treasuryOwnerId,
    },
  });

  const onSubmit = async (data: FormValues) => {
    initializeTreasuryWithEscrow(data)
    setIsOpen(false);
    form.reset();
  };


  return (
    <>
      {!treasuryError ? (
        <Form {...form}>
          <DialogForm
            openButton={`Start a ${translateCaps('treasury')}`}
            openButtonIntent="default"
            openButtonSize={openButtonSize ?? undefined}
            icon={"plus"}
            title={`Create a new ${translateCaps('treasury')}`}
            description={`Give your project a name. You can change this any time.`}
            buttonLabel={`Create ${translateCaps('treasury')}`}
            buttonLoading={false}
            buttonDisabled={false}
            handleSubmit={form.handleSubmit(onSubmit)}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          >
            <div className="grid gap-4 py-4">
              <FormInput
                name="title"
                label="Project Name"
                form={form}
                placeholder={`What should we call your new ${translate('treasury')}?`}
              />
            </div>
          </DialogForm>
        </Form>

      ) : (
        <Card>
          <h1>You cannot have more {translateCapsPlural('treasury')}</h1>
          <Button>View Current Projects</Button>
          <Button>Upgrade Andamio Subscription to Create Additional {translateCapsPlural('treasury')}</Button>
        </Card>

      )}
    </>
  );
}
