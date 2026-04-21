import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IntegrationStatusCard } from "@/components/admin/settings/integration-status-card";

describe("IntegrationStatusCard", () => {
  it("shows status without exposing secret values", () => {
    render(
      <IntegrationStatusCard
        lastRecordedAt="2026-04-17T10:00:00.000Z"
        name="Paystack"
        status="configured"
      />,
    );

    expect(screen.getByText("Paystack")).toBeInTheDocument();
    expect(screen.queryByText(/sk_/i)).not.toBeInTheDocument();
  });
});
