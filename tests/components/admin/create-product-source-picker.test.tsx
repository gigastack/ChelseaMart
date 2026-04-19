import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CreateProductSourcePicker } from "@/components/admin/create-product-source-picker";

describe("CreateProductSourcePicker", () => {
  it("requires choosing manual or api before continuing", () => {
    render(<CreateProductSourcePicker />);

    expect(screen.getByText("Manual Upload")).toBeInTheDocument();
    expect(screen.getByText("Fetch from API")).toBeInTheDocument();
    expect(screen.getByText(/start with a source choice/i)).toBeInTheDocument();
  });
});
