import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddress } from "@meshsdk/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "~/components/form/form-input";
import { Form } from "~/components/ui/form";
import FormLabel from "~/components/form/form-label";
import SuccessTxModalContent from "~/components/cardano/common/SuccessTxComponent";
import InitCourse from "./InitCourse";

export default function InitCourseStep1Dialog() {
  const address = useAddress();
  const [creatorAliasToAdd, setCreatorAliasToAdd] = useState<
    string | undefined
  >(undefined);

  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const FormSchema = z.object({
    creatorAlias: z.string().min(2, {
      message: "Token name must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      creatorAlias: "",
    },
  });

  const { register, watch } = form;

  const tokenAlias = watch("creatorAlias");

  function onSubmit() {
    if (tokenAlias.length > 1) {
      setCreatorAliasToAdd(tokenAlias);
    }
  }

  return (
    <Dialog>
      <DialogTrigger>Step 1: Create a New Course NFT</DialogTrigger>
      <DialogContent>
        {successTxHash ? (
          <SuccessTxModalContent
            txName="Mint Access Token"
            nextStepLinks={[]}
            txHash={successTxHash}
          />
        ) : (
          <>
            <h2>
              Step 1: Mint and Lock Course NFT
            </h2>
            {/* About this Module */}
            <h2>About</h2>
            <p className="mb-5">Feature: Tell what is happening at this step</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormLabel>Your Andamio Network Token Name:</FormLabel>
                <FormInput
                  {...register("creatorAlias")}
                  name="creatorAlias"
                  placeholder="Choose your token name"
                  form={form}
                />
                <Button>Submit</Button>
              </form>
            </Form>
            {address && creatorAliasToAdd && (
              <>
                <InitCourse
                  alias={creatorAliasToAdd}
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
