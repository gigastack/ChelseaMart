import { describe, expect, it } from "vitest";
import { resolveEffectiveMoq } from "@/lib/settings/commerce-settings";

describe("commerce settings", () => {
  it("uses the product override when present", () => {
    expect(resolveEffectiveMoq({ defaultMoq: 3, moqOverride: 6 })).toBe(6);
  });

  it("falls back to the global default when a product has no override", () => {
    expect(resolveEffectiveMoq({ defaultMoq: 3, moqOverride: null })).toBe(3);
  });

  it("rejects invalid defaults and overrides", () => {
    expect(() => resolveEffectiveMoq({ defaultMoq: 0, moqOverride: null })).toThrow(/MOQ/i);
    expect(() => resolveEffectiveMoq({ defaultMoq: 3, moqOverride: 0 })).toThrow(/MOQ/i);
  });
});
