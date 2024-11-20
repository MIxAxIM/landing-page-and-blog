
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddress } from "@meshsdk/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "~/components/form/form-input";
import { Form } from "~/components/ui/form";
import SuccessTxModalContent from "../SuccessTxComponent";
import FormLabel from "~/components/form/form-label";
import ProjectStepOne from "../admin/ProjectStepOne";

// TODO: Add multiple aliases in one transaction - 

export default function AdminCreateProjectInstanceStepOne() {
  const address = useAddress();
  const [andamioAliasToAdd, setAndamioAliasToAdd] = useState<
    string | undefined
  >(undefined);

  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const FormSchema = z.object({
    andamioAlias: z.string().min(2, {
      message: "Token name must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      andamioAlias: "",
    },
  });

  const { register, watch } = form;

  const tokenAlias = watch("andamioAlias");

  function onSubmit() {
    if (tokenAlias.length > 1) {
      setAndamioAliasToAdd(tokenAlias);
    }
  }

  return (
    <Dialog>
      <DialogTrigger>Step 1: Initialize a New Project</DialogTrigger>
      <DialogContent>
        {successTxHash ? (
          <SuccessTxModalContent
            txName="Project is Initialized!"
            nextStepLinks={[]}
            txHash={successTxHash}
          />
        ) : (
          <>
            <h2 className="text-2xl font-semibold">
              Step 1: Initialize Project
            </h2>
            {/* About this Module */}
            <h2 className="mt-5 text-xl font-semibold">About</h2>
            <p className="mb-5">December: How to automate this step for self-service</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormLabel>Add a name of Contributor to manage project</FormLabel>
                <FormInput
                  {...register("andamioAlias")}
                  name="andamioAlias"
                  placeholder="Choose your token name"
                  form={form}
                />
                <Button>Submit</Button>
              </form>
            </Form>
            {address && andamioAliasToAdd && (
              <>
                <ProjectStepOne
                  alias={andamioAliasToAdd}
                  setSuccessTxHash={setSuccessTxHash}
                />
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
