import { parsedSourceInputSchema, type ParsedSourceInput } from "@/lib/validation/imports";

const URL_PREFIXES = ["http://", "https://"];

function uniqueValues(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function isUrlCandidate(value: string) {
  return URL_PREFIXES.some((prefix) => value.startsWith(prefix));
}

export function parseSourceInput(input: string): ParsedSourceInput {
  const normalized = input.trim();
  const lines = uniqueValues(normalized.split(/\r?\n|,/));

  if (lines.length === 0) {
    throw new Error("A keyword or at least one source URL is required.");
  }

  if (lines.every(isUrlCandidate)) {
    return parsedSourceInputSchema.parse({
      entries: lines.map((value) => ({ type: "url", value })),
      mode: lines.length > 1 ? "bulk_url" : "single_url",
    });
  }

  return parsedSourceInputSchema.parse({
    entries: [{ type: "keyword", value: normalized }],
    mode: "keyword_search",
  });
}
