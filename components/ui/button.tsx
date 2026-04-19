import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand-500))] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[rgb(var(--brand-950))] text-[rgb(var(--surface-card))] hover:bg-[rgb(var(--brand-800))]",
        secondary:
          "border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-card))] text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--surface-alt))]",
        ghost: "text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--surface-alt))]",
        danger: "bg-[rgb(var(--danger))] text-[rgb(var(--surface-card))] hover:opacity-90",
      },
      size: {
        md: "min-h-11",
        sm: "min-h-9 px-3 py-2 text-xs",
        lg: "min-h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  type = "button",
  size,
  variant,
  ...props
}: ButtonProps) {
  return <button className={cn(buttonVariants({ size, variant }), className)} type={type} {...props} />;
}

export { buttonVariants };
