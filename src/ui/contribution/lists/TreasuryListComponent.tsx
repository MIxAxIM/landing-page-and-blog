import { Table, TableHead, TableCell, TableRow } from "~/components/ui/table";
import useTreasuries from "~/hooks/contribution/useTreasuries";
import { type Treasury } from "~/types/db";
import Link from "next/link";
import DialogTask from "../dialogs/DialogTask";
import DialogTreasury from "../dialogs/DialogTreasury";

export default function TreasuryListComponent() {
  const { treasuries, isLoadingTreasuries } = useTreasuries();

  // Simple component -> Table
  return (
    <div className="w-full">
      {isLoadingTreasuries && "loading"}
      {treasuries && (
        <Table className="w-full table-fixed text-xs">
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
                Quick Actions
              </th>
            </tr>
            <TableRow className="border-b border-primary">
              <TableHead className="border border-primary">Treasury</TableHead>
              <TableHead className="border border-primary text-center">
                # Escrows
              </TableHead>
              <TableHead className="border border-primary text-center">
                # Contributors
              </TableHead>
              <TableHead className="border-x border-primary text-center">
                Open
              </TableHead>
              <TableHead className="border-x border-primary text-center">
                In Progress
              </TableHead>
              <TableHead className="border-x border-primary text-center">
                Pending Review
              </TableHead>
              <TableHead className="border-x border-primary text-center">
                Available
              </TableHead>
              <TableHead className="border-x border-primary text-center">
                Locked
              </TableHead>
              <TableHead className="border-x border-primary text-center">
                Spent
              </TableHead>
              <TableHead className="border-x border-primary text-center">
                Edit Treasury
              </TableHead>
              <TableHead className="border-x border-primary text-center">
                Draft a Task
              </TableHead>
            </TableRow>
          </thead>

          {treasuries.map((t: Treasury, i) => (
            <TableRow
              key={i}
              className="group relative border-y border-gray-500 hover:bg-accent"
            >
              <TableCell className="relative border-x border-gray-500">
                <Link
                  href={`/dashboard/contribution-manager/${t?.treasuryNftPolicyId}`}
                  className="absolute inset-0 cursor-pointer"
                  aria-label={`View details for ${t?.title}`}
                />
                {t?.title}
              </TableCell>
              <TableCell className="relative border-x border-gray-500 text-center">
                <Link
                  href={`/dashboard/contribution-manager/${t?.treasuryNftPolicyId}`}
                  className="absolute inset-0 cursor-pointer"
                  aria-label={`View details for ${t?.title}`}
                />
                {t?._count.escrows}
              </TableCell>
              <TableCell className="relative border-x border-gray-500 text-center">
                <Link
                  href={`/dashboard/contribution-manager/${t?.treasuryNftPolicyId}`}
                  className="absolute inset-0 cursor-pointer"
                  aria-label={`View details for ${t?.title}`}
                />
                9
              </TableCell>
              <TableCell className="relative border-x border-gray-500 text-center">
                <Link
                  href={`/dashboard/contribution-manager/${t?.treasuryNftPolicyId}`}
                  className="absolute inset-0 cursor-pointer"
                  aria-label={`View details for ${t?.title}`}
                />
                {t?.totalTasks}
              </TableCell>
              <TableCell className="relative border-x border-gray-500 text-center">
                <Link
                  href={`/dashboard/contribution-manager/${t?.treasuryNftPolicyId}`}
                  className="absolute inset-0 cursor-pointer"
                  aria-label={`View details for ${t?.title}`}
                />
                5
              </TableCell>
              <TableCell className="relative border-x border-gray-500 text-center">
                <Link
                  href={`/dashboard/contribution-manager/${t?.treasuryNftPolicyId}`}
                  className="absolute inset-0 cursor-pointer"
                  aria-label={`View details for ${t?.title}`}
                />
                2
              </TableCell>
              <TableCell className="relative border-x border-gray-500 text-center">
                <Link
                  href={`/dashboard/contribution-manager/${t?.treasuryNftPolicyId}`}
                  className="absolute inset-0 cursor-pointer"
                  aria-label={`View details for ${t?.title}`}
                />
                2500
              </TableCell>
              <TableCell className="relative border-x border-gray-500 text-center">
                <Link
                  href={`/dashboard/contribution-manager/${t?.treasuryNftPolicyId}`}
                  className="absolute inset-0 cursor-pointer"
                  aria-label={`View details for ${t?.title}`}
                />
                {t?.totalAda}
              </TableCell>
              <TableCell className="relative border-x border-gray-500 text-center">
                <Link
                  href={`/dashboard/contribution-manager/${t?.treasuryNftPolicyId}`}
                  className="absolute inset-0 cursor-pointer"
                  aria-label={`View details for ${t?.title}`}
                />
                400
              </TableCell>
              <TableCell className="relative border-x border-gray-500 text-center">
                <DialogTreasury
                  treasuryNftPolicyId={t?.treasuryNftPolicyId}
                  openButtonSize="sm"
                />
              </TableCell>
              <TableCell className="relative border-x border-gray-500 text-center">
                <DialogTask
                  treasuryId={t?.treasuryNftPolicyId}
                  openButtonSize="sm"
                />
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}
    </div>
  );
}
