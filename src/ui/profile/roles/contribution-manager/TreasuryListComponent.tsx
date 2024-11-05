import { Button } from "~/components/ui/button";
import { Table, TableHead, TableCell, TableRow } from "~/components/ui/table";
import useTreasuries from "~/hooks/contribution/useTreasuries";
import { type Treasury } from "~/types/db";
import Link from "next/link";
import DialogTreasury from "../../components/dialogs/DialogTreasury";

export default function TreasuryListComponent() {
  const { treasuries, isLoadingTreasuries } = useTreasuries();

  // Simple component -> Table
  return (
    <div>
      {isLoadingTreasuries && "loading"}
      {treasuries && (
        <Table className="text-center text-xs">
          <thead>
            <tr>
              {/* Empty cells for non-grouped columns */}
              <th className="" colSpan={3}></th>
              {/* Tasks group spanning 3 columns */}
              <th
                className="border border-primary bg-secondary px-4 text-center font-medium text-secondary-foreground"
                colSpan={3}
              >
                Tasks
              </th>
              {/* Empty cells for remaining columns */}
              <th
                className="border border-primary bg-primary px-4 text-center font-medium text-primary-foreground"
                colSpan={3}
              >
                Treasury Funds
              </th>
              <th
                className="border border-primary bg-secondary px-4 text-center font-medium text-secondary-foreground"
                colSpan={2}
              >
                Actions
              </th>
            </tr>
            <TableRow className="border-b border-primary">
              <TableHead className="border border-primary">Treasury</TableHead>
              <TableHead className="border border-primary"># Escrows</TableHead>
              <TableHead className="border border-primary">
                # Contributors
              </TableHead>
              <TableHead className="border-x border-primary">Open</TableHead>
              <TableHead className="border-x border-primary">
                In Progress
              </TableHead>
              <TableHead className="border-x border-primary">
                Pending Review
              </TableHead>
              <TableHead className="border-x border-primary">
                Available
              </TableHead>
              <TableHead className="border-x border-primary">Locked</TableHead>
              <TableHead className="border-x border-primary">Spent</TableHead>
              <TableHead className="border-x border-primary text-center">
                View
              </TableHead>
              <TableHead className="border-x border-primary text-center">
                Edit
              </TableHead>
            </TableRow>
          </thead>

          {treasuries.map((t: Treasury, i) => (
            <>
              {!!t && (
                <TableRow
                  key={i}
                  className="border-y border-gray-500 text-center"
                >
                  <TableCell className="border-x border-gray-500">
                    {t.title}
                  </TableCell>
                  <TableCell className="border-x border-gray-500">
                    {t._count.escrows}
                  </TableCell>
                  <TableCell className="border-x border-gray-500">9</TableCell>
                  <TableCell className="border-x border-gray-500">
                    {t.totalTasks}
                  </TableCell>
                  <TableCell className="border-x border-gray-500">5</TableCell>
                  <TableCell className="border-x border-gray-500">2</TableCell>
                  <TableCell className="border-x border-gray-500">
                    2500
                  </TableCell>
                  <TableCell className="border-x border-gray-500">
                    {t.totalAda}
                  </TableCell>
                  <TableCell className="border-x border-gray-500">
                    400
                  </TableCell>
                  <TableCell className="border-x border-gray-500">
                    <Link
                      href={`/dashboard/contribution-manager/${t.treasuryNftPolicyId}`}
                    >
                      <Button size="sm">Details</Button>
                    </Link>
                  </TableCell>
                  <TableCell className="border-x border-gray-500">
                    <DialogTreasury
                      treasuryNftPolicyId={t.treasuryNftPolicyId}
                      openButtonSize="sm"
                    />
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </Table>
      )}
    </div>
  );
}
