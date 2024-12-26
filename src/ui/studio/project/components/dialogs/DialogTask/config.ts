import { z } from "zod";
import { startOfDay } from "date-fns";

export const MIN_ADA = 10;
export const MIN_HOURS_FUTURE = 168;

export const getMinDate = () => {
  const date = new Date();
  date.setHours(date.getHours() + MIN_HOURS_FUTURE);
  return startOfDay(date);
};

export const FormSchema = z.object({
  title: z.string().min(1, "Please enter a task title"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters long"),
  acceptanceCriteria: z
    .array(z.string())
    .transform((criteria) => criteria.filter((c) => c.trim() !== ""))
    .refine(
      (criteria) => criteria.length >= 1,
      "At least one criterion must be provided",
    ),
  ada: z
    .number()
    .min(MIN_ADA, `Minimum ${MIN_ADA} Ada required`)
    .max(1000000, "Maximum 1,000,000 Ada allowed"),
  expirationTime: z
    .date()
    .min(
      getMinDate(),
      `Must be at least ${MIN_HOURS_FUTURE} hours in the future`,
    ),
});

export type FormValues = z.infer<typeof FormSchema>;
