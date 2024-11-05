import { type TaskStatus } from "@prisma/client";

export type SortDirection = "asc" | "desc";

export type TaskSortKey =
  | "index"
  | "title"
  | "description"
  | "status"
  | "lovelace"
  | "expirationTime"
  | "escrow.escrowNftPolicyId";

export interface SortConfig {
  key: TaskSortKey;
  direction: SortDirection;
}

// Define the status order
export const TASK_STATUS_ORDER: Record<TaskStatus, number> = {
  DRAFT: 0,
  APPROVED: 1,
  ON_CHAIN: 2,
  COMMITMENT_MADE: 3,
  COMPLETE: 4,
};
