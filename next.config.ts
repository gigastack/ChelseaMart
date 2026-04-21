import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptSrc = ["'self'", "'unsafe-inline'"];
const styleSrc = ["'self'", "'unsafe-inline'", "https://api.fontshare.com", "https://fonts.googleapis.com"];
const fontSrc = ["'self'", "data:", "https://cdn.fontshare.com", "https://fonts.gstatic.com"];

if (process.env.NODE_ENV !== "production") {
  scriptSrc.push("'unsafe-eval'");
}

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    return [
      {
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              `default-src 'self'; img-src 'self' data: https:; style-src ${styleSrc.join(" ")}; script-src ${scriptSrc.join(" ")}; connect-src 'self' https: ws: wss:; font-src ${fontSrc.join(" ")}; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`,
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
        source: "/:path*",
      },
    ];
  },
  reactStrictMode: true,
  turbopack: {
    root: dirname,
  },
};

export default nextConfig;
