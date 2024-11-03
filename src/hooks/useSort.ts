import { type TaskStatus } from "@prisma/client";
import { useState, useCallback } from "react";
import {
  type SortConfig,
  type SortDirection,
  TASK_STATUS_ORDER,
  type TaskSortKey,
} from "~/types/sorting";

// Type for nested property paths of an object
export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends
    | object
    | undefined
    ? `${Key}` | `${Key}.${NestedKeyOf<NonNullable<ObjectType[Key]>>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

// Type-safe helper function to get nested object values
export function getNestedValue<T extends object>(
  obj: T,
  path: TaskSortKey,
): unknown {
  const value = path.split(".").reduce((acc: unknown, part: string) => {
    if (acc === null || acc === undefined) return acc;
    return (acc as Record<string, unknown>)[part];
  }, obj);

  // If the value is a TaskStatus, return its order number
  if (typeof value === "string" && value in TASK_STATUS_ORDER) {
    return TASK_STATUS_ORDER[value as TaskStatus];
  }

  return value;
}

export function useSort<T extends object>(
  items: T[],
  defaultKey: TaskSortKey = "" as TaskSortKey,
  defaultDirection: SortDirection = "asc",
) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: defaultKey,
    direction: defaultDirection,
  });

  const requestSort = useCallback(
    (key: TaskSortKey) => {
      let direction: SortDirection = "asc";
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      setSortConfig({ key, direction });
    },
    [sortConfig],
  );

  const sortedItems = useCallback(() => {
    if (!sortConfig.key) return items;

    return [...items].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key as TaskSortKey);
      const bValue = getNestedValue(b, sortConfig.key as TaskSortKey);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Handle numeric values (including string representations)
      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        return sortConfig.direction === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      // Handle string values
      const compareResult = String(aValue).localeCompare(String(bValue));
      return sortConfig.direction === "asc" ? compareResult : -compareResult;
    });
  }, [items, sortConfig]);

  return { sortedItems: sortedItems(), sortConfig, requestSort };
}
