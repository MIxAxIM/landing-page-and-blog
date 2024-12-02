import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLSelectElement> {
  options: { value: any; label: any }[];
}

export default function SelectNetwork(props: Props) {
  return (
    <select
      {...props}
      className={clsx([
        props.className,
        "mt-2 block w-48 rounded-md border-0 bg-primary px-5 py-1 text-primary-foreground ring-1 ring-inset ring-accent focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6",
      ])}
    >
      {props.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
