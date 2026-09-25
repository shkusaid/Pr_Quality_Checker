import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PR Review Assistant — AI-powered GitHub PR Analysis",
  description:
    "Automated GitHub pull request review system with specialized AI agents, evidence-backed findings, and safe repository tooling.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gh-bg text-gh-text min-h-screen">{children}</body>
    </html>
  );
}
