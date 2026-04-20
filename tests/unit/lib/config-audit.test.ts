import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..", "..", "..");

describe("config audit", () => {
  it("keeps runtime provider hosts out of service modules", () => {
    const elimClient = fs.readFileSync(path.join(projectRoot, "lib", "imports", "elim-client.ts"), "utf8");
    const paystackClient = fs.readFileSync(
      path.join(projectRoot, "lib", "payments", "create-paystack-transaction.ts"),
      "utf8",
    );

    expect(elimClient).not.toContain("https://elim.asia");
    expect(elimClient).not.toContain("https://api.elim.asia");
    expect(paystackClient).not.toContain("https://api.paystack.co");
  });

  it("documents env usage without shipping real values", () => {
    const envExample = fs.readFileSync(path.join(projectRoot, ".env.example"), "utf8");

    expect(envExample).toContain("ELIM_API_BASE_URL=");
    expect(envExample).toContain("DATABASE_URL=");
    expect(envExample).toContain("PAYSTACK_API_BASE_URL=");
    expect(envExample).toContain("EMAIL_PROVIDER=");
    expect(envExample).toContain("SMTP_HOST=");
    expect(envExample).toContain("ELIM_API_KEY=your-elim-bearer-key");
    expect(envExample).not.toContain("sk_live_");
  });
});
