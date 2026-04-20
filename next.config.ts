import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptSrc = ["'self'", "'unsafe-inline'"];

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
              `default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src ${scriptSrc.join(" ")}; connect-src 'self' https: ws: wss:; font-src 'self' data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`,
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
