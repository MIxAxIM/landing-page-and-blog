import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import toast from "react-hot-toast";

// Zod schema for recurring billing
const recurringSchema = z.object({
  interval: z.enum(["day", "week", "month", "year"]),
  intervalCount: z.string().min(1),
});

// Zod schema for the price form
const createPriceSchema = z.object({
  productId: z.string().min(1, "Product selection is required"),
  unitAmount: z.string().min(0, "Amount must be 0 or greater"),
  currency: z.string().min(3, "Currency code is required"), // Usually 'usd', 'eur', etc.
  recurring: recurringSchema,
  trialPeriodDays: z.string().min(0),
});

type FormValues = z.infer<typeof createPriceSchema>;

export default function CreatePriceForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Query to get the list of products
  const { data: products, isLoading: isLoadingProducts } = api.admin.getAllProducts.useQuery();

  const { mutate: createPrice } = api.admin.createPrice.useMutation({
    onSuccess: () => {
      toast.success("Price created successfully");
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
      setIsSubmitting(false);
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(createPriceSchema),
    defaultValues: {
      productId: "",
      unitAmount: "0",
      currency: "usd",
      recurring: {
        interval: "month",
        intervalCount: "1",
      },
      trialPeriodDays: "0",
    },
  });

  const onSubmit = (data: FormValues) => {
    // Convert amount to cents/smallest currency unit for Stripe
    const formData = {
      ...data,
      unitAmount: (parseInt(data.unitAmount) * 100).toString(),
    };

    setIsSubmitting(true);
    createPrice(formData);
  };

  if (isLoadingProducts) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-8">
      <h2>Create New Price</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {products?.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="unitAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                      <SelectItem value="gbp">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="recurring.interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Interval</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="day">Daily</SelectItem>
                      <SelectItem value="week">Weekly</SelectItem>
                      <SelectItem value="month">Monthly</SelectItem>
                      <SelectItem value="year">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recurring.intervalCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interval Count</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="trialPeriodDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trial Period (Days)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    placeholder="Optional trial period"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isLoadingProducts}
          >
            {isSubmitting ? "Creating..." : "Create Price"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
