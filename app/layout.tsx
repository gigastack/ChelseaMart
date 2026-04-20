import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cargo Ledger Mart",
  description:
    "Curated China-to-Nigeria commerce with CNY-first merchandising, NGN checkout settlement, and USD logistics invoices after warehouse proof.",
  icons: {
    icon: "/ProductImage.jpg",
    shortcut: "/ProductImage.jpg",
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;
