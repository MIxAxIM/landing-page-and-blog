
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
import PrerequisiteFormSelect from "~/ui/contribution/selection/PrerequisiteFormSelect";
import { ContributorPrerequisite } from "~/types/db";

// TODO: Write notes on how prerequisites work
// NOTE: About Prerequisites
// How do prereqs work?
// What do they mean for users?
// How to build an onboarding pathway?



// TODO: In this form, select from a menu of prerequisites
// 1. Load prepreqs from built components
// 2. Parse data into correct format - Following MintCourseModule as an example
// 3. Test the transaction
// 4. Allow multiple prereqs?
export default function AdminCreateProjectInstanceStepFour() {
  const address = useAddress();
  const [projectNftPolicyId, setProjectNftPolicyId] = useState<
    string | undefined
  >(undefined);
  const [prerequisite, setPrerequisite] = useState<
    ContributorPrerequisite | undefined
  >(undefined);

  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const FormSchema = z.object({
    projectNftPolicyId: z.string().min(56, {
      message: "A policy id must be 56 characters.",
    }),
    prerequisiteId: z.string().min(2, {
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

  function onSubmit() {
    if (projectNft.length === 56) {
      setProjectNftPolicyId(projectNft);
    }
  }

  return (
    <Dialog modal={false}>
      <DialogTrigger>Step 4: Add prereqs - but where are they created?</DialogTrigger>
      <DialogContent className="max-w-7xl border border-primary">
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
                <PrerequisiteFormSelect form={form} name="prerequisiteId" prerequisite={prerequisite} setPrerequisite={setPrerequisite} />
                <Button className="mt-8">Submit</Button>
              </form>
            </Form>
            {!!prerequisite && (
              <div className="border-t border-primary mt-3 pt-3">

                <h4>Selected Prerequisite: {prerequisite.title}</h4>
                <h3>{prerequisite?.courseRequirements[0]?.course?.title}</h3>
                <p>Course NFT Policy ID: {prerequisite?.courseRequirements[0]?.course?.courseCreatorNFTPolicyID}</p>
                <p>Required Modules: {prerequisite?.courseRequirements[0]?.requiredModules.join(", ")}</p>

              </div>
            )}
            {address && projectNftPolicyId && prerequisite && (
              <>
                <ProjectStepFour
                  projectNftPolicyId={projectNftPolicyId}
                  prerequisites={prerequisite?.id ?? ""}
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
