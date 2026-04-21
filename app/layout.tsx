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
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

export default RootLayout;
