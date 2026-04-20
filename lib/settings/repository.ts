import { resolveEffectiveMoq } from "@/lib/settings/commerce-settings";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

function asNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    return Number(value);
  }

  return 0;
}

export type CommerceSettingsRecord = {
  cnyToNgnRate: number;
  defaultMoq: number;
  usdToNgnRate: number;
};

export async function getCommerceSettings(): Promise<CommerceSettingsRecord> {
  const supabase = createSupabaseServiceRoleClient();
  const [{ data: pairs, error: pairsError }, { data: settings, error: settingsError }] = await Promise.all([
    supabase
      .from("currency_pairs")
      .select("base_currency, quote_currency, rate, is_active")
      .eq("quote_currency", "NGN")
      .in("base_currency", ["CNY", "USD"])
      .eq("is_active", true),
    supabase.from("app_settings").select("default_moq").eq("id", "singleton").maybeSingle(),
  ]);

  if (pairsError) {
    throw pairsError;
  }

  if (settingsError) {
    throw settingsError;
  }

  const cnyPair = (pairs ?? []).find((pair) => pair.base_currency === "CNY");
  const usdPair = (pairs ?? []).find((pair) => pair.base_currency === "USD");

  if (!cnyPair || !usdPair) {
    throw new Error("Commerce settings require active CNY/NGN and USD/NGN exchange rates.");
  }

  return {
    cnyToNgnRate: asNumber(cnyPair.rate),
    defaultMoq: resolveEffectiveMoq({
      defaultMoq: asNumber(settings?.default_moq ?? 1),
      moqOverride: null,
    }),
    usdToNgnRate: asNumber(usdPair.rate),
  };
}

export async function updateCommerceSettings(input: CommerceSettingsRecord) {
  const supabase = createSupabaseServiceRoleClient();
  const { error: appSettingsError } = await supabase.from("app_settings").upsert({
    default_moq: resolveEffectiveMoq({
      defaultMoq: input.defaultMoq,
      moqOverride: null,
    }),
    id: "singleton",
  });

  if (appSettingsError) {
    throw appSettingsError;
  }

  const { error: currencyError } = await supabase.from("currency_pairs").upsert(
    [
      {
        base_currency: "CNY",
        is_active: true,
        quote_currency: "NGN",
        rate: input.cnyToNgnRate,
      },
      {
        base_currency: "USD",
        is_active: true,
        quote_currency: "NGN",
        rate: input.usdToNgnRate,
      },
    ],
    { onConflict: "base_currency,quote_currency" },
  );

  if (currencyError) {
    throw currencyError;
  }
}
