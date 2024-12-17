import Link from "next/link";
import { Treasury } from "~/types/db";

export function ProjectImageSelect({ treasury, escrowId }: { treasury: Treasury, escrowId?: string }) {
  let url = `/app/projects/preview/${escrowId}`

  if (treasury.treasuryNftPolicyId) {
    url = `/app/project/${treasury.treasuryNftPolicyId}`
  }

  return (
    <div className="group relative w-full mx-auto h-60">
      <div className="transform rounded-lg bg-gray-800 text-white shadow-md transition-transform group-hover:shadow-lg">
        <Link href={url}>
          {!!treasury.treasuryNftPolicyId ? (
            <span className="absolute left-2 top-2 rounded bg-success text-success-foreground px-2 py-1 text-xs font-bold">
              published
            </span>
          ) : (
            <span className="absolute left-2 top-2 rounded bg-warning text-warning-foreground px-2 py-1 text-xs font-bold">
              not published
            </span>
          )}
          <img
            src={treasury.imageUrl ?? `/images/sample-covers/2.jpg`}
            alt={treasury.title}
            className="h-52 w-full rounded-t-lg object-cover"
          />
          <div className="p-2">
            <p className="font-bold group-hover:text-accent">{treasury.title}</p>
          </div>
          {/* Hover Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center items-center rounded-lg bg-black/80 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="p-4 text-white space-y-2">
              <div className="grid grid-cols-2 gap-x-4 text-sm">
                <span className="text-gray-400"># Contributors:</span>
                <span>{treasury._count?.escrows ?? 0}</span>

                <span className="text-gray-400">Open Tasks:</span>
                <span>{treasury.totalTasks ?? 0}</span>

                <span className="text-gray-400">In Progress:</span>
                <span>5</span>

                <span className="text-gray-400">Pending Review:</span>
                <span>2</span>

                <span className="text-gray-400">Available:</span>
                <span>2500</span>

                <span className="text-gray-400">Locked:</span>
                <span>{treasury.totalAda ?? 0}</span>

                <span className="text-gray-400">Spent:</span>
                <span>400</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

    </div>
  );
}
