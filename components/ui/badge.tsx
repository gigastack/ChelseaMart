import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[rgba(var(--border-strong),0.5)] bg-[rgba(var(--surface-card),0.88)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--text-secondary))]",
        className,
      )}
      {...props}
    />
  );
}
