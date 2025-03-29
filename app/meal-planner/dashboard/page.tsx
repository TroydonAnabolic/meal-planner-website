import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { auth } from "@/auth";
import { Session } from "next-auth";

// Lazy load MealsSection as a server component
const MealsSection = dynamic(
  () => import("@/app/components/meal-plan/dashboard/meal-section"),
  { ssr: true, loading: () => <p>Loading meals...</p> }
);

type DashboardProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const DashboardPage: React.FC<DashboardProps> = async ({ searchParams }) => {
  const session = (await auth()) as Session;
  const clientId = Number(session.user.clientId);

  return (
    <main className="flex-1 pb-8">
      {/* Render static header, etc. */}
      <div className="bg-white shadow">
        {/* Header content */}
      </div>

      <Suspense fallback={<div>Loading meals section...</div>}>
        <MealsSection clientId={clientId} searchParams={searchParams} />
      </Suspense>
    </main>
  );
};

export default DashboardPage;
export const metadata: Metadata = {
  title: "Meal Planner - Dashboard",
  description: "Generate personalized meal plans easily.",
};