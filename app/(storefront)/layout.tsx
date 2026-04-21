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
      <div className="relative isolate min-h-screen overflow-x-clip">
        <StorefrontHeader />
        <div className="relative z-[1]">{children}</div>
        <StorefrontFooter />
      </div>
    </StorefrontCurrencyProvider>
  );
}
