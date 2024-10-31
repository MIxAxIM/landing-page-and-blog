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
}

export default function FormInput(props: InputProps) {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem>
          {props.label && (
            <FormLabel className="text-foreground">{props.label}</FormLabel>
          )}
          {props.info && <FormDescription>{props.info}</FormDescription>}
          <FormControl>
            <Input
              {...field}
              placeholder={props.placeholder}
              className="borderforeground my-3 border-b"
              disabled={props.disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
