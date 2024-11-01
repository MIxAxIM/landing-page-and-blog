// TODO:
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type { InputHTMLAttributes } from "react";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  form: any;
  name: string;
  info?: string;
  type?: "text" | "number";
}

export default function FormInput(props: InputProps) {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem>
          {props.label && (
            <FormLabel className="text-foreground">{props.label}</FormLabel>
          )}
          {props.info && <FormDescription>{props.info}</FormDescription>}
          <FormControl>
            <Input
              {...field}
              type={props.type ?? "text"}
              value={value ?? ""}
              onChange={(e) => {
                if (props.type === "number") {
                  // Convert empty string to null/undefined, otherwise convert to number
                  const value =
                    e.target.value === "" ? undefined : Number(e.target.value);
                  onChange(value);
                } else {
                  onChange(e.target.value);
                }
              }}
              placeholder={props.placeholder}
              className="borderforeground my-3 border-b"
              disabled={props.disabled}
              // Add number-specific props when type is number
              {...(props.type === "number" && {
                min: props.min,
                max: props.max,
                step: props.step ?? 1,
              })}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
