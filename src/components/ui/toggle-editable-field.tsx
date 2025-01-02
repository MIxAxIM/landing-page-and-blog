// TODO:
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/utils/shadcn";
import FormEditButtons from "../form/form-edit-buttons";
import FormEditableField from "../form/form-editable-field";

const inputVariants = cva(
  "flex h-9 w-full bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      intent: {
        lesson:
          "bg-primary border-b border-neutral-400 text-primary-foreground",
        title: "border-b border-neutral-400 text-primary-foreground",
        slt: "flex w-[500px] border-b border-neutral-400",
        text: "bg-primary border-b border-neutral-400 text-primary-foreground",
      },
      formTextSize: {
        xl: "text-4xl text-foreground",
        lg: "text-2xl text-foreground",
        md: "text-md text-foreground",
        sm: "text-sm text-foreground",
        slt: "text-md text-foreground", //sm:w-[535px] md:w-[645px] lg:w-[735px] xl:w-[825px]
      },
    },
    defaultVariants: {
      intent: "text",
      formTextSize: "md",
    },
  },
);

export interface ToggleEditableFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
  VariantProps<typeof inputVariants> {
  label?: string;
  form: any;
  name: string;
  info?: string;
  editText: boolean;
  setEditText: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  hideButtons?: boolean;
  hasForm?: boolean;
}

const ToggleEditableField = React.forwardRef<
  HTMLInputElement,
  ToggleEditableFieldProps
>(
  (
    {
      className,
      intent,
      formTextSize,
      form,
      onSubmit,
      editText,
      setEditText,
      text,
      hideButtons,
      hasForm,
      ...props
    },
    ref,
  ) => {
    const renderField = () => (
      <FormField
        control={form.control}
        name={props.name}
        render={({ field }) => (
          <FormItem className="flex w-11/12 ">
            <FormControl className="flex w-full">
              <input
                {...field}
                placeholder={props.placeholder}
                className={cn(
                  inputVariants({ intent, formTextSize, className }),
                )}
                ref={ref}
                {...props}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );

    return (
      <>
        {hasForm ? (
          <div className="flex w-full flex-row items-center gap-5 pr-5">
            {editText ? (
              <>
                {renderField()}
                <FormEditButtons
                  hideButtons={hideButtons}
                  setEditText={setEditText}
                />
              </>
            ) : (
              <>
                <FormEditableField
                  formTextSize={formTextSize}
                  text={text}
                  setEditText={setEditText}
                />
              </>
            )}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex w-full flex-row items-center justify-between">
                {editText ? (
                  <>
                    {renderField()}
                    <FormEditButtons
                      hideButtons={hideButtons}
                      setEditText={setEditText}
                    />
                  </>
                ) : (
                  <>
                    <FormEditableField
                      formTextSize={formTextSize}
                      text={text}
                      setEditText={setEditText}
                    />
                  </>
                )}
              </div>
            </form>
          </Form>
        )}
      </>
    );
  },
);

ToggleEditableField.displayName = "ToggleEditableField";

export { inputVariants, ToggleEditableField };
