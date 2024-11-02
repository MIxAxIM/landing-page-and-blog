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
            <TableRow className="border-b border-primary text-center">
              <TableHead>Treasury</TableHead>
              <TableHead># Escrows</TableHead>
              <TableHead># Contributors</TableHead>
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
              <TableHead className="border-x border-primary">View</TableHead>
              <TableHead className="border-x border-primary">Edit</TableHead>
            </TableRow>
          </thead>

          {treasuries.map((t: Treasury, i) => (
            <>
              {!!t && (
                <TableRow key={i} className="text-center">
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t._count.escrows}</TableCell>
                  <TableCell>9</TableCell>

                  <TableCell>{t.totalTasks}</TableCell>
                  <TableCell>5</TableCell>
                  <TableCell>2</TableCell>
                  <TableCell>2500</TableCell>
                  <TableCell>{t.totalAda}</TableCell>
                  <TableCell>400</TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/contribution-manager/${t.treasuryNftPolicyId}`}
                    >
                      <Button size="sm">Details</Button>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <DialogTreasury
                      treasuryNftPolicyId={t.treasuryNftPolicyId}
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
