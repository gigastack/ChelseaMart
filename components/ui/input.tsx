import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-[var(--radius-md)] border border-[rgba(var(--border-strong),0.65)] bg-[rgba(var(--surface-card),0.94)] px-3 py-2 text-sm text-[rgb(var(--text-primary))] shadow-[0_12px_24px_rgba(4,47,46,0.05)] transition-colors placeholder:text-[rgb(var(--text-secondary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand-500))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      type={type}
      {...props}
    />
  );
}
