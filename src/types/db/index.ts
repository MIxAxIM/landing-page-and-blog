import { type RouterOutputs } from "~/utils/api";

export * from "./organization"
export * from "./course"
export * from "./contribution"
// Stripe payment types
export type Subscription = RouterOutputs["billing"]["getCurrentSubscription"]

export type User = RouterOutputs["user"]["getUserByName"][number] & {
  isAdmin: boolean;
};

