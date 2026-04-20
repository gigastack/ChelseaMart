import type { User } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { getUserAccess, normalizeEmail, parseProfileRole, type ProfileRole, type UserAccess } from "@/lib/auth/access";
import { getOptionalServerEnv } from "@/lib/config/env";
import { getOptionalDatabaseClient } from "@/lib/db/client";
import { profiles } from "@/lib/db/schema";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export type UserProfileRecord = {
  email: string | null;
  fullName: string | null;
  role: ProfileRole;
  userId: string;
};

function inferBootstrapRole(email: string | null, adminEmails: string[]) {
  if (!email) {
    return "customer" as const;
  }

  return adminEmails.includes(email) ? ("admin" as const) : ("customer" as const);
}

function readMetadataRole(user: User) {
  const metadataRole =
    user.app_metadata && typeof user.app_metadata === "object" && "role" in user.app_metadata
      ? user.app_metadata.role
      : null;

  return typeof metadataRole === "string" ? parseProfileRole(metadataRole) : null;
}

function readFullName(user: User) {
  const fullName =
    user.user_metadata && typeof user.user_metadata === "object" && "full_name" in user.user_metadata
      ? user.user_metadata.full_name
      : null;

  return typeof fullName === "string" && fullName.trim() ? fullName.trim() : null;
}

function isMissingProfilesTable(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const message = "message" in error && typeof error.message === "string" ? error.message : "";
  return message.toLowerCase().includes("profiles");
}

export async function resolveUserProfile(user: User): Promise<UserProfileRecord | null> {
  const { adminEmails, supabaseServiceRoleKey } = getOptionalServerEnv();
  const email = normalizeEmail(user.email);
  const metadataRole = readMetadataRole(user);
  const bootstrapRole = inferBootstrapRole(email, adminEmails);
  const fallbackRole = metadataRole ?? bootstrapRole;
  const databaseClient = getOptionalDatabaseClient();

  if (!databaseClient && !supabaseServiceRoleKey) {
    return {
      email,
      fullName: readFullName(user),
      role: fallbackRole,
      userId: user.id,
    };
  }

  const supabase = supabaseServiceRoleKey ? createSupabaseServiceRoleClient() : null;

  try {
    const profileRow = databaseClient
      ? await databaseClient.query.profiles.findFirst({
          where: eq(profiles.userId, user.id),
        })
      : (() => {
          throw new Error("Drizzle database client is not configured.");
        })();

    const databaseRole = parseProfileRole(profileRow?.role);
    const nextRole = databaseRole ?? fallbackRole;
    const fullName = profileRow?.fullName ?? readFullName(user);

    const shouldUpsert =
      !profileRow ||
      profileRow.email !== email ||
      profileRow.fullName !== fullName ||
      profileRow.role !== nextRole;

    if (shouldUpsert) {
      await databaseClient!.insert(profiles).values({
        email,
        fullName,
        role: nextRole,
        userId: user.id,
      }).onConflictDoUpdate({
        set: {
          email,
          fullName,
          role: nextRole,
          updatedAt: new Date(),
        },
        target: profiles.userId,
      });
    }

    if (supabase && metadataRole !== nextRole) {
      const mergedMetadata =
        user.app_metadata && typeof user.app_metadata === "object"
          ? {
              ...user.app_metadata,
              role: nextRole,
            }
          : {
              role: nextRole,
            };

      await supabase.auth.admin.updateUserById(user.id, {
        app_metadata: mergedMetadata,
      });
    }

    return {
      email,
      fullName,
      role: nextRole,
      userId: user.id,
    };
  } catch (error) {
    if (!databaseClient && isMissingProfilesTable(error)) {
      return {
        email,
        fullName: readFullName(user),
        role: fallbackRole,
        userId: user.id,
      };
    }

    return {
      email,
      fullName: readFullName(user),
      role: fallbackRole,
      userId: user.id,
    };
  }
}

export async function getUserAccessFromUser(user: User | null): Promise<UserAccess> {
  if (!user) {
    return getUserAccess(null, null);
  }

  const profile = await resolveUserProfile(user);
  return getUserAccess(profile?.email ?? user.email ?? null, profile?.role ?? null);
}
