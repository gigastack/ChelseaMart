import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getOptionalServerEnv } from "@/lib/config/env";
import { schema } from "@/lib/db/schema";

type DatabaseClient = ReturnType<typeof drizzle<typeof schema>>;

function createDatabaseClient(databaseUrl: string): DatabaseClient {
  const queryClient = postgres(databaseUrl, {
    max: 1,
    prepare: false,
  });

  return drizzle(queryClient, {
    schema,
  });
}

export function getOptionalDatabaseClient() {
  const { databaseUrl } = getOptionalServerEnv();

  if (!databaseUrl) {
    return null;
  }

  const dbStore = globalThis as typeof globalThis & {
    __martDatabaseClient?: DatabaseClient;
    __martDatabaseUrl?: string;
  };

  if (!dbStore.__martDatabaseClient || dbStore.__martDatabaseUrl !== databaseUrl) {
    dbStore.__martDatabaseClient = createDatabaseClient(databaseUrl);
    dbStore.__martDatabaseUrl = databaseUrl;
  }

  return dbStore.__martDatabaseClient;
}

export function getDatabaseClient() {
  const databaseClient = getOptionalDatabaseClient();

  if (!databaseClient) {
    throw new Error("DATABASE_URL is required for Drizzle-backed database access.");
  }

  return databaseClient;
}
