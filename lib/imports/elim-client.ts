import { getServerEnv } from "@/lib/config/env";

export type ElimRequestOptions = {
  body?: Record<string, unknown>;
  endpoint: string;
  method?: "GET" | "POST";
  query?: Record<string, string | number | undefined>;
};

function buildUrl(baseUrl: string, { endpoint, query }: Pick<ElimRequestOptions, "endpoint" | "query">) {
  const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const url = new URL(endpoint.replace(/^\//, ""), normalizedBaseUrl);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export async function requestElim<T>({
  body,
  endpoint,
  method = "GET",
  query,
}: ElimRequestOptions): Promise<T> {
  const { elimApiBaseUrl, elimApiKey } = getServerEnv();

  if (!elimApiBaseUrl) {
    throw new Error("ELIM_API_BASE_URL is required for import workflows.");
  }
  if (!elimApiKey) {
    throw new Error("ELIM_API_KEY is required for import workflows.");
  }

  const response = await fetch(buildUrl(elimApiBaseUrl, { endpoint, query }), {
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      Authorization: `Bearer ${elimApiKey}`,
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    method,
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`ELIM request failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
}
