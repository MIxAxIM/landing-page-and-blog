import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddress } from "@meshsdk/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "~/components/form/form-input";
import { Form } from "~/components/ui/form";
import SuccessTxModalContent from "../common/SuccessTxComponent";
import FormLabel from "~/components/form/form-label";
import StepThreeDeployCourseInstance from "../admin/StepThreeDeployCourseInstance";

export default function AdminCreateCourseInstanceStepThree() {
  const address = useAddress();
  const [courseNftPolicyId, setCourseNftPolicyId] = useState<
    string | undefined
  >(undefined);

  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const FormSchema = z.object({
    courseNftPolicy: z.string().min(56, {
      message: "Policy Id should be 56 characters",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      courseNftPolicy: "",
    },
  });

  const { register, watch } = form;

  const policyId = watch("courseNftPolicy");

  function onSubmit() {
    if (policyId.length > 1) {
      setCourseNftPolicyId(policyId);
    }
  }

  return (
    <Dialog>
      <DialogTrigger>Step 3: Build Course</DialogTrigger>
      <DialogContent>
        {successTxHash ? (
          <SuccessTxModalContent
            txName="Deploy Scripts (Step 3)"
            nextStepLinks={[]}
            txHash={successTxHash}
          />
        ) : (
          <>
            <h2>Step 3: Deploy Course</h2>
            {/* About this Module */}
            <h2>About</h2>
            <p className="mb-5">Feature: Tell what is happening at this step</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormLabel>Course Policy Id:</FormLabel>
                <FormInput
                  {...register("courseNftPolicy")}
                  name="courseNftPolicy"
                  placeholder="Nft Policy Id from Step 1"
                  form={form}
                />
                <Button>Submit</Button>
              </form>
            </Form>
            {address && courseNftPolicyId && (
              <>
                <StepThreeDeployCourseInstance
                  policy={courseNftPolicyId}
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
