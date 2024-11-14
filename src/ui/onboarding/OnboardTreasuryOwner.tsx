import { Button } from "~/components/ui/button";
import { useRoles } from "~/hooks/app/useRoles";
import DialogTreasury from "../contribution/dialogs/DialogTreasury";

// TODO: Build a user journey from first login to Course Contributor status
export default function OnboardTreasuryOwner() {

  const { enableTreasuryOwner, sessionData } = useRoles()

  return (
    <div className="flex flex-col w-full bg-accent p-5 rounded-sm">
      <h1>Add Treasury Owner</h1>
      {!!sessionData?.user.treasuryOwnerId ? (
        <div>
          <h2>
            You can start your own treasury
          </h2>
          <DialogTreasury />
        </div>
      ) : (
        <Button onClick={enableTreasuryOwner}>Get Ready to Manage a Treasury</Button>
      )}
    </div>
  );
}
