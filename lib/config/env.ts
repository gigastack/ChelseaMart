import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  NEXT_PUBLIC_SUPABASE_URL: z.url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
});

const serverEnvSchema = z.object({
  ADMIN_EMAILS: z.string().optional(),
  ELIM_API_BASE_URL: z.url().optional(),
  ELIM_API_KEY: z.string().optional(),
  PAYSTACK_API_BASE_URL: z.url().optional(),
  PAYSTACK_SECRET_KEY: z.string().optional(),
  PAYSTACK_WEBHOOK_SECRET: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
});

export type ConfigStatus = "configured" | "missing";

export type AppEnv = {
  public: {
    siteUrl?: string;
    supabaseAnonKey: string;
    supabaseUrl: string;
  };
  server: {
    adminEmails: string[];
    elimApiBaseUrl?: string;
    elimApiKey?: string;
    paystackApiBaseUrl?: string;
    paystackSecretKey?: string;
    paystackWebhookSecret?: string;
    supabaseServiceRoleKey?: string;
  };
};

let cachedEnv: AppEnv | null = null;
let cachedServerEnv: AppEnv["server"] | null = null;

function normalizeOptional(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function formatIssues(prefix: string, issues: z.core.$ZodIssue[]) {
  return issues.map((issue) => `${prefix}${issue.path.join(".")}: ${issue.message}`).join("; ");
}

function parseServerEnv(input: Record<string, string | undefined>): AppEnv["server"] {
  const serverResult = serverEnvSchema.parse(input);

  return {
    adminEmails:
      serverResult.ADMIN_EMAILS?.split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean) ?? [],
    elimApiBaseUrl: normalizeOptional(serverResult.ELIM_API_BASE_URL),
    elimApiKey: normalizeOptional(serverResult.ELIM_API_KEY),
    paystackApiBaseUrl: normalizeOptional(serverResult.PAYSTACK_API_BASE_URL),
    paystackSecretKey: normalizeOptional(serverResult.PAYSTACK_SECRET_KEY),
    paystackWebhookSecret: normalizeOptional(serverResult.PAYSTACK_WEBHOOK_SECRET),
    supabaseServiceRoleKey: normalizeOptional(serverResult.SUPABASE_SERVICE_ROLE_KEY),
  };
}

export function parseAppEnv(input: Record<string, string | undefined>): AppEnv {
  const publicResult = publicEnvSchema.safeParse(input);

  if (!publicResult.success) {
    throw new Error(formatIssues("", publicResult.error.issues));
  }

  return {
    public: {
      siteUrl: normalizeOptional(publicResult.data.NEXT_PUBLIC_SITE_URL),
      supabaseAnonKey: publicResult.data.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrl: publicResult.data.NEXT_PUBLIC_SUPABASE_URL,
    },
    server: parseServerEnv(input),
  };
}

export function getAppEnv() {
  cachedEnv ??= parseAppEnv(process.env);
  return cachedEnv;
}

export function getPublicEnv() {
  return getAppEnv().public;
}

export function getServerEnv() {
  return getAppEnv().server;
}

export function getOptionalServerEnv() {
  cachedServerEnv ??= parseServerEnv(process.env);
  return cachedServerEnv;
}

export function getConfigStatus(value?: string | null): ConfigStatus {
  return value?.trim() ? "configured" : "missing";
}

export function hasSupabaseAuthEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim());
}
