import React from 'react';
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
import { Button } from '~/components/ui/button';

interface SearchableComboboxProps<T> {
  items: T[];
  triggerText: string;
  searchPlaceholder: string;
  emptyStateComponent: React.ReactNode;
  onSelect: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
  filterItems: (items: T[], query: string) => T[];
  getItemValue: (item: T) => string;
  popoverWidth?: string;
}

export function SearchableCombobox<T>({
  items,
  triggerText,
  searchPlaceholder,
  emptyStateComponent,
  onSelect,
  renderItem,
  filterItems,
  getItemValue,
  popoverWidth = "min-w-7xl"
}: SearchableComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredItems, setFilteredItems] = React.useState<T[]>(items)

  React.useEffect(() => {
    const _items = filterItems(items, searchQuery.toLowerCase())
    setFilteredItems(_items)
  }, [items, searchQuery, filterItems])


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button value={searchQuery} role="combobox">
          {triggerText}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`border border-primary p-4 ${popoverWidth}`}
        align="start"
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>{emptyStateComponent}</CommandEmpty>
            <CommandGroup>
              {filteredItems.map((item) => (
                <CommandItem
                  key={getItemValue(item)}
                  value={JSON.stringify(item)}
                  className="cursor-pointer px-2 py-1.5 hover:bg-muted"
                  onSelect={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  {renderItem(item)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
