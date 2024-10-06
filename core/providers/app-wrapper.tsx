"use client";

import { SessionProvider } from "next-auth/react";
import ThemeProvider from "@/providers/ThemeProvider";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  );
}
