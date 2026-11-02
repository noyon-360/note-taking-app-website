import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";

import { Nav } from "@/components/nav";
import { SessionProvider } from "@/lib/use-session";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Secure Notes",
  description: "A note-taking app with role-based access control",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Browser extensions add attributes to <body> before React loads. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SessionProvider>
          <Suspense fallback={null}>
            <Nav />
          </Suspense>
          <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 px-4 py-6">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
