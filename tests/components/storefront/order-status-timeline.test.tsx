import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OrderStatusTimeline } from "@/components/storefront/order-status-timeline";

describe("OrderStatusTimeline", () => {
  it("renders the order statuses in sequence", () => {
    render(<OrderStatusTimeline currentStatus="processing" />);

    expect(screen.getByText("processing")).toBeInTheDocument();
    expect(screen.getByText("shipped")).toBeInTheDocument();
    expect(screen.getByText("delivered")).toBeInTheDocument();
  });
});
