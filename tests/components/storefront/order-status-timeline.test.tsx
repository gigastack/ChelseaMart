import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OrderStatusTimeline } from "@/components/storefront/order-status-timeline";

describe("OrderStatusTimeline", () => {
  it("renders the order statuses in sequence", () => {
    render(<OrderStatusTimeline currentStatus="awaiting_shipping_payment" />);

    expect(screen.getByText("awaiting shipping payment")).toBeInTheDocument();
    expect(screen.getByText("in transit")).toBeInTheDocument();
    expect(screen.getByText("delivered")).toBeInTheDocument();
  });
});
