import type { Metadata } from "next";
import React from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'sonner';
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Localhunt - Your Ultimate Marketplace",
  description: "Connect with amazing products and passionate sellers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <SessionProvider 
            refetchInterval={0}
            refetchOnWindowFocus={false}
            refetchWhenOffline={false}
            basePath="/api/auth"
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            <Toaster 
              position="top-right" 
              richColors 
              expand={true}
              closeButton
              theme="system"
            />
          </SessionProvider>
      </body>
    </html>
  );
}
