import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useWallet } from "@meshsdk/react";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import SuccessTxModalContent from "~/components/cardano/common/SuccessTxComponent";
import AddInfo from "./AddInfo";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import ConnectWalletCard from "~/components/cardano/common/ConnectWalletCard";

// TODO: Show that Contributor is currently committed to this Task

const FormSchema = z.object({
  commitmentInfo: z.string().min(2, {
    message: "Commitment Info must be at least 2 characters.",
  }),
});

export default function AddInfoDialog({
  treasuryNftPolicyId
}: {
  treasuryNftPolicyId?: string;
}) {
  const { connected } = useWallet();
  const { accessTokenAsset } = useAccessToken();
  const [commitmentInfo, setCommitmentInfo] = useState<string | undefined>(undefined);
  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const nextSteps = [
    {
      text: `View Project Tasks`,
      url: `/projects`,
    },
    { text: "Browse all Projects", url: "/projects" },
  ];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      commitmentInfo: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setCommitmentInfo(data.commitmentInfo);
  }


  return (
    <>
      {!connected ? (
        <ConnectWalletCard message="Please connect a wallet" />
      ) : (
        <Dialog>
          <DialogTrigger>
            <Button>Add Commitment Evidence</Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl">
            <div className="grid grid-cols-2 gap-8">
              <div className="p-2">
                {successTxHash ? (
                  <SuccessTxModalContent
                    txName="Successfully added Commitment Info"
                    nextStepLinks={nextSteps}
                    txHash={successTxHash}
                  />
                ) : (
                  <DialogHeader>
                    <DialogTitle className="py-4">
                      Add Evidence about your Commitment
                    </DialogTitle>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-11/12 space-y-6">
                        <FormField
                          control={form.control}
                          name="commitmentInfo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Commitment Info</FormLabel>
                              <FormControl>
                                <Input placeholder="enter commitment info" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  </DialogHeader>
                )}
              </div>

              <div className="p-2">
                {!commitmentInfo && (
                  <>
                    {accessTokenAsset &&
                      !!treasuryNftPolicyId && (
                        <AddInfo
                          treasuryNftPolicyId={treasuryNftPolicyId ?? ""}
                          setSuccessTxHash={setSuccessTxHash}
                          info={commitmentInfo}
                        />
                      )}
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
