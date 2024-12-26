import React from "react";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";
import { useTerminology } from "~/contexts/terminology-context";

export default function TaskSearch({
  searchQuery,
  onSearchChange,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {

  const { translatePlural } = useTerminology()
  return (
    <div className="relative w-80 rounded-md border border-primary bg-white transition-colors focus-within:border-secondary">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={`Search ${translatePlural('task')}...`}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="rounded-md border-none pl-8 focus:ring-0 focus-visible:ring-0"
      />
    </div>
  );
}
