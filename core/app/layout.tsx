import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";
import AppWrapper from "../providers/app-wrapper";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Deployit",
  description: "A deploy tool for React developers!",
  keywords: ["React", "Next.js", "Deploy", "Deployment", "Devpulkit.in"],
  authors: [{ name: "Pulkit", url: "https://devpulkit.in" }],
  openGraph: {
    title: "Deployit",
    description: "A deploy tool for React developers!",
    url: "https://deploy.live",
    siteName: "Deployit",
    images: [
      {
        url: "https://deployit.live/icon.png",
        width: 800,
        height: 600,
        alt: "Deployit",
      },
    ],
    locale: "in_IN",
    type: "website",
  },
  twitter: {
    site: "@devpulkitt",
    title: "Deployit",
    description: "A brief description of your app.",
    images: ["https://deployit.live/icon.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex h-screen flex-col overflow-hidden">
        <AppWrapper>
          <Navbar />
          <div className="h-full w-full overflow-y-auto">{children}</div>
          <Toaster />
        </AppWrapper>
      </body>
    </html>
  );
}
