import { getServerEnv } from "@/lib/config/env";
import { createSmtpEmailAdapter } from "@/lib/email/providers/smtp-adapter";
import { createSupabaseManagedEmailAdapter } from "@/lib/email/providers/supabase-managed-adapter";
import type { AppEmailAdapter } from "@/lib/email/types";

export function createAppEmailAdapter(): AppEmailAdapter {
  const { email } = getServerEnv();

  if (email.provider === "smtp") {
    if (!email.from) {
      throw new Error("EMAIL_FROM is required when EMAIL_PROVIDER=smtp.");
    }

    if (!email.smtp?.host) {
      throw new Error("SMTP_HOST is required when EMAIL_PROVIDER=smtp.");
    }

    return createSmtpEmailAdapter({
      from: email.from,
      host: email.smtp.host,
      pass: email.smtp.pass,
      port: email.smtp.port,
      secure: email.smtp.secure,
      user: email.smtp.user,
    });
  }

  return createSupabaseManagedEmailAdapter();
}
