import type { CurrencyCode } from "@/lib/domain/types";

export function formatMoney(value: number, currency: CurrencyCode) {
  const locale = currency === "CNY" ? "zh-CN" : "en-NG";

  return new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: currency === "NGN" ? 0 : 2,
    style: "currency",
  }).format(value);
}
