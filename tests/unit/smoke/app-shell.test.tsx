import { render, screen } from "@testing-library/react";
import { RootLayout } from "@/app/layout";

describe("RootLayout", () => {
  it("renders the global app shell", () => {
    render(
      <RootLayout>
        <div>app-child</div>
      </RootLayout>,
    );

    expect(screen.getByText("app-child")).toBeInTheDocument();
  });
});
