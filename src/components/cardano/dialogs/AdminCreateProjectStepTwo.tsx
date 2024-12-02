
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddress } from "@meshsdk/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import SuccessTxModalContent from "../SuccessTxComponent";
import FormLabel from "~/components/form/form-label";
import ProjectStepTwo from "../admin/ProjectStepTwo";
import useTreasuries from "~/hooks/db/contribution/useTreasuries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

export default function AdminCreateProjectInstanceStepTwo() {
  const address = useAddress();
  const { treasuriesWithPolicyId } = useTreasuries()
  const [projectNftPolicyId, setProjectNftPolicyId] = useState<
    string | undefined
  >(undefined);

  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const FormSchema = z.object({
    projectNftPolicyId: z.string().min(2, {
      message: "Token name must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      projectNftPolicyId: "",
    },
  });

  const { watch } = form;

  const projectNft = watch("projectNftPolicyId");

  function onSubmit() {
    if (projectNft.length > 1) {
      setProjectNftPolicyId(projectNft);
    }
  }

  return (
    <Dialog>
      <DialogTrigger>Step 2: Initialize a New Project</DialogTrigger>
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
              Step 2: Creating Project
            </h2>
            {/* About this Module */}
            <h2>About</h2>
            <p className="mb-5">December: How to automate this step for self-service</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>

                <FormField
                  control={form.control}
                  name="projectNftPolicyId"
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
                          {treasuriesWithPolicyId?.map(t => (
                            <>
                              {!!t.treasuryNftPolicyId && <SelectItem value={t.treasuryNftPolicyId} key={t.id}>{t.title}</SelectItem>}
                            </>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <Button>Submit</Button>
              </form>
            </Form>
            {address && projectNftPolicyId && (
              <>
                <ProjectStepTwo
                  projectNftPolicyId={projectNftPolicyId}
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
