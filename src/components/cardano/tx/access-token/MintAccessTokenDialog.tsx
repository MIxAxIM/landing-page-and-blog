import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddress } from "@meshsdk/react";
import axios from "axios";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "~/components/form/form-input";
import { Form } from "~/components/ui/form";
import { env } from "~/env";
import FormLabel from "~/components/form/form-label";
import SuccessTxModalContent from "../../common/SuccessTxComponent";
import MintAccessToken from "./MintAccessToken";

export default function MintAccessTokenDialog() {
  const address = useAddress();
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [mintingAlias, setMintingAlias] = useState<string | undefined>(
    undefined,
  );

  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const nextSteps = [
    { text: "Learn how to use your Access Token", url: "/course/andamio101" },
    { text: "Commit to Your First Assignment", url: "/course/andamio101" },
    { text: "Go to Dashboard", url: "/dashboard" },
  ];

  const FormSchema = z.object({
    tokenAlias: z.string().min(2, {
      message: "Token name must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tokenAlias: "",
    },
  });

  const { register, setError, clearErrors, watch } = form;

  // Debounced API call
  const validateTokenAlias = useCallback(
    (tokenAlias: string) => {
      debounce(async () => {
        const isAvailable = await CheckTokenAliasAvailability(tokenAlias);
        if (!isAvailable) {
          setIsAvailable(false);
          setError("tokenAlias", {
            type: "availability",
            message: "This token name is already taken.",
          });
        } else {
          clearErrors("tokenAlias");
          setIsAvailable(true);
        }
      }, 500);
    },
    [clearErrors, setError],
  );

  // Watch for changes in tokenAlias field
  const tokenAlias = watch("tokenAlias");

  useEffect(() => {
    if (tokenAlias.length >= 2) {
      // Avoid checking for very short strings or empty
      void validateTokenAlias(tokenAlias);
    }
  }, [tokenAlias, validateTokenAlias]);

  function onSubmit() {
    if (tokenAlias.length > 1) {
      setMintingAlias(tokenAlias);
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="flex w-full cursor-pointer flex-row items-center gap-8 rounded-md border border-foreground bg-primary px-8 py-2 text-primary-foreground">
          Mint Andamio Network Token
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl">
        {successTxHash ? (
          <SuccessTxModalContent
            txName="Mint Access Token"
            nextStepLinks={nextSteps}
            txHash={successTxHash}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-8">
              <div className="p-2">
                <h2>
                  Mint Andamio Network Token
                </h2>
                {/* About this Module */}
                <h2>About</h2>
                <p className="mb-5">
                  When you mint an Andamio Network Token, you gain access to
                  credentials on the Andamio Network.
                </p>
                <p className="mb-5">
                  When you mint an Andamio Network Token, you gain access to this
                  token after you mint it, and no one else can mint one with the
                  same name.
                </p>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormLabel>Your Andamio Network Token Name:</FormLabel>
                    <FormInput
                      {...register("tokenAlias")}
                      name="tokenAlias"
                      placeholder="Choose your token name"
                      form={form}
                    />
                    {isAvailable && (
                      <div className="mb-2 text-sm text-green-500">
                        This network token name is available.
                      </div>
                    )}
                    <Button>Submit</Button>
                  </form>
                </Form>
              </div>
              <div className="p-2">
                {address && mintingAlias && (
                  <>
                    <MintAccessToken
                      userAddress={address}
                      alias={mintingAlias}
                      successTxHash={successTxHash}
                      setSuccessTxHash={setSuccessTxHash}
                    />
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export const CheckTokenAliasAvailability = async (
  tokenAlias: string,
): Promise<boolean> => {
  const response: { data: { isAvailable: boolean } } = await axios.get(
    `${env.API_URL}/index-validator/alias-availability?alias=${tokenAlias}`,
  );
  return response.data.isAvailable;
};
