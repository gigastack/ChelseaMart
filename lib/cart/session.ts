export type SessionCartItem = {
  productId: string;
  quantity: number;
};

const CART_COOKIE_NAME = "chelsea_cart";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function coercePositiveInteger(value: unknown) {
  const numberValue =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : Number.NaN;

  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    return null;
  }

  return Math.floor(numberValue);
}

export function normalizeSessionCartItems(input: unknown): SessionCartItem[] {
  const rawItems =
    Array.isArray(input)
      ? input
      : input && typeof input === "object" && "items" in input && Array.isArray(input.items)
        ? input.items
        : [];

  const mergedItems = new Map<string, number>();

  for (const rawItem of rawItems) {
    if (!rawItem || typeof rawItem !== "object") {
      continue;
    }

    const candidate = rawItem as Record<string, unknown>;
    const productId = typeof candidate.productId === "string" ? candidate.productId.trim() : "";
    const quantity = coercePositiveInteger(candidate.quantity);

    if (!productId || quantity === null) {
      continue;
    }

    mergedItems.set(productId, (mergedItems.get(productId) ?? 0) + quantity);
  }

  return Array.from(mergedItems.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

export function addSessionCartItem(items: SessionCartItem[], nextItem: SessionCartItem) {
  const quantity = coercePositiveInteger(nextItem.quantity);

  if (!nextItem.productId.trim() || quantity === null) {
    return normalizeSessionCartItems(items);
  }

  return normalizeSessionCartItems([
    ...items,
    {
      productId: nextItem.productId,
      quantity,
    },
  ]);
}

export function updateSessionCartItemQuantity(items: SessionCartItem[], productId: string, quantity: number) {
  const normalizedQuantity = coercePositiveInteger(quantity);

  if (!productId.trim() || normalizedQuantity === null) {
    return normalizeSessionCartItems(items);
  }

  return normalizeSessionCartItems(
    items.map((item) =>
      item.productId === productId
        ? {
            ...item,
            quantity: normalizedQuantity,
          }
        : item,
    ),
  );
}

export function removeSessionCartItem(items: SessionCartItem[], productId: string) {
  if (!productId.trim()) {
    return normalizeSessionCartItems(items);
  }

  return normalizeSessionCartItems(items.filter((item) => item.productId !== productId));
}

async function getCookieStore() {
  const { cookies } = await import("next/headers");
  return cookies();
}

export async function readSessionCartItems() {
  const cookieStore = await getCookieStore();
  const rawCookieValue = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!rawCookieValue) {
    return [];
  }

  try {
    return normalizeSessionCartItems(JSON.parse(rawCookieValue));
  } catch {
    return [];
  }
}

export async function writeSessionCartItems(items: SessionCartItem[]) {
  const normalizedItems = normalizeSessionCartItems(items);
  const cookieStore = await getCookieStore();

  if (!normalizedItems.length) {
    cookieStore.delete(CART_COOKIE_NAME);
    return;
  }

  cookieStore.set(
    CART_COOKIE_NAME,
    JSON.stringify({
      items: normalizedItems,
    }),
    {
      httpOnly: true,
      maxAge: CART_COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
    },
  );
}

export async function clearSessionCart() {
  const cookieStore = await getCookieStore();
  cookieStore.delete(CART_COOKIE_NAME);
}

export async function countSessionCartItems() {
  const items = await readSessionCartItems();
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
