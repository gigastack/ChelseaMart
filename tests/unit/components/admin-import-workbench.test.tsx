import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminImportWorkbench } from "@/components/admin/admin-import-workbench";

describe("AdminImportWorkbench", () => {
  it("lets admins choose the keyword-search platform explicitly", () => {
    render(<AdminImportWorkbench />);

    const taobaoButton = screen.getByRole("button", { name: /taobao/i });
    fireEvent.click(taobaoButton);

    expect(taobaoButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/keyword search will use taobao/i)).toBeVisible();
  });

  it("auto-detects taobao urls and exposes the inferred platform", () => {
    render(<AdminImportWorkbench />);

    const urlInput = screen.getByLabelText(/source urls/i);
    fireEvent.change(urlInput, { target: { value: "https://item.taobao.com/item.htm?id=7001" } });

    expect(screen.getByText(/taobao inferred from the first url/i)).toBeVisible();
    expect(screen.getByText(/url imports will resolve using taobao/i)).toBeVisible();
  });
});
