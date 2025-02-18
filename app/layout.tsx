import "./globals.css";

import type { Metadata } from "next";
import "./globals.css";
import Header from "./Header";
import Footer from "./Footer";
import SessionProvider from "./components/auth/session-provider";
import { auth } from "@/auth";
import { Session } from "next-auth";
import Script from "next/script";
import Head from "next/head";

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
  const jsonLd = {
    "@context": "http://schema.org",
    "@type": "Product",
    name: "MEAL PLANNER",
    description: "Personalized Diet Plans Just for You",
    url: "https://mealplanner.smartaitrainer.com/",
    brand: {
      "@type": "Brand",
      logo: "https://mealplanner.smartaitrainer.com/_next/image?url=%2Fmeal-planner-logo.png&w=256&q=75",
    },
    offers: {
      "@type": "Offer",
      price:
        "Discover the perfect diet tailored to your needs. Whether you want to lose weight, gain muscle, or just eat healthier, we've got you covered, starting from $19/month.",
    },
  };
  return (
    <html lang="en">
      <Head>
        <>
          <Script
            src="https://developer.edamam.com/attribution/badge.js"
            strategy="afterInteractive"
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </>
      </Head>
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
