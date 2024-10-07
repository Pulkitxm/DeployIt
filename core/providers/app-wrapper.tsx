"use client";

import { SessionProvider } from "next-auth/react";
import ThemeProvider from "@/providers/ThemeProvider";
import AuthWrapper from "./AuthWrapper";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AuthWrapper>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthWrapper>
    </SessionProvider>
  );
}
