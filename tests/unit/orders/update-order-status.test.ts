import { describe, expect, it } from "vitest";
import { updateOrderStatus } from "@/lib/orders/update-order-status";

describe("updateOrderStatus", () => {
  it("records an audit event and returns the new status", async () => {
    const result = await updateOrderStatus({
      actorId: "admin-1",
      currentStatus: "processing",
      nextStatus: "shipped",
      orderId: "order-1",
    });

    expect(result.status).toBe("shipped");
    expect(result.auditEvent).toMatchObject({
      orderId: "order-1",
      status: "shipped",
    });
  });
});
