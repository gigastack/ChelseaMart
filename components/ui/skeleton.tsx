import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--radius-md)] bg-[linear-gradient(90deg,rgba(var(--surface-alt),1)_0%,rgba(var(--border-subtle),0.9)_50%,rgba(var(--surface-alt),1)_100%)] bg-[length:200%_100%]",
        className,
      )}
      {...props}
    />
  );
}
