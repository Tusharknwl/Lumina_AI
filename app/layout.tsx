import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { ReduxProvider } from "@/lib/redux/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lumina.AI",
  description: "AI Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ReduxProvider>
            {children}
            <Analytics />
          </ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
