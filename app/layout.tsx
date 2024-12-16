import "./globals.css";

import type { Metadata } from "next";
import "./globals.css";
import Header from "./Header";
import Footer from "./Footer";
import SessionProvider from "./components/auth/session-provider";
import { auth } from "@/auth";
import { Session } from "next-auth";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Meal Planner",
  description: "Generate personalized meal plans easily.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = (await auth()) as Session;

  return (
    <html lang="en" data-theme="fantasy">
      <head>
        <Script
          src="https://developer.edamam.com/attribution/badge.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <SessionProvider basePath="" session={session}>
          <Header /> {/* Only render NavBar if not in noNavRoutes */}
          <div className="flex-grow  bg-white">{children}</div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
