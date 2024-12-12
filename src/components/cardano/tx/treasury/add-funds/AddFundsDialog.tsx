import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "~/components/form/form-input";
import { Form } from "~/components/ui/form";
import FormLabel from "~/components/form/form-label";
import SuccessTxModalContent from "~/components/cardano/common/SuccessTxComponent";
import AddFunds from "./AddFunds";
import Image from "next/image";

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
      <DialogTrigger className="rounded-md bg-secondary text-secondary-foreground px-3 py-1 hover:bg-primary hover:text-primary-foreground my-3">Add Funds</DialogTrigger>
      <DialogContent className="max-w-7xl border-l-[10px] border-secondary">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4 my-12">
            {successTxHash ? (
              <SuccessTxModalContent
                txName="Add Funds"
                nextStepLinks={[]}
                txHash={successTxHash}
              />
            ) : (
              <div className="space-y-4">
                {connected ? (
                  <>
                    <h1>Add Funds to Project Treasury</h1>
                    {/* About this Module */}
                    <p className="prose">
                      Lock funds in a Treasury so Contributors can earn rewards for completing tasks. The funds can only be claimed by qualifited contributors when you approve the work.
                    </p>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormLabel>Amount of Ada</FormLabel>
                        <FormInput
                          {...register("adaAmount")}
                          name="adaAmount"
                          placeholder="100"
                          form={form}
                          className="h-12 text-2xl"
                        />
                        <Button className="my-12">Submit</Button>
                      </form>
                    </Form>
                  </>
                ) : (
                  <CardanoWallet />
                )}
              </div>
            )}
          </div>
          <div>
            {connected && adaToDeposit && treasuryNftPolicyId ? (
              <>
                <AddFunds
                  treasuryNftPolicyId={treasuryNftPolicyId}
                  adaAmount={adaToDeposit}
                  setSuccessTxHash={setSuccessTxHash}
                />
              </>
            ) : (

              <div className="flex w-full h-full items-center justify-center">
                <Image src="/andamio.png" width="200" height="200" alt="andamio" />
              </div>
            )}

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
