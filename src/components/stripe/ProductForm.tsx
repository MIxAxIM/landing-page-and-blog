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
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import { X } from "lucide-react";
import toast from "react-hot-toast";

// Zod schema for a feature
const featureSchema = z.object({
  name: z.string().min(1, "Feature name is required"),
  value: z.string().min(1, "Feature value is required"),
  description: z.string().min(1, "Feature description is required"),
});

// Zod schema for the entire form
const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional(),
  maxAllowedCourses: z.number().min(0, "Must be 0 or greater"),
  maxAllowedTreasuries: z.number().min(0, "Must be 0 or greater"),
  treasuryDepositLimit: z.number().min(0, "Must be 0 or greater"),
  canPublish: z.boolean(),
  transactionFeeDiscount: z.number().min(0).max(100, "Must be between 0 and 100"),
  additionalFeatures: z.array(featureSchema),
});

type FormValues = z.infer<typeof createProductSchema>;

export default function ProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: createProduct } = api.admin.createProduct.useMutation({
    onSuccess: () => {
      toast.success("Product created successfully");
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
      setIsSubmitting(false);
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      maxAllowedCourses: 0,
      maxAllowedTreasuries: 0,
      treasuryDepositLimit: 0,
      canPublish: false,
      transactionFeeDiscount: 0,
      additionalFeatures: [],
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    createProduct(data);
  };

  const addFeature = () => {
    const currentFeatures = form.getValues("additionalFeatures");
    form.setValue("additionalFeatures", [
      ...currentFeatures,
      { name: "", value: "", description: "" },
    ]);
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("additionalFeatures");
    form.setValue(
      "additionalFeatures",
      currentFeatures.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-8">
      <h2>Create New Product</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter product description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Enter image URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="maxAllowedCourses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Allowed Courses</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxAllowedTreasuries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Allowed Treasuries</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="treasuryDepositLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Treasury Deposit Limit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="transactionFeeDiscount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Fee Discount (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="canPublish"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Can Publish</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3>Additional Features</h3>
              <Button type="button" onClick={addFeature}>
                Add Feature
              </Button>
            </div>

            {form.watch("additionalFeatures").map((_, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-md relative">
                <Button
                  type="button"
                  size="sm"
                  intent="destructive"
                  className="absolute right-2 top-2"
                  onClick={() => removeFeature(index)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <FormField
                  control={form.control}
                  name={`additionalFeatures.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feature Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`additionalFeatures.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feature Value</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`additionalFeatures.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feature Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
