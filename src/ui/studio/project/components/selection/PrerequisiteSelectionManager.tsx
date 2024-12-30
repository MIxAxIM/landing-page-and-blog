import { useContributorPrerequisite } from "~/hooks/db/contribution/useContributorPrerequisite";
import { useEscrowPrerequisites } from "~/hooks/db/contribution/useEscrowPrerequisites";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { useEffect, useMemo, useState } from "react";
import { PrerequisiteItem, PrerequisiteList } from "../lists/PrerequisiteList";
import { ComboBox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem } from "~/components/ui/Combobox";
import Fuse from 'fuse.js';
import LoadingCircle from "~/components/editor/ContentEditor/ui/icons/loading-circle";

const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'courseRequirements.courseCode', weight: 0.5 },
    { name: 'courseRequirements.course.title', weight: 0.6 },
    { name: 'courseRequirements.requiredModules', weight: 0.4 }
  ],
  threshold: 0.3,
  minMatchCharLength: 2,
  ignoreLocation: true
};

interface PrerequisiteManagerProps {
  escrowId: string;
  className?: string;
}

export default function PrerequisiteManager({
  escrowId,
  className = "",
}: PrerequisiteManagerProps) {
  const { prerequisites, isLoading: isLoadingPrerequisites } =
    useContributorPrerequisite({});
  const {
    escrowPrerequisites,
    addPrerequisiteToEscrow,
    removePrerequisiteFromEscrow,
    isRemoving,
  } = useEscrowPrerequisites({ escrowId });

  const [value, setValue] = useState<string | null>(null);

  const unassignedPrerequisites = useMemo(() => {
    return prerequisites.filter(
      (prereq) =>
        !escrowPrerequisites.some(
          (ep) => ep.contributorPolicyId === prereq.contributorPolicyId,
        ),
    );
  }, [escrowPrerequisites, prerequisites]);

  // Create memoized Fuse instance
  const fuse = useMemo(() => {
    return new Fuse(unassignedPrerequisites, fuseOptions);
  }, [unassignedPrerequisites]);

  const prerequisiteByValue = useMemo(
    () => (value && unassignedPrerequisites?.find(prereq => prereq.id === value)) ?? null,
    [value, unassignedPrerequisites]
  );

  useEffect(() => {
    if (prerequisiteByValue) {
      void addPrerequisiteToEscrow({
        escrowId: escrowId,
        prerequisiteId: prerequisiteByValue.id
      });
      setValue(null);
    }
  }, [prerequisiteByValue, escrowId, addPrerequisiteToEscrow]);

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

  if (isLoadingPrerequisites) return <LoadingCircle />

  return (
    <div className={`my-5 space-y-4 ${className}`}>
      <PrerequisiteList
        prerequisites={escrowPrerequisites}
        onRemove={(id) => removePrerequisiteFromEscrow({ escrowId, prerequisiteId: id })}
        isRemoving={isRemoving}
        emptyMessage="No prerequisites are currently assigned to this circle."
        title="Current Prerequisites"
      />


      <div className="w-full space-y-2">
        <div className="font-medium text-muted-foreground">
          Add Prerequisite
        </div>
        <ComboBox
          value={value}
          onValueChange={setValue}
          filterItems={(inputValue, items) =>
            items.filter(({ value }) => {
              if (!inputValue) return true;

              const prereq = unassignedPrerequisites.find(p => p.id === value);
              if (!prereq) return false;

              // Use Fuse to search the prerequisite
              const results = fuse.search(inputValue);
              return results.some(result => result.item.id === prereq.id);
            })
          }
        >
          <ComboboxInput
            placeholder="Search prerequisites..."
            className="w-full"
          />
          <ComboboxContent>
            {unassignedPrerequisites.map((prereq) => (
              <ComboboxItem
                key={prereq.id}
                value={prereq.id}
                label={prereq.title ?? "Untitled Prerequisite"}
              >
                <PrerequisiteItem prerequisite={prereq} />
              </ComboboxItem>
            ))}
            <ComboboxEmpty>No matching prerequisites found.</ComboboxEmpty>
          </ComboboxContent>
        </ComboBox>
      </div>
    </div>
  );
}
