
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
import ProjectStepFour from "../admin/ProjectStepFour";

// TODO: Get notes on how prerequisites work
export default function AdminCreateProjectInstanceStepFour() {
  const address = useAddress();
  const [projectNftPolicyId, setProjectNftPolicyId] = useState<
    string | undefined
  >(undefined);
  const [prerequisites, setPrerequisites] = useState<
    string | undefined
  >(undefined);

  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const FormSchema = z.object({
    projectNftPolicyId: z.string().min(56, {
      message: "A policy id must be 56 characters.",
    }),
    prerequisites: z.string().min(2, {
      message: "Min 2 characters",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      projectNftPolicyId: "",
    },
  });

  const { register, watch } = form;

  const projectNft = watch("projectNftPolicyId");
  const prereqs = watch("prerequisites");

  function onSubmit() {
    if (projectNft.length === 56) {
      setProjectNftPolicyId(projectNft);
    }
    if (prereqs.length > 2) {
      setPrerequisites(prereqs)
    }
  }

  return (
    <Dialog>
      <DialogTrigger>Step 4: Add prereqs - but where are they created?</DialogTrigger>
      <DialogContent>
        {successTxHash ? (
          <SuccessTxModalContent
            txName="Prerequisites added to course"
            nextStepLinks={[]}
            txHash={successTxHash}
          />
        ) : (
          <>
            <h2>
              Step 4: Add Prerequisites
            </h2>
            {/* About this Module */}
            <h2>About</h2>
            <p className="mb-5">December: How to automate this step for self-service</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormLabel>Enter the policy id (for now)</FormLabel>
                <FormInput
                  {...register("projectNftPolicyId")}
                  name="projectNftPolicyId"
                  placeholder="56 character policy id"
                  form={form}
                />
                <Button>Submit</Button>
              </form>
            </Form>
            {address && projectNftPolicyId && prerequisites && (
              <>
                <ProjectStepFour
                  projectNftPolicyId={projectNftPolicyId}
                  prerequisites={prerequisites}
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
