import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[rgb(var(--border-subtle))] bg-[rgb(var(--surface-alt))] px-2.5 py-1 text-xs font-medium uppercase tracking-[0.08em] text-[rgb(var(--text-secondary))]",
        className,
      )}
      {...props}
    />
  );
}
