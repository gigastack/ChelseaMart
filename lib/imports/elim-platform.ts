export const elimPlatforms = ["alibaba", "taobao"] as const;

export type ElimPlatform = (typeof elimPlatforms)[number];

export const elimPlatformLabels: Record<ElimPlatform, string> = {
  alibaba: "1688",
  taobao: "Taobao",
};

const ALIBABA_HOST_PATTERNS = [/\.1688\.com$/i];
const TAOBAO_HOST_PATTERNS = [/\.taobao\.com$/i, /\.tb\.cn$/i, /^e\.tb\.cn$/i, /\.tmall\.com$/i];

function matchesPatterns(hostname: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(hostname));
}

export function inferElimPlatformFromUrl(url: string): ElimPlatform | null {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    if (matchesPatterns(hostname, ALIBABA_HOST_PATTERNS) || parsed.pathname.includes("/offer/")) {
      return "alibaba";
    }

    if (
      matchesPatterns(hostname, TAOBAO_HOST_PATTERNS) ||
      parsed.pathname.includes("/item.htm") ||
      parsed.searchParams.has("id")
    ) {
      return "taobao";
    }

    return null;
  } catch {
    return null;
  }
}

