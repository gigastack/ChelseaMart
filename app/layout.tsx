import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "China-Nigeria Commerce",
  description: "Curated China-to-Nigeria commerce platform",
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
