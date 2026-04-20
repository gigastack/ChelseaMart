"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

type StorefrontCurrency = "CNY" | "NGN";

type StorefrontCurrencyContextValue = {
  currency: StorefrontCurrency;
  setCurrency: (currency: StorefrontCurrency) => void;
};

const StorefrontCurrencyContext = createContext<StorefrontCurrencyContextValue | null>(null);

const storageKey = "mart-storefront-currency";
const currencyChangeEvent = "mart-storefront-currency-change";

function readStoredCurrency(): StorefrontCurrency {
  if (typeof window === "undefined") {
    return "CNY";
  }

  const stored = window.localStorage.getItem(storageKey);
  return stored === "NGN" ? "NGN" : "CNY";
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: Event) => {
    if (!(event instanceof StorageEvent) || event.key === storageKey || event.type === currencyChangeEvent) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(currencyChangeEvent, handleStorage);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(currencyChangeEvent, handleStorage);
  };
}

function getServerSnapshot(): StorefrontCurrency {
  return "CNY";
}

export function StorefrontCurrencyProvider({ children }: { children: ReactNode }) {
  const currency = useSyncExternalStore<StorefrontCurrency>(subscribe, readStoredCurrency, getServerSnapshot);

  const value = useMemo(
    () => ({
      currency,
      setCurrency(nextCurrency: StorefrontCurrency) {
        window.localStorage.setItem(storageKey, nextCurrency);
        window.dispatchEvent(new Event(currencyChangeEvent));
      },
    }),
    [currency],
  );

  return <StorefrontCurrencyContext.Provider value={value}>{children}</StorefrontCurrencyContext.Provider>;
}

export function useStorefrontCurrency() {
  const context = useContext(StorefrontCurrencyContext);

  if (!context) {
    throw new Error("useStorefrontCurrency must be used inside StorefrontCurrencyProvider.");
  }

  return context;
}
