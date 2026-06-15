import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
import { ThemeProvider } from "@/components/theme-provider";
import { EditorProvider } from "@/components/editor-context";
import { AppShell } from "@/components/layout/AppShell";
import { HydrationGate } from "@/components/hydration-gate";

export const metadata: Metadata = {
  title: "SubTrack — Subscription Tracker",
  description:
    "A premium, privacy-first subscription tracker. Monitor renewals, spend, and get AI-powered cancellation suggestions.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0F1117" },
    { media: "(prefers-color-scheme: light)", color: "#F4F6FB" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="sr-only z-[100] rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
          >
            Skip to content
          </a>
          <EditorProvider>
            <AppShell>
              <HydrationGate>{children}</HydrationGate>
            </AppShell>
          </EditorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
