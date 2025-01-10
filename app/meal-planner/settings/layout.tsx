"use client";

import SecondaryNavigation from "@/app/components/secondary-navigation";
import React from "react";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { Metadata } from "next";

// Define the navigation items for client details
const secondaryNavigation = [
  {
    name: "Profile",
    href: ROUTES.MEAL_PLANNER.SETTINGS.PROFILE,
    current: false,
  },
  {
    name: "Physical Attributes",
    href: ROUTES.MEAL_PLANNER.SETTINGS.PHYSICAL_ATTRIBUTES,
    current: false,
  },
  {
    name: "Subscription",
    href: ROUTES.MEAL_PLANNER.SETTINGS.SUBSCRIPTIONS,
    current: false,
  },
];

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const updatedNavigation = secondaryNavigation.map((item) => {
    const lastSegment = pathname.split("/").pop();
    return {
      ...item,
      current: item.href === lastSegment,
    };
  });

  return (
    <main>
      <h1 className="sr-only">Client Settings</h1>

      {/* Secondary Navigation */}
      <SecondaryNavigation items={updatedNavigation} />

      {/* Settings Forms */}
      <div className="divide-y divide-gray-200">{children}</div>
    </main>
  );
}
