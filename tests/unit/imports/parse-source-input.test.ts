import { describe, expect, it } from "vitest";
import { parseSourceInput } from "@/lib/imports/parse-source-input";

describe("parseSourceInput", () => {
  it("normalizes bulk url paste into unique url tasks", () => {
    const result = parseSourceInput(`https://detail.1688.com/offer/1.html
https://detail.1688.com/offer/1.html
https://detail.1688.com/offer/2.html`);

    expect(result.mode).toBe("bulk_url");
    expect(result.entries).toEqual([
      { type: "url", value: "https://detail.1688.com/offer/1.html" },
      { type: "url", value: "https://detail.1688.com/offer/2.html" },
    ]);
  });

  it("treats plain text as a keyword search", () => {
    const result = parseSourceInput("office chair");

    expect(result.mode).toBe("keyword_search");
    expect(result.entries).toEqual([{ type: "keyword", value: "office chair" }]);
  });
});
