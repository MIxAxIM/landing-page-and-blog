import { useForm } from "react-hook-form";
import MenuBar from "../../../../../ui/landing/MenuBar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/utils/shadcn";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "~/components/ui/calendar";
import { format } from "date-fns";
import { Textarea } from "~/components/ui/textarea";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  expiration: z.date(),
  ada_amount: z.coerce.number(),
  project_token_amount: z.coerce.number(),
});

export default function NewProject() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      expiration: new Date("1900-01-01"),
      ada_amount: 10.45,
      project_token_amount: 10,
    },
  });

  const { control, handleSubmit, formState: { errors } } = form;

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <div>
      <MenuBar />

      <main className="px-10 py-24">
        <div className="flex flex-col justify-center">
          <h2 className="flex scroll-m-20 justify-center border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            New Project
          </h2>
        </div>

        <div className="rounded-md bg-white p-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Type your message here." {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="expiration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            className={`w-[240px] justify-start text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => field.onChange(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>
                      This is your project expiration date.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ada_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ada_amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="shadcn"
                        type="number"
                        step="any"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="project_token_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>project_token_amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="shadcn"
                        type="number"
                        step="any"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mr-4">Save Draft</Button>
              <Button type="submit">Publish</Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
