import { Table, TableHead, TableCell, TableRow } from "~/components/ui/table";
import { type Treasury } from "~/types/db";
import Link from "next/link";
import { useTerminology } from "~/contexts/terminology-context";
import DialogTreasury from "~/ui/contribution/dialogs/DialogTreasury";
import DialogTask from "~/ui/contribution/dialogs/DialogTask";
import useUserRelationships from "~/hooks/app/useUserRelationships";
import LoadingCircle from "~/ui/studio/components/ContentEditor/ui/icons/loading-circle";

export default function MyProjectsListComponent() {
  const { treasuries } = useUserRelationships()
  const { translateCaps } = useTerminology();

  if (!treasuries) return <LoadingCircle />
  // Simple component -> Table
  return (
    <div className="w-full">
      {treasuries && (
        <Table className="mb-8 w-full table-fixed">
          <thead>
            <tr>
              {/* Empty cells for non-grouped columns */}
              <th className="" colSpan={2}></th>
              {/* Tasks group spanning 3 columns */}
              <th
                className="border border-primary bg-secondary px-4 text-center font-medium text-secondary-foreground"
                colSpan={3}
              >
                {translateCaps('task')}s
              </th>
              {/* Empty cells for remaining columns */}
              <th
                className="border border-primary bg-primary px-4 text-center font-medium text-primary-foreground"
                colSpan={3}
              >
                {translateCaps('treasury')} Funds
              </th>
              <th
                className="border border-primary bg-secondary px-4 text-center font-medium text-secondary-foreground"
                colSpan={2}
              >
                Quick Actions
              </th>
            </tr>
            <TableRow className="border-b border-primary">
              <TableHead className="border border-primary">{translateCaps('treasury')}</TableHead>
              <TableHead className="border border-primary text-center">
                # {translateCaps('contributor')}s
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
                Edit {translateCaps('treasury')}
              </TableHead>
              <TableHead className="border-x border-primary text-center">
                Draft New {translateCaps('task')}
              </TableHead>
            </TableRow>
          </thead>
          <tbody>
            <tr>
              <td
                className="border border-primary bg-secondary px-4 text-center font-medium text-secondary-foreground"
                colSpan={10}
              >
                OWNED
              </td>
            </tr>
            {treasuries.asOwner.map((t: Treasury) => (
              <TreasuryTableRow t={t} key={t.id} />
            ))}
            <tr>
              <td
                className="border border-primary bg-secondary px-4 text-center font-medium text-secondary-foreground"
                colSpan={10}
              >
                GOVERNING
              </td>
            </tr>
            {treasuries.asManager.map((t: Treasury) => (
              <TreasuryTableRow t={t} key={t.id} />
            ))}
            <tr>
              <td
                className="border border-primary bg-secondary px-4 text-center font-medium text-secondary-foreground"
                colSpan={10}
              >
                CONTRIBUTING TO
              </td>
            </tr>
            {treasuries.asContributor.map((t: Treasury) => (
              <TreasuryTableRow t={t} key={t.id} />
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

const TreasuryTableRow = ({ t }: { t: Treasury }) => {

  return (

    <TableRow
      key={t.id}
      className="group relative border-y border-gray-500 hover:bg-accent"
    >
      <TableCell className="relative border-x border-gray-500">
        <Link
          href={`/app/projects/${t?.id}/${t.escrowIds[0] ?? ""}`}
          className="absolute inset-0 cursor-pointer"
          aria-label={`View details for ${t?.title}`}
        />
        {t?.title}
      </TableCell>
      <TableCell className="relative border-x border-gray-500 text-center">
        <Link
          href={`/app/projects/${t?.id}/${t.escrowIds[0] ?? ""}`}
          className="absolute inset-0 cursor-pointer"
          aria-label={`View details for ${t?.title}`}
        />
        9
      </TableCell>
      <TableCell className="relative border-x border-gray-500 text-center">
        <Link
          href={`/app/projects/${t?.id}/${t.escrowIds[0] ?? ""}`}
          className="absolute inset-0 cursor-pointer"
          aria-label={`View details for ${t?.title}`}
        />
        {t?.totalTasks}
      </TableCell>
      <TableCell className="relative border-x border-gray-500 text-center">
        <Link
          href={`/app/projects/${t?.id}/${t.escrowIds[0] ?? ""}`}
          className="absolute inset-0 cursor-pointer"
          aria-label={`View details for ${t?.title}`}
        />

      </TableCell>
      <TableCell className="relative border-x border-gray-500 text-center">
        <Link
          href={`/app/projects/${t?.id}/${t.escrowIds[0] ?? ""}`}
          className="absolute inset-0 cursor-pointer"
          aria-label={`View details for ${t?.title}`}
        />

      </TableCell>
      <TableCell className="relative border-x border-gray-500 text-center">
        <Link
          href={`/app/projects/${t?.id}/${t.escrowIds[0] ?? ""}`}
          className="absolute inset-0 cursor-pointer"
          aria-label={`View details for ${t?.title}`}
        />

      </TableCell>
      <TableCell className="relative border-x border-gray-500 text-center">
        <Link
          href={`/app/projects/${t?.id}/${t.escrowIds[0] ?? ""}`}
          className="absolute inset-0 cursor-pointer"
          aria-label={`View details for ${t?.title}`}
        />
        {t?.totalAda}
      </TableCell>
      <TableCell className="relative border-x border-gray-500 text-center">
        <Link
          href={`/app/projects/${t?.id}/${t.escrowIds[0] ?? ""}`}
          className="absolute inset-0 cursor-pointer"
          aria-label={`View details for ${t?.title}`}
        />

      </TableCell>
      <TableCell className="relative border-x border-gray-500 text-center">
        <DialogTreasury
          treasuryId={t?.id}
          openButtonSize="sm"
        />
      </TableCell>
      <TableCell className="relative border-x border-gray-500 text-center">
        <DialogTask
          treasuryId={t?.id}
          openButtonSize="sm"
        />
      </TableCell>
    </TableRow>
  )
}
