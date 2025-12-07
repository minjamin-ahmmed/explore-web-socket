"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { motion, type MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "default"
  | "outline"
  | "ghost"
  | "secondary"
  | "destructive";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    MotionProps {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: "xs" | "sm" | "md" | "lg" | "icon";
}

const baseClasses =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  outline:
    "border border-border bg-background/60 hover:bg-accent hover:text-accent-foreground",
  ghost:
    "bg-transparent hover:bg-accent text-muted-foreground hover:text-foreground",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  xs: "h-7 rounded-sm px-2 text-xs",
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-3 text-sm",
  lg: "h-10 px-4 text-sm",
  icon: "h-9 w-9",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "md", asChild = false, ...props },
    ref
  ) => {
    const Comp: React.ElementType = asChild ? Slot : motion.button;

    const motionProps: MotionProps = asChild
      ? {}
      : {
          whileTap: { scale: 0.96 },
          whileHover: { y: -1 },
          transition: { duration: 0.15, ease: "easeOut" },
        };

    return (
      <Comp
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          "motion-safe:transition-all motion-safe:duration-150",
          className
        )}
        {...motionProps}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

