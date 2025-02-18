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
  const jsonLd = [
    {
      "@context": "http://schema.org",
      "@type": "Product",
      url: "https://mealplanner.smartaitrainer.com/",
      brand: {
        "@type": "Brand",
        logo: "https://mealplanner.smartaitrainer.com/_next/image?url=%2Fmeal-planner-logo.png&w=256&q=75",
      },
    },
    {
      "@context": "http://schema.org",
      "@type": "Product",
      url: "https://mealplanner.smartaitrainer.com/how-it-works",
    },
    {
      "@context": "http://schema.org",
      "@type": "Product",
      url: "https://mealplanner.smartaitrainer.com/demo",
    },
    {
      "@context": "http://schema.org",
      "@type": "Product",
      url: "https://mealplanner.smartaitrainer.com/login",
    },
    {
      "@context": "http://schema.org",
      "@type": "Product",
      url: "https://mealplanner.smartaitrainer.com/#",
    },
    {
      "@context": "http://schema.org",
      "@type": "Product",
      name: "Personalized",
      description: "tailored",
      url: "https://mealplanner.smartaitrainer.com/register",
    },
    {
      "@context": "http://schema.org",
      "@type": "Product",
      image: "https://mealplanner.smartaitrainer.com/aiimages/food/protein.svg",
      url: "https://mealplanner.smartaitrainer.com/how-it-works",
    },
    {
      "@context": "http://schema.org",
      "@type": "Product",
      url: "https://mealplanner.smartaitrainer.com/how-it-works",
      brand: {
        "@type": "Brand",
        logo: "https://mealplanner.smartaitrainer.com/_next/image?url=%2Fmeal-planner-logo.png&w=256&q=75",
      },
    },
    {
      "@context": "http://schema.org",
      "@type": "Product",
      url: "https://mealplanner.smartaitrainer.com/meal-planner/food/browse-food/",
    },
    {
      "@context": "http://schema.org",
      "@type": "Product",
      url: "https://mealplanner.smartaitrainer.com/premium-plan",
    },
    {
      "@context": "http://schema.org",
      "@type": "Product",
      url: "https://mealplanner.smartaitrainer.com/contact-us",
    },
    {
      "@context": "http://schema.org",
      "@type": "Product",
      url: "https://mealplanner.smartaitrainer.com/about-us",
    },
    {
      "@context": "http://schema.org",
      "@type": "Product",
      url: "https://mealplanner.smartaitrainer.com/#",
    },
    {
      "@context": "http://schema.org",
      "@type": "Product",
      url: "https://mealplanner.smartaitrainer.com/privacy",
    },
    {
      "@context": "http://schema.org",
      "@type": "Product",
      url: "https://mealplanner.smartaitrainer.com/terms",
    },
  ];
  return (
    <html lang="en">
      <head>
        <Script
          src="https://developer.edamam.com/attribution/badge.js"
          strategy="afterInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
