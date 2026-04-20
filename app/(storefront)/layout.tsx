import type { ReactNode } from "react";
import { StorefrontCurrencyProvider } from "@/components/storefront/currency-provider";
import { StorefrontFooter } from "@/components/storefront/footer";
import { StorefrontHeader } from "@/components/storefront/header";

type StorefrontLayoutProps = {
  children: ReactNode;
};

export default function StorefrontLayout({ children }: StorefrontLayoutProps) {
  return (
    <StorefrontCurrencyProvider>
      <StorefrontHeader />
      {children}
      <StorefrontFooter />
    </StorefrontCurrencyProvider>
  );
}
