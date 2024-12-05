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
  PENDING_TX: 2,
  ON_CHAIN: 3,
  COMMITMENT_MADE: 4,
  COMMITMENT_DENIED: 5,
  COMMITMENT_ACCEPTED: 6,
  ARCHIVED: 7,
  BACKLOG: 8,
};
