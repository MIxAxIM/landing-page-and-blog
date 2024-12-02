import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "~/components/form/form-input";
import { Form } from "~/components/ui/form";
import SuccessTxModalContent from "../common/SuccessTxComponent";
import FormLabel from "~/components/form/form-label";
import AddFunds from "../project-manager/addFunds/addFunds";

export default function AddFundsDialog({ treasuryNftPolicyId }: { treasuryNftPolicyId: string }) {
  const { connected } = useWallet();
  const [adaToDeposit, setAdaToDeposit] = useState<number | undefined>(undefined)

  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const FormSchema = z.object({
    adaAmount: z.string().min(3, {
      message: "Must add at least 100 ada to Treasury.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      adaAmount: "100",
    },
  });

  const { register, watch } = form;

  const adaAmount = watch("adaAmount");

  function onSubmit() {
    const a = parseInt(adaAmount)
    if (a >= 100) {
      setAdaToDeposit(a);
    }
    else {
      alert("You must deposit at least 100 ada")
    }
  }

  return (
    <Dialog>
      <DialogTrigger>Add Ada to Project Treasury</DialogTrigger>
      <DialogContent>
        {successTxHash ? (
          <SuccessTxModalContent
            txName="Add Funds to Project Treasury"
            nextStepLinks={[]}
            txHash={successTxHash}
          />
        ) : (
          <>
            {connected ? (
              <>
                <h2>Add Funds</h2>
                {/* About this Module */}
                <h2>About</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormLabel>Andamio Token Name</FormLabel>
                    <FormInput
                      {...register("adaAmount")}
                      name="adaAmount"
                      placeholder="100"
                      form={form}
                    />
                    <Button>Submit</Button>
                  </form>
                </Form>
                {connected && adaToDeposit && treasuryNftPolicyId && (
                  <>
                    <AddFunds
                      treasuryNftPolicyId={treasuryNftPolicyId}
                      adaAmount={adaToDeposit}
                      setSuccessTxHash={setSuccessTxHash}
                    />
                  </>
                )}
              </>
            ) : (
              <CardanoWallet />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
