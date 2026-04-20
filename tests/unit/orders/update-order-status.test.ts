import { describe, expect, it } from "vitest";
import { updateOrderStatus } from "@/lib/orders/update-order-status";

describe("updateOrderStatus", () => {
  it("records an audit event and returns the new status", async () => {
    const result = await updateOrderStatus({
      actorId: "admin-1",
      currentStatus: "shipping_paid",
      nextStatus: "in_transit",
      orderId: "order-1",
    });

    expect(result.status).toBe("in_transit");
    expect(result.auditEvent).toMatchObject({
      orderId: "order-1",
      status: "in_transit",
    });
  });
});
