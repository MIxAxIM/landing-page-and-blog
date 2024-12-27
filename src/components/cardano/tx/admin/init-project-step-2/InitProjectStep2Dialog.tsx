import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWallet } from "@meshsdk/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import FormLabel from "~/components/form/form-label";
import { type ContributorPrerequisite } from "~/types/db";
import useTreasuries from "~/hooks/db/contribution/useTreasuries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useContributorPrerequisite } from "~/hooks/db/contribution/useContributorPrerequisite";
import SuccessTxModalContent from "~/components/cardano/common/SuccessTxComponent";
import InitProjectStep4 from "./InitProjectStep2";

// TODO: Write notes on how prerequisites work
// NOTE: About Prerequisites
// How do prereqs work?
// What do they mean for users?
// How to build an onboarding pathway?

// WARN: ON SUCCESS, this tx must trigger the Treasury to be live in DB
// TODO: Confirm that Treasury with treasuryId is now live

export default function InitProjectStep2Dialog() {
  const { connected } = useWallet()
  const { treasuriesWithPolicyId } = useTreasuries()
  const { prerequisites } = useContributorPrerequisite({});
  const [treasuryId, setTreasuryId] = useState<string | undefined>(undefined)
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

  const { watch } = form;

  const projectNft = watch("projectNftPolicyId");
  const prerequisiteId = watch("prerequisiteId")

  function onSubmit() {
    if (projectNft.length === 56) {
      setProjectNftPolicyId(projectNft);
      const t = treasuriesWithPolicyId?.find(t => t.treasuryNftPolicyId === projectNft)
      if (!!t) {
        setTreasuryId(t.id)

      }
    }
    if (prerequisiteId.length > 0) {
      const p = prerequisites.find(p => p.id === prerequisiteId)
      setPrerequisite(p)
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
                          {treasuriesWithPolicyId
                            ?.filter(t => !!t.treasuryNftPolicyId)
                            .map(t => (
                              <SelectItem
                                value={t.treasuryNftPolicyId ?? ""}
                                key={t.id}
                              >
                                {t.title}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prerequisiteId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select a Prerequisite to Publish On-Chain</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select prereq" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            prerequisites?.filter(p => !p.contributorPolicyId)
                              .map(p => (
                                <SelectItem
                                  value={p.id ?? ""}
                                  key={p.id}
                                >
                                  {p.title}
                                </SelectItem>
                              ))
                          }
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
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
            {connected && projectNftPolicyId && prerequisite && treasuryId && (
              <>
                <InitProjectStep4
                  projectNftPolicyId={projectNftPolicyId}
                  prerequisites={prerequisite}
                  setSuccessTxHash={setSuccessTxHash}
                  treasuryId={treasuryId ?? ""}
                />
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
