import "./globals.css";

import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import QueryProvider from '@/components/query-provider';
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Next Track",
  description: "Next Track",
  icons: {
    shortcut: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(inter.className, `antialiased`)}
      >
        <QueryProvider>
          <Toaster />
          <NuqsAdapter>
            {children}
          </NuqsAdapter>
        </QueryProvider>
      </body>
    </html>
  );
}
