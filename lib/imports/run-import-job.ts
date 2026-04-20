import { normalizeElimProduct } from "@/lib/imports/normalize-elim-product";
import type { ElimPlatform } from "@/lib/imports/elim-platform";
import { importEntrySchema, type ElimProductPayload, type ImportEntry } from "@/lib/validation/imports";

type RunImportJobInput = {
  defaultMoq: number;
  entries: ImportEntry[];
  existingSourceIds: Set<string>;
  fetchByKeyword: (keyword: string, platform: ElimPlatform) => Promise<ElimProductPayload[]>;
  fetchByUrl: (url: string, platformOverride?: ElimPlatform) => Promise<ElimProductPayload>;
  jobId: string;
  keywordPlatform?: ElimPlatform;
};

type ImportJobItemResult = {
  failureReason: string | null;
  jobId: string;
  sourceInput: string;
  sourcePlatform: ElimPlatform | null;
  sourceProductId: string | null;
  status: "duplicate" | "failed" | "imported" | "needs_review";
};

type RunImportJobResult = {
  createdProducts: ReturnType<typeof normalizeElimProduct>[];
  jobItems: ImportJobItemResult[];
  summary: {
    duplicateCount: number;
    failedCount: number;
    importedCount: number;
    submittedCount: number;
  };
};

export async function runImportJob({
  defaultMoq,
  entries,
  existingSourceIds,
  fetchByKeyword,
  fetchByUrl,
  jobId,
  keywordPlatform = "alibaba",
}: RunImportJobInput): Promise<RunImportJobResult> {
  const seenInputs = new Set<string>();
  const seenSourceIds = new Set<string>(existingSourceIds);
  const createdProducts: RunImportJobResult["createdProducts"] = [];
  const jobItems: ImportJobItemResult[] = [];

  for (const rawEntry of entries) {
    const entry = importEntrySchema.parse(rawEntry);

    if (seenInputs.has(entry.value)) {
      jobItems.push({
        failureReason: null,
        jobId,
        sourceInput: entry.value,
        sourcePlatform: null,
        sourceProductId: null,
        status: "duplicate",
      });
      continue;
    }

    seenInputs.add(entry.value);

    try {
      if (entry.type === "keyword") {
        const results = await fetchByKeyword(entry.value, keywordPlatform);

        if (results.length === 0) {
          jobItems.push({
            failureReason: "No ELIM products matched the keyword.",
            jobId,
            sourceInput: entry.value,
            sourcePlatform: keywordPlatform,
            sourceProductId: null,
            status: "needs_review",
          });
          continue;
        }

        for (const result of results) {
          if (seenSourceIds.has(result.productId)) {
            jobItems.push({
              failureReason: null,
              jobId,
              sourceInput: entry.value,
              sourcePlatform: result.platform,
              sourceProductId: result.productId,
              status: "duplicate",
            });
            continue;
          }

          const normalized = normalizeElimProduct(result, { defaultMoq });
          seenSourceIds.add(result.productId);
          createdProducts.push(normalized);
          jobItems.push({
            failureReason: null,
            jobId,
            sourceInput: entry.value,
            sourcePlatform: result.platform,
            sourceProductId: result.productId,
            status: "imported",
          });
        }

        continue;
      }

      const payload = await fetchByUrl(entry.value);

      if (seenSourceIds.has(payload.productId)) {
        jobItems.push({
          failureReason: null,
          jobId,
          sourceInput: entry.value,
          sourcePlatform: payload.platform,
          sourceProductId: payload.productId,
          status: "duplicate",
        });
        continue;
      }

      const normalized = normalizeElimProduct(payload, { defaultMoq });
      seenSourceIds.add(payload.productId);
      createdProducts.push(normalized);
      jobItems.push({
        failureReason: null,
        jobId,
        sourceInput: entry.value,
        sourcePlatform: payload.platform,
        sourceProductId: payload.productId,
        status: "imported",
      });
    } catch (error) {
      jobItems.push({
        failureReason: error instanceof Error ? error.message : "Unknown import failure",
        jobId,
        sourceInput: entry.value,
        sourcePlatform: entry.type === "keyword" ? keywordPlatform : null,
        sourceProductId: null,
        status: "failed",
      });
    }
  }

  return {
    createdProducts,
    jobItems,
    summary: {
      duplicateCount: jobItems.filter((item) => item.status === "duplicate").length,
      failedCount: jobItems.filter((item) => item.status === "failed").length,
      importedCount: jobItems.filter((item) => item.status === "imported").length,
      submittedCount: entries.length,
    },
  };
}
