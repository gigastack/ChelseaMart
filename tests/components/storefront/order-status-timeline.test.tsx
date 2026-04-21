import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OrderStatusTimeline } from "@/components/storefront/order-status-timeline";

describe("OrderStatusTimeline", () => {
  it("renders order events as a customer-friendly timeline", () => {
    render(
      <OrderStatusTimeline
        currentStatus="awaiting_shipping_payment"
        statusEvents={[
          {
            createdAt: "2026-04-17T09:00:00.000Z",
            id: "event-1",
            note: "Customer accepted the selected shipping route terms.",
            orderId: "order-1",
            status: "route_selected",
          },
          {
            createdAt: "2026-04-17T09:15:00.000Z",
            id: "event-2",
            note: "Product payment completed successfully.",
            orderId: "order-1",
            status: "paid_for_products",
          },
          {
            createdAt: "2026-04-18T08:30:00.000Z",
            id: "event-3",
            note: "Customer notification sent for shipping payment.",
            orderId: "order-1",
            status: "awaiting_shipping_payment",
          },
        ]}
      />,
    );

    expect(screen.getByText("Route confirmed")).toBeInTheDocument();
    expect(screen.getByText("Products paid")).toBeInTheDocument();
    expect(screen.getByText("Shipping payment due")).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();
  });
});
