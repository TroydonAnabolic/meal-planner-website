"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import CompanyLogo from "./components/company-logo";
import Link from "next/link";
import LoginLink from "./components/auth/login-link";
import { ROUTES } from "@/constants/routes";
import { useSession } from "next-auth/react";

interface NavigationItem {
  name: string;
  href: string;
}

// app/components/Header.tsx

const Header = () => {
  const { data: session, status } = useSession();

  const navigation: NavigationItem[] = [
    { name: "HOME", href: ROUTES.HOME },
    { name: "HOW IT WORKS", href: ROUTES.HOW_IT_WORKS },
    // { name: "PREMIUM PLAN", href: ROUTES.PREMIUM_PLAN },
  ];

  // only show in main page when not authenticated
  if (!session) {
    navigation.push({
      name: "MEAL PLANNER DEMO",
      href: ROUTES.MEAL_PLANNER_DEMO,
    });
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = usePathname();

  // Define routes where the navigation should be hidden
  const noRootNavRoutes = [ROUTES.MEAL_PLANNER.BASE];

  // Check if current route is in noNavRoutes
  const hideNav = noRootNavRoutes.some((route) => location.startsWith(route));

  if (hideNav) {
    return null;
  }

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-3 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <CompanyLogo />
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-500"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <LoginLink />
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="#" className="m-1.5 p-1.5">
              <span className="sr-only">Meal Planner</span>
              <Image
                src="/meal-planner-logo.png"
                alt="AI Trainer"
                width={100}
                height={100}
                className=""
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <LoginLink />
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default Header;
