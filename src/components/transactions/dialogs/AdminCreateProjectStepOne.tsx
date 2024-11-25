
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddress } from "@meshsdk/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "~/components/form/form-input";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import SuccessTxModalContent from "../SuccessTxComponent";
import FormLabel from "~/components/form/form-label";
import ProjectStepOne from "../admin/ProjectStepOne";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import useTreasuries from "~/hooks/contribution/useTreasuries";

// TODO: Add multiple aliases in one transaction - 

export default function AdminCreateProjectInstanceStepOne() {
  const address = useAddress();
  const { treasuries } = useTreasuries()
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
    treasuryId: z.string().min(1),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      andamioAlias: "",
      treasuryId: "",
    },
  });

  const { register, watch } = form;

  const tokenAlias = watch("andamioAlias");
  const treasuryId = watch("treasuryId")

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
            <h2>
              Step 1: Initialize Project
            </h2>
            {/* About this Module */}
            <h2>About</h2>
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

                <FormField
                  control={form.control}
                  name="treasuryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select a Treasury to Publish On-Chain</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select treasury" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {treasuries?.map(t => (
                            <SelectItem value={t.id} key={t.id}>{t.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />



                <Button>Submit</Button>
              </form>
            </Form>
            {address && andamioAliasToAdd && (
              <>
                <ProjectStepOne
                  alias={andamioAliasToAdd}
                  setSuccessTxHash={setSuccessTxHash}
                  treasuryId={treasuryId}
                />
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
