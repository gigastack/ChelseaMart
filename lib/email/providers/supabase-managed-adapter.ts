import type { AppEmailAdapter, AppEmailMessage } from "@/lib/email/types";

export function createSupabaseManagedEmailAdapter(): AppEmailAdapter {
  return {
    provider: "supabase",
    async send(_message: AppEmailMessage) {
      // Supabase Auth owns verification, recovery, and signup emails for now.
      // App-owned transactional mail can be added later without changing callers.
      return;
    },
  };
}
