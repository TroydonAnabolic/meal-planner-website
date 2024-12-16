// components/layout.tsx

import React from "react";
import AuthenticatedNavBar from "../components/authenticated-navbar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

export default async function MealPlannerAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = (await auth()) as Session;

  if (!session) {
    // Redirect to the unauthenticated page if the user is not authenticated
    redirect("/user-unauthenticated");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {session && <AuthenticatedNavBar />}
      <div className="flex flex-1 lg:pl-72">
        <main className="flex flex-col flex-1">
          <div className="flex-1 min-w-max">{children}</div>
        </main>
      </div>
    </div>
  );
}
