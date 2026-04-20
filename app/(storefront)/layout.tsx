import type { ReactNode } from "react";
import { StorefrontFooter } from "@/components/storefront/footer";
import { StorefrontHeader } from "@/components/storefront/header";

type StorefrontLayoutProps = {
  children: ReactNode;
};

export default function StorefrontLayout({ children }: StorefrontLayoutProps) {
  return (
    <>
      <StorefrontHeader />
      {children}
      <StorefrontFooter />
    </>
  );
}
