"use client";

import { useActionState } from "react";
import { initialAddToCartState } from "@/app/(storefront)/cart/action-state";
import { addToCartAction } from "@/app/(storefront)/cart/actions";
import { Button } from "@/components/ui/button";

type AddToCartFormProps = {
  effectiveMoq: number;
  productId: string;
};

export function AddToCartForm({ effectiveMoq, productId }: AddToCartFormProps) {
  const [state, formAction, isPending] = useActionState(addToCartAction, initialAddToCartState);

  return (
    <form action={formAction} className="grid gap-3">
      <input name="productId" type="hidden" value={productId} />

      <label className="grid gap-2 text-sm font-medium text-[rgb(var(--text-primary))]">
        Quantity
        <input
          className="min-h-12 rounded-[var(--radius-md)] border border-[rgba(var(--border-subtle),0.92)] bg-[rgb(var(--surface-base))] px-4 text-sm text-[rgb(var(--text-primary))]"
          defaultValue={effectiveMoq}
          min={effectiveMoq}
          name="quantity"
          step={1}
          type="number"
        />
      </label>

      <p className="text-sm text-[rgb(var(--text-secondary))]">Minimum order: {effectiveMoq}</p>

      <Button className="w-full" disabled={isPending} size="lg" type="submit">
        {isPending ? "Adding..." : "Add to cart"}
      </Button>

      {state.message ? (
        <p
          className={
            state.status === "error"
              ? "text-sm text-[rgb(var(--danger))]"
              : "text-sm text-[rgb(var(--brand-700))]"
          }
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
