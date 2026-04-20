import { and, asc, desc, eq } from "drizzle-orm";
import { getOptionalDatabaseClient } from "@/lib/db/client";
import { catalogAlerts, importJobItems, importJobs, productSources, products } from "@/lib/db/schema";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export type ImportJobRecord = {
  duplicateCount: number;
  failedCount: number;
  id: string;
  importedCount: number;
  mode: "bulk_url" | "keyword_search" | "single_url";
  needsReviewCount: number;
  queuedCount: number;
  status: "completed" | "completed_with_errors" | "failed" | "processing" | "queued";
};

export type UnavailableProductRecord = {
  id: string;
  sourceProductId: string;
  statusBeforeHide: "draft" | "live" | "removed";
  title: string;
  unavailableSince: string;
};

export async function listImportJobs(): Promise<ImportJobRecord[]> {
  const databaseClient = getOptionalDatabaseClient();

  if (databaseClient) {
    const [jobs, items] = await Promise.all([
      databaseClient.select().from(importJobs).orderBy(desc(importJobs.createdAt)),
      databaseClient
        .select({
          importJobId: importJobItems.importJobId,
          status: importJobItems.status,
        })
        .from(importJobItems),
    ]);

    return jobs.map((job) => {
      const jobItems = items.filter((item) => item.importJobId === job.id);
      const needsReviewCount = jobItems.filter((item) => item.status === "needs_review").length;

      return {
        duplicateCount: job.duplicateCount,
        failedCount: job.failedCount,
        id: job.id,
        importedCount: job.importedCount,
        mode: job.mode as ImportJobRecord["mode"],
        needsReviewCount,
        queuedCount: job.submittedCount,
        status: job.status as ImportJobRecord["status"],
      };
    });
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("import_jobs")
    .select("id, mode, status, submitted_count, imported_count, failed_count, duplicate_count, import_job_items(status)")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((job) => {
    const items = Array.isArray(job.import_job_items) ? job.import_job_items : [];
    const needsReviewCount = items.filter((item) => item && typeof item === "object" && item.status === "needs_review").length;

    return {
      duplicateCount: Number(job.duplicate_count ?? 0),
      failedCount: Number(job.failed_count ?? 0),
      id: String(job.id),
      importedCount: Number(job.imported_count ?? 0),
      mode: job.mode as ImportJobRecord["mode"],
      needsReviewCount,
      queuedCount: Number(job.submitted_count ?? 0),
      status: job.status as ImportJobRecord["status"],
    };
  });
}

export async function listUnavailableProducts(): Promise<UnavailableProductRecord[]> {
  const databaseClient = getOptionalDatabaseClient();

  if (databaseClient) {
    const rows = await databaseClient
      .select({
        createdAt: catalogAlerts.createdAt,
        productId: catalogAlerts.productId,
        sourceProductId: productSources.sourceProductId,
        status: products.status,
        title: products.title,
      })
      .from(catalogAlerts)
      .leftJoin(products, eq(catalogAlerts.productId, products.id))
      .leftJoin(productSources, eq(products.id, productSources.productId))
      .where(and(eq(catalogAlerts.alertType, "source_unavailable"), eq(catalogAlerts.resolved, false)))
      .orderBy(desc(catalogAlerts.createdAt));

    return rows
      .filter((alert) => alert.productId)
      .map((alert) => ({
        id: String(alert.productId),
        sourceProductId: alert.sourceProductId ?? "unknown-source",
        statusBeforeHide: (alert.status ?? "draft") as UnavailableProductRecord["statusBeforeHide"],
        title: alert.title ?? "Unavailable product",
        unavailableSince: new Intl.DateTimeFormat("en-NG", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(String(alert.createdAt))),
      }));
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("catalog_alerts")
    .select("created_at, product_id, products(title, status, product_sources(source_product_id))")
    .eq("alert_type", "source_unavailable")
    .eq("resolved", false)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((alert) => {
    const product = alert.products as
      | {
          product_sources?: Array<{ source_product_id?: string | null }>;
          status?: "draft" | "live" | "removed";
          title?: string;
        }
      | undefined;

    return {
      id: String(alert.product_id),
      sourceProductId: product?.product_sources?.[0]?.source_product_id ?? "unknown-source",
      statusBeforeHide: product?.status ?? "draft",
      title: product?.title ?? "Unavailable product",
      unavailableSince: new Intl.DateTimeFormat("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(String(alert.created_at))),
    };
  });
}

export async function getImportJobActivity(jobId: string) {
  const databaseClient = getOptionalDatabaseClient();

  if (databaseClient) {
    const items = await databaseClient
      .select({
        createdAt: importJobItems.createdAt,
        failureReason: importJobItems.failureReason,
        sourceInput: importJobItems.sourceInput,
        sourceProductId: importJobItems.sourceProductId,
        status: importJobItems.status,
      })
      .from(importJobItems)
      .where(eq(importJobItems.importJobId, jobId))
      .orderBy(asc(importJobItems.createdAt));

    return items.map((item) => {
      if (item.status === "failed") {
        return `IMPORT_FAILED :: ${item.sourceProductId ?? item.sourceInput} :: ${item.failureReason ?? "unknown"}`;
      }

      if (item.status === "duplicate") {
        return `DUPLICATE_SKIPPED :: ${item.sourceProductId ?? item.sourceInput}`;
      }

      if (item.status === "imported") {
        return `DRAFT_CREATED :: ${item.sourceProductId ?? item.sourceInput}`;
      }

      return `${String(item.status).toUpperCase()} :: ${item.sourceProductId ?? item.sourceInput}`;
    });
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("import_job_items")
    .select("source_input, source_product_id, status, failure_reason, created_at")
    .eq("import_job_id", jobId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => {
    if (item.status === "failed") {
      return `IMPORT_FAILED :: ${item.source_product_id ?? item.source_input} :: ${item.failure_reason ?? "unknown"}`;
    }

    if (item.status === "duplicate") {
      return `DUPLICATE_SKIPPED :: ${item.source_product_id ?? item.source_input}`;
    }

    if (item.status === "imported") {
      return `DRAFT_CREATED :: ${item.source_product_id ?? item.source_input}`;
    }

    return `${String(item.status).toUpperCase()} :: ${item.source_product_id ?? item.source_input}`;
  });
}
