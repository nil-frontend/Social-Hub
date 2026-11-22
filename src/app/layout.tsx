import type { Metadata } from "next";
import "./globals.css";
import { GlobalNav } from "@/components/layout/global-nav";

export const metadata: Metadata = {
  title: "Social-Hub | Multi-Account Social Video Distribution",
  description:
    "Distribute videos seamlessly to multiple YouTube channels, Facebook pages, and Instagram accounts from a single workspace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-apple-parchment text-apple-ink antialiased">
        <GlobalNav />
        {children}
      </body>
    </html>
  );
}
