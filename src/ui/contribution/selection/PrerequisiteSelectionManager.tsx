import { Button } from "~/components/ui/button";
import { useContributorPrerequisite } from "~/hooks/contribution/useContributorPrerequisite";
import { useEscrowPrerequisites } from "~/hooks/contribution/useEscrowPrerequisites";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useEffect, useMemo, useState } from "react";
import { type ContributorPrerequisite } from "~/types/db";
import DialogPrerequisite from "../dialogs/DialogPrerequisite";
import { Input } from "~/components/ui/input";

interface PrerequisiteManagerProps {
  escrowId: string;
  className?: string;
}

export default function PrerequisiteManager({
  escrowId,
  className = "",
}: PrerequisiteManagerProps) {
  // Fetch prerequisites data
  const { prerequisites, isLoading: isLoadingPrerequisites } =
    useContributorPrerequisite();
  const {
    escrowPrerequisites,
    addPrerequisiteToEscrow,
    removePrerequisiteFromEscrow,
    isAdding,
    isRemoving,
  } = useEscrowPrerequisites({ escrowId });

  console.log("Prerequisites:", prerequisites);
  console.log("Escrow Prerequisites:", escrowPrerequisites);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const unassignedPrerequisites = useMemo(() => {
    return prerequisites.filter(
      (prereq) =>
        !escrowPrerequisites.some(
          (ep) => ep.contributorPolicyId === prereq.contributorPolicyId,
        ),
    );
  }, [escrowPrerequisites, prerequisites]);

  // Filter prerequisites based on search query
  const filteredPrerequisites = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return unassignedPrerequisites;

    return unassignedPrerequisites.filter((prereq) => {
      // Search in prerequisite title
      if (prereq.title?.toLowerCase().includes(query)) return true;

      // Search in course requirements
      return prereq.courseRequirements.some((req) => {
        // Search in course code and title
        if (req.courseCode.toLowerCase().includes(query)) return true;
        if (req.course?.title.toLowerCase().includes(query)) return true;

        // Search in required modules
        return req.requiredModules.some((module) =>
          module.toLowerCase().includes(query),
        );
      });
    });
  }, [unassignedPrerequisites, searchQuery]);

  // Debug log
  useEffect(() => {
    if (open) {
      console.log("Popover opened with prerequisites:", filteredPrerequisites);
    }
  }, [open, filteredPrerequisites]);

  const handleAddPrerequisite = (prerequisiteId: string) => {
    console.log("Adding prerequisite:", prerequisiteId);
    addPrerequisiteToEscrow({
      escrowId,
      prerequisiteId,
    });
    setOpen(false);
  };

  // If there are no prerequisites at all, show a message
  if (!prerequisites || prerequisites.length === 0) {
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
      {/* Current Prerequisites */}
      {escrowPrerequisites?.length > 0 ? (
        <div className="space-y-2">
          <div className="font-medium text-muted-foreground">
            Current Prerequisites
          </div>
          <div className="space-y-2">
            {!!escrowPrerequisites &&
              escrowPrerequisites.map((prerequisite) => (
                <div
                  key={prerequisite.contributorPolicyId}
                  className="flex items-center justify-between gap-2 border-t border-primary py-2"
                >
                  <PrerequisiteItem prerequisite={prerequisite} />
                  <Button
                    type="button"
                    intent="destructive"
                    size="sm"
                    onClick={() => {
                      removePrerequisiteFromEscrow({
                        escrowId,
                        prerequisiteId: prerequisite.contributorPolicyId,
                      });
                    }}
                    disabled={isRemoving}
                  >
                    X
                  </Button>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <Alert>
          <AlertDescription>
            No prerequisites are currently assigned to this circle.
          </AlertDescription>
        </Alert>
      )}

      {/* Add Prerequisite Select */}
      {unassignedPrerequisites?.length > 0 ? (
        <div className="w-full space-y-2">
          <div className="font-medium text-muted-foreground">
            Add Prerequisite
          </div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button value={searchQuery} role="combobox">
                Add a Contributor Prerequisite
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="min-w-7xl border border-primary p-4"
              align="start"
            >
              <Command>
                <CommandInput
                  placeholder="search Andamio network for prereqs"
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>
                    <div>
                      <p className="prose my-2 px-8">
                        No prereqs available for this search term. Want to make
                        a new one?
                      </p>
                      <DialogPrerequisite />
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredPrerequisites.map((prerequisite) => (
                      <CommandItem
                        key={prerequisite.contributorPolicyId}
                        value={JSON.stringify(prerequisite)}
                        className="cursor-pointer px-2 py-1.5 hover:bg-muted"
                        onSelect={() => {
                          handleAddPrerequisite(
                            prerequisite.contributorPolicyId,
                          );
                        }}
                      >
                        <div className="my-2 w-full border-t border-primary py-2">
                          <PrerequisiteItem prerequisite={prerequisite} />
                        </div>
                      </CommandItem>
                    )) ?? "No prereqs found"}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      ) : (
        <Alert>
          There are no unused prerequisites to add to this Circle! This might
          mean that you already have some good ones assigned.
        </Alert>
      )}
    </div>
  );
}

export function PrerequisiteItem({
  prerequisite,
}: {
  prerequisite: ContributorPrerequisite;
}) {
  return (
    <div className="my-2 w-[1000px]">
      <p className="mb-1 text-lg font-bold">
        {prerequisite.title ?? "Untitled Prerequisite"}
      </p>
      {!!prerequisite.courseRequirements &&
        prerequisite.courseRequirements.map((req) => (
          <div key={req.id} className="mb-2">
            <p className="font-medium">{req.course?.title}</p>
            <p className="text-sm text-muted-foreground">
              Required Modules: {req.requiredModules.join(", ")}
            </p>
          </div>
        ))}
      <p className="break-all text-xs text-muted-foreground">
        {prerequisite.contributorPolicyId}
      </p>
    </div>
  );
}
