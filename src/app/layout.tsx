import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: env.siteUrl ? new URL(env.siteUrl) : undefined,
  title: {
    default: `${env.appName} | homebase civic lab`,
    template: `%s | ${env.appName}`,
  },
  description:
    "Convert published knowledge — books, guides, toolkits — into composable, attributed AI agent skills you can actually run.",
  openGraph: {
    title: env.appName,
    description: "Composable, attributed AI agent skills built from published knowledge.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
