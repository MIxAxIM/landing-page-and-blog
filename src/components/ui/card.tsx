import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/utils/shadcn";

const cardVariants = cva("", {
  variants: {
    intent: {
      default:
        "rounded-sm border border-primary bg-card text-card-foreground shadow",
      course:
        "border border-foreground bg-background text-foreground hover:bg-secondary hover:text-secondary-foreground rounded-xl font-libreFranklin",
      module:
        "flex flex-row justify-between rounded-md bg-primary text-primary-foreground hover:secondary-foreground",
      slt: "px-3 py-1 flex flex-row items-center gap-10 bg-background my-3 rounded-md",
      none: "flex w-full items-center justify-between",
      roleStatus:
        "flex flex-row w-full gap-3 items-center bg-background text-foreground px-3",
      sideNav:
        "rounded-none bg-background text-foreground flex flex-row justify-between hover:bg-secondary",
      dashboard:
        "flex flex-col items-center justify-center gap-5 bg-card shadow rounded-md",
    },
    size: {
      default: "px-5 py-3",
      md: "min-h-12",
      sm: "min-h-8",
      wide: "w-11/12 mx-auto my-5 px-10 py-3",
      loading: "mx-auto my-5 px-10 py-3",
      dashboard: "w-2/3 mx-auto mt-10 min-h-[40vh]",
    },
  },
  defaultVariants: {
    intent: "default",
    size: "default",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, intent, size, ...props }, ref) => (
    <div
      className={cn(cardVariants({ intent, size, className }))}
      ref={ref}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

const CardIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-10 w-10 items-center justify-center rounded-full bg-muted",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));
CardIcon.displayName = "CardIcon";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardIcon,
};
