import { describe, expect, it } from "vitest";
import {
  addSessionCartItem,
  normalizeSessionCartItems,
  removeSessionCartItem,
  updateSessionCartItemQuantity,
} from "@/lib/cart/session";

describe("cart session helpers", () => {
  it("normalizes payloads, removes invalid rows, and merges duplicate product ids", () => {
    expect(
      normalizeSessionCartItems({
        items: [
          { productId: "prod-1", quantity: 1 },
          { productId: "prod-1", quantity: 2 },
          { productId: "", quantity: 4 },
          { productId: "prod-2", quantity: 0 },
          { productId: "prod-3", quantity: 3.4 },
        ],
      }),
    ).toEqual([
      { productId: "prod-1", quantity: 3 },
      { productId: "prod-3", quantity: 3 },
    ]);
  });

  it("adds quantities onto an existing line", () => {
    expect(
      addSessionCartItem(
        [
          { productId: "prod-1", quantity: 2 },
          { productId: "prod-2", quantity: 1 },
        ],
        { productId: "prod-1", quantity: 4 },
      ),
    ).toEqual([
      { productId: "prod-1", quantity: 6 },
      { productId: "prod-2", quantity: 1 },
    ]);
  });

  it("updates and removes lines cleanly", () => {
    const updated = updateSessionCartItemQuantity(
      [
        { productId: "prod-1", quantity: 2 },
        { productId: "prod-2", quantity: 1 },
      ],
      "prod-1",
      5,
    );

    expect(updated).toEqual([
      { productId: "prod-1", quantity: 5 },
      { productId: "prod-2", quantity: 1 },
    ]);

    expect(removeSessionCartItem(updated, "prod-2")).toEqual([{ productId: "prod-1", quantity: 5 }]);
  });
});
