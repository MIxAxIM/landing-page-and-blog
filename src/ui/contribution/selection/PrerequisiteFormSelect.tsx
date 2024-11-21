import { useContributorPrerequisite } from "~/hooks/contribution/useContributorPrerequisite";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { ComboBox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem } from "~/components/ui/Combobox";
import { type ContributorPrerequisite } from "~/types/db";
import Fuse from 'fuse.js';
import { Dispatch, SetStateAction, useMemo, useState } from "react";

const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'contributorPolicyId', weight: 0.3 },
    { name: 'courseRequirements.courseCode', weight: 0.5 },
    { name: 'courseRequirements.course.title', weight: 0.6 },
    { name: 'courseRequirements.requiredModules', weight: 0.4 }
  ],
  threshold: 0.3,
  minMatchCharLength: 2,
  ignoreLocation: true
};

interface PrerequisiteItemProps {
  prerequisite: ContributorPrerequisite;
}

function PrerequisiteItem({ prerequisite }: PrerequisiteItemProps) {
  return (
    <div className="flex flex-col">
      <div>{prerequisite.title ?? "Untitled Prerequisite"}</div>
      <div className="text-xs text-muted-foreground">
        {prerequisite.courseRequirements.map(req => req.course?.title).join(", ")}
      </div>
    </div>
  );
}


export default function PrerequisiteFormSelect({
  form,
  name,
  prerequisite,
  setPrerequisite,
  label = "Prerequisite",
  placeholder = "Search prerequisites...",
  excludeIds = []
}:
  {
    form: any;
    name: string;
    prerequisite?: ContributorPrerequisite;
    setPrerequisite: Dispatch<SetStateAction<ContributorPrerequisite | undefined>>
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    excludeIds?: string[];
  }) {
  const { prerequisites, isLoading } = useContributorPrerequisite();

  const availablePrerequisites = useMemo(() => {
    return prerequisites.filter(
      prereq => !excludeIds.includes(prereq.contributorPolicyId)
    );
  }, [prerequisites, excludeIds]);

  const fuse = useMemo(() => {
    return new Fuse(availablePrerequisites, fuseOptions);
  }, [availablePrerequisites]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selectedPrerequisite = availablePrerequisites.find(
          p => p.contributorPolicyId === field.value
        );
        if (selectedPrerequisite) setPrerequisite(selectedPrerequisite)
        return (

          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <ComboBox
                value={field.value}
                onValueChange={field.onChange}
                filterItems={(inputValue, items) =>
                  items.filter(({ value }) => {
                    if (!inputValue) return true;

                    const prereq = availablePrerequisites.find(p => p.contributorPolicyId === value);
                    if (!prereq) return false;

                    const results = fuse.search(inputValue);
                    return results.some(result => result.item.contributorPolicyId === prereq.contributorPolicyId);
                  })
                }
              >
                <ComboboxInput
                  className="w-full"
                  placeholder={selectedPrerequisite?.title ?? placeholder}
                />
                <ComboboxContent>
                  {availablePrerequisites.map((prereq) => (
                    <ComboboxItem
                      key={prereq.contributorPolicyId}
                      value={prereq.contributorPolicyId}
                      label={prereq.title ?? "Untitled Prerequisite"}
                    >
                      <PrerequisiteItem prerequisite={prereq} />
                    </ComboboxItem>
                  ))}
                  <ComboboxEmpty>No matching prerequisites found.</ComboboxEmpty>
                </ComboboxContent>
              </ComboBox>
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  );
}
