import type { NextConfig } from "next";

/**
 * Content-Security-Policy.
 *
 * `'unsafe-inline'` is required for styles (Tailwind/Next inject inline styles)
 * and for Next's small hydration bootstrap script. The app uses no third-party
 * scripts and never renders raw HTML (markdown is rendered via react-markdown,
 * which escapes by default), so the residual XSS surface is minimal. To harden
 * further, switch to a nonce-based CSP via middleware.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  // Server-only native/CJS packages should not be bundled.
  serverExternalPackages: ["gray-matter", "@libsql/client"],

  // Ensure skill markdown ships with serverless function bundles.
  outputFileTracingIncludes: {
    "/": ["./src/skills/**/*"],
    "/api/health": ["./src/skills/**/*"],
    "/api/skills": ["./src/skills/**/*"],
    "/api/skills/[slug]": ["./src/skills/**/*"],
    "/api/skills/invoke": ["./src/skills/**/*"],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
