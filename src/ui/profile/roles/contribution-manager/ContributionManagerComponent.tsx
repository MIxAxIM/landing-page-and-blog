import { Table, TableHead, TableCell, TableRow } from "~/components/ui/table";
import PlaceholderComponent from "~/ui/prototype/PlaceholderComponent";
import SelectTreasuryToManage from "./SelectTreasuryToManage";

export default function ContributionManagerComponent({
  treasuryInfos,
}: {
  treasuryInfos: { treasuryCode: string; title: string }[];
}) {
  return (
    <div>
      <div className="mx-auto mt-12 grid w-11/12 grid-cols-3 gap-5">
        <div className="col-span-3">
          <h2 className="text-4xl">Contribution Manager Dashboard Home</h2>
        </div>
        <div className="col-span-2 row-span-3">
          <PlaceholderComponent
            name="Table: Overview of Current Treasuries"
            userStory="CONTRIBUTION-001"
          >
            <>
              <Table>
                <TableRow>
                  <TableHead>Treasury</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Balance (ADA)</TableHead>
                  <TableHead>Contributors</TableHead>
                </TableRow>

                {treasuryInfos.map((t, i) => (
                  <TableRow key={i}>
                    <TableCell>{t.treasuryCode}</TableCell>
                    <TableCell>{t.title}</TableCell>
                    <TableCell>875</TableCell>
                    <TableCell>12</TableCell>
                  </TableRow>
                ))}
              </Table>
            </>
          </PlaceholderComponent>
        </div>
        <div className="col-span-1 row-span-2">
          <PlaceholderComponent
            name="Quick Actions"
            subItems={[
              "create a new treasury",
              "draft a new task",
              "view all tasks",
            ]}
            userStory="CONTRIBUTION-002"
          >
            <>
              <p>
                Select a Treasury from the Dropdown Menu to view Treasury
                details
              </p>
              <SelectTreasuryToManage treasuryInfos={treasuryInfos} />
            </>
          </PlaceholderComponent>
        </div>
        <div className="col-span-1 row-span-1">
          <PlaceholderComponent
            name="Find Tasks I need to manage"
            userStory="CONTRIBUTION-005"
          >
            <div>Filter and Search Bar</div>
          </PlaceholderComponent>
        </div>
      </div>
    </div>
  );
}
