import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { CartItemRecord } from "@/lib/orders/repository";

type CartListProps = {
  items: CartItemRecord[];
};

export function CartList({ items }: CartListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Link className="text-base font-semibold text-[rgb(var(--text-primary))]" href={`/products/${item.slug}`}>
                {item.title}
              </Link>
              <p className="text-sm text-[rgb(var(--text-secondary))]">Quantity: {item.quantity}</p>
              <p className="text-sm text-[rgb(var(--text-secondary))]">MOQ: 1</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-[rgb(var(--text-secondary))]">{item.priceDisplay}</p>
              <p className="text-base font-semibold text-[rgb(var(--text-primary))]">
                NGN {(item.sellPriceNgn * item.quantity).toLocaleString("en-NG")}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
