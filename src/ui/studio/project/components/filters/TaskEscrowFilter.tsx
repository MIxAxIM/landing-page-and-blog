import React from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { type Escrow } from "~/types/db";
import { cn } from "~/utils/shadcn";

export default function TaskEscrowFilter({
  escrows,
  selectedEscrows,
  onChange,
}: {
  escrows: Escrow[];
  selectedEscrows: string[];
  onChange: (escrowIds: string[]) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const toggleEscrow = (escrowId: string) => {
    if (selectedEscrows.includes(escrowId)) {
      onChange(selectedEscrows.filter((id) => id !== escrowId));
    } else {
      onChange([...selectedEscrows, escrowId]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          intent="outline"
          size="sm"
          className={cn(
            "h-8",
            selectedEscrows.length < escrows.length && "border-dashed",
          )}
        >
          <span>Filter by Project</span>
          <Badge variant="secondary" className="ml-2 rounded-sm">
            {selectedEscrows.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit bg-primary p-1 pb-2">
        <div className="w-60 space-y-1">
          {escrows.map((escrow) => (
            <div key={escrow.id} className="flex items-center space-x-1">
              <label htmlFor={escrow.id} className="flex-grow cursor-pointer">
                <Badge
                  className={cn(
                    "w-full items-center justify-between font-normal",
                    "bg-slate-100 text-slate-800",
                  )}
                >
                  <>
                    {escrow.title}
                    <Checkbox
                      id={escrow.id}
                      checked={selectedEscrows.includes(escrow.id)}
                      onCheckedChange={() => toggleEscrow(escrow.id)}
                    />
                  </>
                </Badge>
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
