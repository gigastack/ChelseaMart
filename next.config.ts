import type { NextConfig } from "next";

const scriptSrc = ["'self'", "'unsafe-inline'"];

if (process.env.NODE_ENV !== "production") {
  scriptSrc.push("'unsafe-eval'");
}

const nextConfig: NextConfig = {
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
};

export default nextConfig;
