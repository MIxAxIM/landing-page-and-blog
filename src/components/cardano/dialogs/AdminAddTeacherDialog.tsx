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
import AddCourseTeacherTx from "../admin/AddCourseTeacher";

export default function AdminAddTeacherDialog() {
  const address = useAddress();
  const [creatorAliasToAdd, setCreatorAliasToAdd] = useState<
    string | undefined
  >(undefined);
  const [courseNftPolicyId, setCourseNftPolicyId] = useState<
    string | undefined
  >(undefined);

  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const FormSchema = z.object({
    creatorAlias: z.string().min(2, {
      message: "Token name must be at least 2 characters.",
    }),
    courseNftPolicy: z.string().min(56, {
      message: "Policy Id should be 56 characters",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      creatorAlias: "",
      courseNftPolicy: "",
    },
  });

  const { register, watch } = form;

  const tokenAlias = watch("creatorAlias");
  const policyId = watch("courseNftPolicy");

  function onSubmit() {
    if (tokenAlias.length > 1) {
      setCreatorAliasToAdd(tokenAlias);
    }
    if (policyId.length > 1) {
      setCourseNftPolicyId(policyId);
    }
  }

  return (
    <Dialog>
      <DialogTrigger>Add Teacher to Course</DialogTrigger>
      <DialogContent>
        {successTxHash ? (
          <SuccessTxModalContent
            txName="Add Teacher to Course"
            nextStepLinks={[]}
            txHash={successTxHash}
          />
        ) : (
          <>
            <h2>Add a Teacher</h2>
            {/* About this Module */}
            <h2>About</h2>
            <p className="mb-5">Feature: Tell what is happening at this step</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormLabel>Andamio Token Name</FormLabel>
                <FormInput
                  {...register("creatorAlias")}
                  name="creatorAlias"
                  placeholder="Choose your token name"
                  form={form}
                />
                <FormLabel>Course NFT Policy Id</FormLabel>
                <FormInput
                  {...register("courseNftPolicy")}
                  name="courseNftPolicy"
                  placeholder="enter policy id"
                  form={form}
                />
                <Button>Submit</Button>
              </form>
            </Form>
            {address && creatorAliasToAdd && courseNftPolicyId && (
              <>
                <AddCourseTeacherTx
                  alias={creatorAliasToAdd}
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
