import DialogTask from "~/ui/contribution/dialogs/DialogTask";
import DialogTreasury from "~/ui/contribution/dialogs/DialogTreasury";
import TreasuryListComponent from "~/ui/contribution/lists/TreasuryListComponent";
import PlaceholderComponent from "~/components/placeholders/PlaceholderComponent";

export default function ContributionManagerComponent({ }: {}) {
  return (
    <div>
      <div className="mx-auto mt-12 grid w-11/12 grid-cols-3 gap-5">
        <div className="col-span-3 flex flex-row items-center justify-between">
          <h2>Contribution Manager Dashboard Home</h2>
          <DialogTask />
        </div>
        <div className="col-span-3">
          <h1>All Network Treasuries</h1>
          <TreasuryListComponent />
          <div className="mx-auto mt-5 w-1/2 bg-accent p-5">
            <p className="mb-5">
              Product development todo: who should be able to see this list?
              Implement access control in DB + with on-chain credentials.
            </p>
            <p className="mb-5">
              As an Access Token holder and/or Andamio Account owner, I can view
              Treasuries that are relevant to me.
            </p>
            <p className="">
              As a general stakeholder in Andamio, I can see an overview of
              public Treasuries. This is not a &quot;dashboard&quot; user story
              - start defining needs for public routes.
            </p>
          </div>
        </div>
        <div className="col-span-1">
          <PlaceholderComponent
            name="Treasury Creation CTA"
            userStory="CONTRIBUTION-00x"
          >
            <>
              <p className="mx-auto w-2/3 pb-3">
                Configure a new Treasury. As an Access Token holder, I can
                initialize a transaction to create a new treasury. This
                transaction has fee and requires ADA to be locked.
              </p>
              <div className="grid grid-cols-1 gap-2">
                <DialogTreasury />
              </div>
            </>
          </PlaceholderComponent>
        </div>
        <div className="col-span-2">
          <PlaceholderComponent
            name="Find Tasks I need to manage"
            userStory="CONTRIBUTION-005"
          >
            <div className="mx-auto w-2/3">
              Filter and Search Bar: To be implmented when access token is
              connected. As Access Token holder, I can see an overview of tasks
              I need to mange
            </div>
          </PlaceholderComponent>
        </div>
      </div>
    </div>
  );
}
