import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

function loadEnvFile(filename) {
  const filePath = path.join(projectRoot, filename);

  if (!fs.existsSync(filePath)) {
    return {};
  }

  return fs.readFileSync(filePath, "utf8").split(/\r?\n/).reduce((env, line) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      return env;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      return env;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    env[key] = rawValue.replace(/^['"]|['"]$/g, "");
    return env;
  }, {});
}

function getEnv(key) {
  const envFiles = {
    ...loadEnvFile(".env"),
    ...loadEnvFile(".env.local"),
  };

  return process.env[key] ?? envFiles[key];
}

async function applySupplementalSql(sqlClient) {
  const supplementalDir = path.join(projectRoot, "supabase", "sql");

  if (!fs.existsSync(supplementalDir)) {
    return;
  }

  const sqlFiles = fs
    .readdirSync(supplementalDir)
    .filter((entry) => entry.endsWith(".sql"))
    .sort((left, right) => left.localeCompare(right));

  for (const sqlFile of sqlFiles) {
    const sqlText = fs.readFileSync(path.join(supplementalDir, sqlFile), "utf8").trim();

    if (!sqlText) {
      continue;
    }

    await sqlClient.unsafe(sqlText);
  }
}

async function applyHostedSchema() {
  const databaseUrl = getEnv("DATABASE_URL");

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to apply Drizzle migrations to Supabase Postgres.");
  }

  const sqlClient = postgres(databaseUrl, {
    max: 1,
    prepare: false,
  });

  try {
    await sqlClient`create extension if not exists pgcrypto;`;

    const db = drizzle(sqlClient);
    await migrate(db, {
      migrationsFolder: path.join(projectRoot, "drizzle"),
    });
    await applySupplementalSql(sqlClient);

    console.log("Hosted Supabase schema applied.");
  } finally {
    await sqlClient.end();
  }
}

applyHostedSchema().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
