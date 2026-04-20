import nodemailer from "nodemailer";
import type { AppEmailAdapter, AppEmailMessage } from "@/lib/email/types";

type SmtpAdapterConfig = {
  from: string;
  host: string;
  pass?: string;
  port: number;
  secure: boolean;
  user?: string;
};

export function createSmtpEmailAdapter(config: SmtpAdapterConfig): AppEmailAdapter {
  const transporter = nodemailer.createTransport({
    auth: config.user
      ? {
          pass: config.pass,
          user: config.user,
        }
      : undefined,
    host: config.host,
    port: config.port,
    secure: config.secure,
  });

  return {
    provider: "smtp",
    async send(message: AppEmailMessage) {
      await transporter.sendMail({
        from: config.from,
        html: message.payload.html,
        subject: message.payload.subject,
        text: message.payload.text,
        to: message.recipient,
      });
    },
  };
}
