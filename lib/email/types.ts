export type AppEmailTemplate =
  | "order-confirmed"
  | "order-status-updated"
  | "payment-received"
  | "support-follow-up";

export type AppEmailPayload = {
  html?: string;
  subject: string;
  text: string;
};

export type AppEmailMessage = {
  payload: AppEmailPayload;
  recipient: string;
  template: AppEmailTemplate;
};

export type AppEmailAdapter = {
  provider: "smtp" | "supabase";
  send(message: AppEmailMessage): Promise<void>;
};
