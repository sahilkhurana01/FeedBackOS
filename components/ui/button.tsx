import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-normal transition-[color,background-color,opacity,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[#0077ed]",
        destructive: "bg-destructive text-white hover:opacity-90",
        outline:
      "border border-black/10 bg-transparent text-foreground hover:bg-secondary dark:border-white/20",
        secondary: "bg-secondary text-secondary-foreground hover:bg-[#e8e8ed]",
        ghost: "hover:bg-secondary hover:text-foreground",
        link: "rounded-none px-0 text-primary hover:underline",
        gold: "bg-secondary text-foreground hover:bg-[#e8e8ed]",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-8 px-3.5 text-xs",
        lg: "h-12 px-6 text-[17px]",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
