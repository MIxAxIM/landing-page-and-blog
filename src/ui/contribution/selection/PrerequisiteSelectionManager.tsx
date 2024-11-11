import { useContributorPrerequisite } from "~/hooks/contribution/useContributorPrerequisite";
import { useEscrowPrerequisites } from "~/hooks/contribution/useEscrowPrerequisites";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { useCallback, useMemo } from "react";
import { type ContributorPrerequisite } from "~/types/db";
import DialogPrerequisite from "../dialogs/DialogPrerequisite";
import { PrerequisiteItem, PrerequisiteList } from "../lists/PrerequisiteList";
import { SearchableCombobox } from "~/components/ui/SearchableCombobox";
import Fuse from 'fuse.js';

interface PrerequisiteManagerProps {
  escrowId: string;
  className?: string;
}

export default function PrerequisiteManager({
  escrowId,
  className = "",
}: PrerequisiteManagerProps) {
  const { prerequisites, isLoading: isLoadingPrerequisites } =
    useContributorPrerequisite();
  const {
    escrowPrerequisites,
    addPrerequisiteToEscrow,
    removePrerequisiteFromEscrow,
    isRemoving,
  } = useEscrowPrerequisites({ escrowId });

  const unassignedPrerequisites = useMemo(() => {
    return prerequisites.filter(
      (prereq) =>
        !escrowPrerequisites.some(
          (ep) => ep.contributorPolicyId === prereq.contributorPolicyId,
        ),
    );
  }, [escrowPrerequisites, prerequisites]);

  const filterPrerequisites = useCallback((items: ContributorPrerequisite[], query: string) => {
    if (!query) return items;

    const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);


    const fuseOptions = {
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'courseRequirements.courseCode', weight: 0.5 },
        { name: 'courseRequirements.course.title', weight: 1.0 },
        { name: 'courseRequirements.requiredModules', weight: 0.3 },
      ],
      threshold: 0.3,
      minMatchCharLength: 2,
      ignoreLocation: true,
      shouldSort: true,
      useExtendedSearch: true,
      getFn: (obj: ContributorPrerequisite, path: string | string[]) => {
        // Special handling for courseRequirements
        if (path[0] === 'courseRequirements') {
          const lastPathSegment = path[path.length - 1];
          // Concatenate all values from the array of courseRequirements
          return obj.courseRequirements.map(req => {
            if (lastPathSegment === 'courseCode') return req.courseCode;
            if (lastPathSegment === 'title') return req.course?.title;
            if (lastPathSegment === 'requiredModules') return req.requiredModules.join(' ');
            return '';
          }).join(' '); // Join all values with spaces
        }
        // Default Fuse.js getter for other fields
        return Fuse.config.getFn(obj, path);
      }
    };

    const fuse = new Fuse(items, fuseOptions);
    const fuseQuery = {
      $and: searchTerms.map(term => ({
        $or: fuseOptions.keys.map(key => ({
          [typeof key === 'object' ? key.name : key]: term
        }))
      }))

    }
    const results = fuse.search(fuseQuery);

    return results.map(result => result.item)
  }, []);

  if (!prerequisites?.length) {
    return (
      <Alert>
        <AlertDescription>
          No prerequisites available. Create prerequisites first to add them to
          this escrow.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`my-5 space-y-4 ${className}`}>
      <PrerequisiteList
        prerequisites={escrowPrerequisites}
        onRemove={(id) => removePrerequisiteFromEscrow({ escrowId, prerequisiteId: id })}
        isRemoving={isRemoving}
        emptyMessage="No prerequisites are currently assigned to this circle."
        title="Current Prerequisites"
      />

      {unassignedPrerequisites.length > 0 && (
        <div className="w-full space-y-2">
          <div className="font-medium text-muted-foreground">
            Add Prerequisite
          </div>
          <SearchableCombobox<ContributorPrerequisite>
            items={unassignedPrerequisites}
            triggerText="Add a Contributor Prerequisite"
            searchPlaceholder="search Andamio network for prereqs"
            emptyStateComponent={
              <div>
                <p className="prose my-2 px-8">
                  No prereqs available for this search term. Want to make a new one?
                </p>
                <DialogPrerequisite />
              </div>
            }
            onSelect={(prerequisite) =>
              addPrerequisiteToEscrow({
                escrowId,
                prerequisiteId: prerequisite.contributorPolicyId,
              })
            }
            renderItem={(prerequisite) => (
              <div className="my-2 w-full border-t border-primary py-2">
                <PrerequisiteItem prerequisite={prerequisite} />
              </div>
            )}
            filterItems={filterPrerequisites}
            getItemValue={(prerequisite) => prerequisite.contributorPolicyId}
          />
        </div>
      )}
    </div>
  );
}
