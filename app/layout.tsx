import "./globals.css";
import type { Metadata } from "next";
import Header from "./Header";
import Footer from "./Footer";
import SessionProvider from "./components/auth/session-provider";
import { auth } from "@/auth";
import { Session } from "next-auth";
import GoogleAnalytics from "./components/seo/google-analytics";

export const metadata: Metadata = {
  title: "Meal Planner",
  description: "Generate personalized meal plans easily.",
  openGraph: {
    title: "Meal Planner",
    description: "Generate personalized meal plans easily.",
    url: "https://mealplanner.smartaitrainer.com/",
    siteName: "Meal Planner",
    type: "website",
  },
  other: {
    "script:json-ld": JSON.stringify({
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
    }),
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await auth()) as Session;

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <SessionProvider basePath="" session={session}>
          <Header />
          <div className="flex-grow bg-white">{children}</div>
          <Footer />
        </SessionProvider>
        {/* Move Google Analytics & External Scripts here */}
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: metadata.other?.["script:json-ld"] || "",
          }}
        />
        <script
          src="https://developer.edamam.com/attribution/badge.js"
          async
        />
      </body>
    </html>
  );
}
