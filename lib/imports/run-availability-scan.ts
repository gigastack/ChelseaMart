import type { ProductLifecycle } from "@/lib/domain/types";
import type { ElimPlatform } from "@/lib/imports/elim-platform";

type AvailabilityRecord = {
  productId: string;
  sourcePlatform: ElimPlatform;
  sourceProductId: string;
  status: ProductLifecycle;
  title: string;
};

type AvailabilityUpdate = {
  nextStatus: "unavailable";
  previousStatus: ProductLifecycle;
  productId: string;
};

type CatalogAlert = {
  alertType: "source_unavailable";
  detail: string;
  productId: string;
  title: string;
};

type RunAvailabilityScanInput = {
  checkAvailability: (sourceProductId: string, sourcePlatform: ElimPlatform) => Promise<boolean>;
  records: AvailabilityRecord[];
};

type RunAvailabilityScanResult = {
  alerts: CatalogAlert[];
  summary: {
    scannedCount: number;
    unavailableCount: number;
  };
  updatedProducts: AvailabilityUpdate[];
};

export async function runAvailabilityScan({
  checkAvailability,
  records,
}: RunAvailabilityScanInput): Promise<RunAvailabilityScanResult> {
  const alerts: CatalogAlert[] = [];
  const updatedProducts: AvailabilityUpdate[] = [];

  for (const record of records) {
    const isAvailable = await checkAvailability(record.sourceProductId, record.sourcePlatform);

    if (isAvailable || record.status === "unavailable") {
      continue;
    }

    updatedProducts.push({
      nextStatus: "unavailable",
      previousStatus: record.status,
      productId: record.productId,
    });

    alerts.push({
      alertType: "source_unavailable",
      detail: `${record.title} is no longer available from ELIM and should stay hidden until reviewed.`,
      productId: record.productId,
      title: "Source product unavailable",
    });
  }

  return {
    alerts,
    summary: {
      scannedCount: records.length,
      unavailableCount: updatedProducts.length,
    },
    updatedProducts,
  };
}
