import { beforeEach, describe, expect, it, vi } from "vitest";

const getServerEnvMock = vi.fn();
const createSmtpEmailAdapterMock = vi.fn();

vi.mock("@/lib/config/env", () => ({
  getServerEnv: getServerEnvMock,
}));

vi.mock("@/lib/email/providers/smtp-adapter", () => ({
  createSmtpEmailAdapter: createSmtpEmailAdapterMock,
}));

describe("createAppEmailAdapter", () => {
  beforeEach(() => {
    vi.resetModules();
    getServerEnvMock.mockReset();
    createSmtpEmailAdapterMock.mockReset();
  });

  it("uses the Supabase-managed adapter by default", async () => {
    getServerEnvMock.mockReturnValue({
      email: {
        from: undefined,
        provider: "supabase",
        smtp: undefined,
      },
    });

    const { createAppEmailAdapter } = await import("@/lib/email/adapter");
    const adapter = createAppEmailAdapter();

    expect(adapter.provider).toBe("supabase");
    await expect(
      adapter.send({
        payload: {
          subject: "noop",
          text: "noop",
        },
        recipient: "buyer@example.com",
        template: "order-confirmed",
      }),
    ).resolves.toBeUndefined();
  });

  it("builds the SMTP adapter when smtp is selected", async () => {
    createSmtpEmailAdapterMock.mockReturnValue({
      provider: "smtp",
      send: vi.fn(),
    });
    getServerEnvMock.mockReturnValue({
      email: {
        from: "noreply@mart.example.com",
        provider: "smtp",
        smtp: {
          host: "smtp.example.com",
          pass: "smtp-pass",
          port: 587,
          secure: false,
          user: "smtp-user",
        },
      },
    });

    const { createAppEmailAdapter } = await import("@/lib/email/adapter");
    const adapter = createAppEmailAdapter();

    expect(createSmtpEmailAdapterMock).toHaveBeenCalledWith({
      from: "noreply@mart.example.com",
      host: "smtp.example.com",
      pass: "smtp-pass",
      port: 587,
      secure: false,
      user: "smtp-user",
    });
    expect(adapter.provider).toBe("smtp");
  });

  it("fails fast when smtp is selected without the required config", async () => {
    getServerEnvMock.mockReturnValue({
      email: {
        from: undefined,
        provider: "smtp",
        smtp: undefined,
      },
    });

    const { createAppEmailAdapter } = await import("@/lib/email/adapter");

    expect(() => createAppEmailAdapter()).toThrow(/email_from/i);
  });
});
