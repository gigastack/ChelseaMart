import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "@/components/storefront/product-card";

describe("ProductCard", () => {
  it("shows the product price and the checkout logistics note", () => {
    render(
      <ProductCard
        product={{
          id: "p1",
          imageUrl: "/lamp.jpg",
          priceDisplay: "NGN 20,000",
          slug: "desk-lamp",
          title: "Desk Lamp",
        }}
      />,
    );

    expect(screen.getByText("Desk Lamp")).toBeInTheDocument();
    expect(screen.getByText("NGN 20,000")).toBeInTheDocument();
    expect(screen.getByText("Logistics added at checkout")).toBeInTheDocument();
  });
});
