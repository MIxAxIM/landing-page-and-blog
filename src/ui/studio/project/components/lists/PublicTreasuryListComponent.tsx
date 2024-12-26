import useTreasuries from "~/hooks/db/contribution/useTreasuries";
import MintProjectStateDialog from "~/components/cardano/tx/contributor/mint-project-state/MintProjectStateDialog";
import { ProjectImageSelect } from "~/ui/app/components/ProjectImageSelect";
import useAggregateUserInfo from "~/hooks/cardano-indexer-api/network/useAggregateUserInfo";

// Does user have prerequisites for each Project?
// 1. get aggregateUserInfo
// 2. compare the prerequisites for each project to aggregateUserInfo
// 3. implement in ProjectImage select? How to do so with overwhelming number of aggregateInfo queries? Build a router to handle this?
//
//
//
// Show as a status
// Show / hide MintProjectStateDialog
export default function PublicTreasuryListComponent() {
  const { publishedTreasuries, isLoadingTreasuries } = useTreasuries();
  const { qualifiedTreasuryNftPolicyIds } = useAggregateUserInfo()

  return (
    <div className="w-full">
      <h1>All Public Projects</h1>
      <div className="grid grid-cols-3 gap-10 my-10">
        {isLoadingTreasuries && "loading"}
        {publishedTreasuries?.map((treasury) => {
          const isQualified = !!treasury.treasuryNftPolicyId && qualifiedTreasuryNftPolicyIds?.includes(treasury.treasuryNftPolicyId)

          return (
            <div key={treasury.id} className="flex flex-col gap-y-4 items-start align-top">
              <ProjectImageSelect treasury={treasury} escrowId={treasury.escrowIds[0]} isQualified={isQualified} />
              {isQualified && (
                <MintProjectStateDialog treasuryNftPolicyId={treasury.treasuryNftPolicyId ?? ""} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
}


// NOTE: Deprecated Table View - keeping it here for reference if useful:
//
//
//{publishedTreasuries && (
//  <Table className="mb-8 w-full table-fixed">
//    <thead>
//      <tr>
//        {/* Empty cells for non-grouped columns */}
//        <th className="" colSpan={3}></th>
//        {/* Tasks group spanning 3 columns */}
//        <th
//          className="border border-primary bg-secondary px-4 text-center font-medium text-secondary-foreground"
//          colSpan={3}
//        >
//          {translateCaps('task')}s
//        </th>
//        {/* Empty cells for remaining columns */}
//        <th
//          className="border border-primary bg-primary px-4 text-center font-medium text-primary-foreground"
//          colSpan={3}
//        >
//          {translateCaps('treasury')} Funds
//        </th>
//        <th
//          className="border border-primary bg-secondary px-4 text-center font-medium text-secondary-foreground"
//          colSpan={1}
//        >
//          Quick Actions
//        </th>
//      </tr>
//      <TableRow className="border-b border-primary">
//        <TableHead className="border border-primary">{translateCaps('treasury')}</TableHead>
//        <TableHead className="border border-primary text-center">
//          # {translateCaps('escrow')}s
//        </TableHead>
//        <TableHead className="border border-primary text-center">
//          # {translateCaps('contributor')}s
//        </TableHead>
//        <TableHead className="border-x border-primary text-center">
//          Open
//        </TableHead>
//        <TableHead className="border-x border-primary text-center">
//          In Progress
//        </TableHead>
//        <TableHead className="border-x border-primary text-center">
//          Pending Review
//        </TableHead>
//        <TableHead className="border-x border-primary text-center">
//          Available
//        </TableHead>
//        <TableHead className="border-x border-primary text-center">
//          Locked
//        </TableHead>
//        <TableHead className="border-x border-primary text-center">
//          Spent
//        </TableHead>
//        <TableHead className="border-x border-primary text-center">
//          Join Project
//        </TableHead>
//      </TableRow>
//    </thead>
//
//    {publishedTreasuries.map((t: Treasury) => (
//      <TableRow
//        key={t.id}
//        className="group relative border-y border-gray-500 hover:bg-accent"
//      >
//        <TableCell className="relative border-x border-gray-500">
//          <Link
//            href={`/app/project/${t?.treasuryNftPolicyId}`}
//            className="absolute inset-0 cursor-pointer"
//            aria-label={`View details for ${t?.title}`}
//          />
//          {t?.title}
//        </TableCell>
//        <TableCell className="relative border-x border-gray-500 text-center">
//          <Link
//            href={`/app/project/${t?.treasuryNftPolicyId}`}
//            className="absolute inset-0 cursor-pointer"
//            aria-label={`View details for ${t?.title}`}
//          />
//          {t?._count.escrows}
//        </TableCell>
//        <TableCell className="relative border-x border-gray-500 text-center">
//          <Link
//            href={`/app/project/${t?.treasuryNftPolicyId}`}
//            className="absolute inset-0 cursor-pointer"
//            aria-label={`View details for ${t?.title}`}
//          />
//          9
//        </TableCell>
//        <TableCell className="relative border-x border-gray-500 text-center">
//          <Link
//            href={`/app/project/${t?.treasuryNftPolicyId}`}
//            className="absolute inset-0 cursor-pointer"
//            aria-label={`View details for ${t?.title}`}
//          />
//          {t?.totalTasks}
//        </TableCell>
//        <TableCell className="relative border-x border-gray-500 text-center">
//          <Link
//            href={`/app/project/${t?.treasuryNftPolicyId}`}
//            className="absolute inset-0 cursor-pointer"
//            aria-label={`View details for ${t?.title}`}
//          />
//          5
//        </TableCell>
//        <TableCell className="relative border-x border-gray-500 text-center">
//          <Link
//            href={`/app/project/${t?.treasuryNftPolicyId}`}
//            className="absolute inset-0 cursor-pointer"
//            aria-label={`View details for ${t?.title}`}
//          />
//          2
//        </TableCell>
//        <TableCell className="relative border-x border-gray-500 text-center">
//          <Link
//            href={`/app/project/${t?.treasuryNftPolicyId}`}
//            className="absolute inset-0 cursor-pointer"
//            aria-label={`View details for ${t?.title}`}
//          />
//          2500
//        </TableCell>
//        <TableCell className="relative border-x border-gray-500 text-center">
//          <Link
//            href={`/app/project/${t?.treasuryNftPolicyId}`}
//            className="absolute inset-0 cursor-pointer"
//            aria-label={`View details for ${t?.title}`}
//          />
//          {t?.totalAda}
//        </TableCell>
//        <TableCell className="relative border-x border-gray-500 text-center">
//          <Link
//            href={`/app/project/${t?.treasuryNftPolicyId}`}
//            className="absolute inset-0 cursor-pointer"
//            aria-label={`View details for ${t?.title}`}
//          />
//          400
//        </TableCell>
//        <TableCell className="relative border-x border-gray-500 text-center">
//          {/** THIS NEEDS TO BE A DIALOG - MAKE ONE **/}
//          <>
//            {!!t.treasuryNftPolicyId && (
//              <MintProjectStateDialog treasuryNftPolicyId={t.treasuryNftPolicyId ?? ""} />
//            )}
//          </>
//        </TableCell>
//      </TableRow>
//    ))}
//  </Table>
//)}
