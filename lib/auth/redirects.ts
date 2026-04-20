const DEFAULT_NEXT_PATH = "/account/orders";

export function sanitizeNextPath(next: FormDataEntryValue | string | null | undefined, fallback = DEFAULT_NEXT_PATH) {
  const candidate = typeof next === "string" ? next.trim() : "";

  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback;
  }

  try {
    const parsed = new URL(candidate, "https://mart.local");

    if (parsed.origin !== "https://mart.local") {
      return fallback;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export function buildSignInHref(next: FormDataEntryValue | string | null | undefined, fallback = DEFAULT_NEXT_PATH) {
  const params = new URLSearchParams({
    next: sanitizeNextPath(next, fallback),
  });

  return `/auth/sign-in?${params.toString()}`;
}

export function buildAuthStatusHref(
  basePath: "/auth/sign-in" | "/auth/sign-up",
  options: {
    error?: string;
    next?: FormDataEntryValue | string | null | undefined;
    notice?: string;
  },
  fallback = DEFAULT_NEXT_PATH,
) {
  const params = new URLSearchParams();

  if (options.error) {
    params.set("error", options.error);
  }

  if (options.notice) {
    params.set("notice", options.notice);
  }

  params.set("next", sanitizeNextPath(options.next, fallback));

  return `${basePath}?${params.toString()}`;
}
