import { requestElim } from "@/lib/imports/elim-client";
import { inferElimPlatformFromUrl, type ElimPlatform } from "@/lib/imports/elim-platform";
import type { ElimProductPayload } from "@/lib/validation/imports";

type ElimSearchResponse = Record<string, unknown>;
type ElimDetailResponse = Record<string, unknown>;
type ElimUnshortenResponse = Record<string, unknown>;

function toRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function toNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function toStringValue(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function toImageArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((image) => toStringValue(image))
    .filter((image): image is string => Boolean(image));
}

function pickArray(response: Record<string, unknown>) {
  const candidates = [
    response.items,
    response.results,
    response.data,
    toRecord(response.data)?.items,
    toRecord(response.data)?.results,
    toRecord(response.data)?.list,
    response.list,
  ];

  return candidates.find(Array.isArray) as Record<string, unknown>[] | undefined;
}

function extractImages(record: Record<string, unknown>) {
  return [
    ...toImageArray(record.images),
    ...toImageArray(toRecord(record.mainImages)?.images),
    ...toImageArray([record.image]),
  ].filter((image, index, array) => array.indexOf(image) === index);
}

function buildFallbackProductUrl(productId: string, platform: ElimPlatform) {
  return platform === "alibaba"
    ? `https://detail.1688.com/offer/${productId}.html`
    : `https://item.taobao.com/item.htm?id=${productId}`;
}

function mapElimRecord(
  record: Record<string, unknown>,
  platform: ElimPlatform,
  fallbackUrl?: string | null,
): ElimProductPayload {
  const id =
    toStringValue(record.productId) ??
    toStringValue(record.id) ??
    toStringValue(record.offerId) ??
    toStringValue(record.itemId);
  const title =
    toStringValue(record.titleEn) ??
    toStringValue(record.title) ??
    toStringValue(record.nameEn) ??
    toStringValue(record.name);
  const price =
    toNumber(record.price) ??
    toNumber(record.promotion_price) ??
    toNumber(record.retail_price) ??
    toNumber(record.dropship_price);
  const url =
    toStringValue(record.url) ??
    toStringValue(record.productUrl) ??
    toStringValue(record.offerUrl) ??
    fallbackUrl ??
    (id ? buildFallbackProductUrl(id, platform) : null);

  if (!id || !title || price === null || !url) {
    throw new Error("ELIM response did not contain a usable product record.");
  }

  return {
    images: extractImages(record),
    platform,
    priceCny: price,
    productId: id,
    title,
    url,
  };
}

function extractDetailRecord(response: ElimDetailResponse) {
  return toRecord(response.data) ?? toRecord(response.item) ?? response;
}

function parseProductIdFromUrl(url: string) {
  const match = url.match(/offer\/(\d+)\.html/i) ?? url.match(/[?&]id=(\d+)/i);
  return match?.[1] ?? null;
}

function resolvePlatformFromUnknown(value: unknown): ElimPlatform | null {
  return value === "alibaba" || value === "taobao" ? value : null;
}

export async function searchElimProducts(keyword: string, platform: ElimPlatform) {
  const response = await requestElim<ElimSearchResponse>({
    body: {
      lang: "en",
      platform,
      q: keyword,
    },
    endpoint: "products/search",
    method: "POST",
  });

  const items = pickArray(response) ?? [];
  return items.map((item) => mapElimRecord(item, platform));
}

export async function getElimProductDetail(productId: string, platform: ElimPlatform) {
  const response = await requestElim<ElimDetailResponse>({
    body: {
      id: productId,
      platform,
    },
    endpoint: "products/detail",
    method: "POST",
  });

  return mapElimRecord(extractDetailRecord(response), platform);
}

export async function unshortenElimUrl(url: string, platformHint?: ElimPlatform) {
  const response = await requestElim<ElimUnshortenResponse>({
    body: {
      ...(platformHint ? { platform: platformHint } : {}),
      url,
    },
    endpoint: "links/unshorten",
    method: "POST",
  });

  const record = toRecord(response.data) ?? response;
  return {
    productId: toStringValue(record.id) ?? toStringValue(record.productId),
    platform:
      resolvePlatformFromUnknown(record.platform) ??
      inferElimPlatformFromUrl(toStringValue(record.url) ?? toStringValue(record.originalUrl) ?? url) ??
      platformHint,
    url: toStringValue(record.url) ?? toStringValue(record.originalUrl) ?? url,
  };
}

export async function getElimProductByUrl(sourceUrl: string, platformOverride?: ElimPlatform) {
  const inferredPlatform = platformOverride ?? inferElimPlatformFromUrl(sourceUrl);
  const parsedId = parseProductIdFromUrl(sourceUrl);

  if (parsedId && inferredPlatform) {
    return getElimProductDetail(parsedId, inferredPlatform);
  }

  const unshortened = await unshortenElimUrl(sourceUrl, inferredPlatform ?? undefined);
  const resolvedPlatform = inferredPlatform ?? unshortened.platform;

  if (unshortened.productId && resolvedPlatform) {
    return getElimProductDetail(unshortened.productId, resolvedPlatform);
  }

  throw new Error("Unable to resolve an ELIM product ID and platform from the provided URL.");
}

export async function checkElimProductAvailability(sourceProductId: string, platform: ElimPlatform) {
  try {
    await getElimProductDetail(sourceProductId, platform);
    return true;
  } catch {
    return false;
  }
}

export async function confirmElimConnection(platform: ElimPlatform) {
  const results = await searchElimProducts("sample", platform);
  return {
    ok: results.length >= 0,
    platform,
    sampleCount: results.length,
  };
}
