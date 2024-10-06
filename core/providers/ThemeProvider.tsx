"use client";

import React from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemeProvider enableSystem={true} attribute="class">
      {children}
    </NextThemeProvider>
  );
}
