import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { Cog6ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";

import {
  MenuBookOutlined,
  HomeOutlined,
  TuneOutlined,
  ShoppingCartOutlined,
  AssignmentOutlined,
  RestaurantMenuOutlined,
  MicrowaveOutlined,
} from "@mui/icons-material";

import React, { useCallback } from "react";
import CompanyLogo from "./company-logo";
import { ROUTES } from "@/constants/routes";
import Link from "next/link";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { makeQueryString } from "@/util/http-util";

// Existing sidebar implementation...
const teams = [
  { id: 1, name: "Vegetarian Plans", href: "#", initial: "V", current: false }, // Different dietary preference groups
  { id: 2, name: "Keto Diet", href: "#", initial: "K", current: false },
  { id: 3, name: "Weight Loss Group", href: "#", initial: "W", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type SideBarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
};

const SideBar: React.FC<SideBarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      return makeQueryString(name, value, searchParams);
    },
    [searchParams]
  );

  const navigation = [
    {
      name: "Meal Dashboard",
      href: ROUTES.MEAL_PLANNER.DASHBOARD,
      icon: HomeOutlined,
      current: pathname === ROUTES.MEAL_PLANNER.DASHBOARD,
      searchParamsName: "page",
      searchParamsValue: "1",
    },
    {
      name: "Meal Plan Generator",
      href: ROUTES.MEAL_PLANNER.PLAN,
      icon: MicrowaveOutlined,
      current: pathname === ROUTES.MEAL_PLANNER.PLAN,
    },
    {
      name: "Meal Plan Preferences",
      href: ROUTES.MEAL_PLANNER.MEAL_PREFERENCES,
      icon: TuneOutlined,
      current: pathname === ROUTES.MEAL_PLANNER.MEAL_PREFERENCES,
    },
    {
      name: "Grocery List",
      href: "#", // Update with appropriate route if available
      icon: ShoppingCartOutlined,
      current: false,
    },
    {
      name: "Meal Plan",
      href: ROUTES.MEAL_PLANNER.MEAL_PLAN,
      icon: AssignmentOutlined,
      current: pathname === ROUTES.MEAL_PLANNER.MEAL_PLAN,
    },
    {
      name: "Recipes",
      href: ROUTES.MEAL_PLANNER.RECIPES.MANAGE_RECIPES, // Update with appropriate route if available
      icon: MenuBookOutlined,
      current: pathname === ROUTES.MEAL_PLANNER.RECIPES.MANAGE_RECIPES,
    },
    {
      name: "Meals",
      href: ROUTES.MEAL_PLANNER.MEALS, // Update with appropriate route if available
      icon: RestaurantMenuOutlined,
      current: pathname === ROUTES.MEAL_PLANNER.MEALS,
    },
    // Add more navigation items as needed
  ];

  return (
    <>
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-white"
                  />
                </button>
              </div>
            </TransitionChild>
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
              <div className="flex shrink-0 items-center">
                <CompanyLogo />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={
                              item.searchParamsName
                                ? `${item.href}?${createQueryString(
                                    item.searchParamsName,
                                    item.searchParamsValue
                                  )}`
                                : item.href
                            }
                            className={classNames(
                              item.current
                                ? "bg-gray-50 text-indigo-600"
                                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className={classNames(
                                item.current
                                  ? "text-indigo-600"
                                  : "text-gray-400 group-hover:text-indigo-600",
                                "h-6 w-6 shrink-0"
                              )}
                            />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs font-semibold leading-6 text-gray-400">
                      Your teams
                    </div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      {teams.map((team) => (
                        <li key={team.name}>
                          <a
                            href={team.href}
                            className={classNames(
                              team.current
                                ? "bg-gray-50 text-indigo-600"
                                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                            )}
                          >
                            <span
                              className={classNames(
                                team.current
                                  ? "border-indigo-600 text-indigo-600"
                                  : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium"
                              )}
                            >
                              {team.initial}
                            </span>
                            <span className="truncate">{team.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <div
                    id="edamam-badge"
                    data-color="badge"
                    className="mt-4 bg-gray-50 height-[50px] flex flex-col-reverse"
                  ></div>

                  <li className="mt-auto">
                    <Link
                      href={ROUTES.MEAL_PLANNER.SETTINGS.PROFILE}
                      className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    >
                      <Cog6ToothIcon
                        aria-hidden="true"
                        className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                      />
                      Settings
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex shrink-0 items-center">
            <CompanyLogo />
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-50 text-indigo-600"
                            : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                        )}
                      >
                        <item.icon
                          aria-hidden="true"
                          className={classNames(
                            item.current
                              ? "text-indigo-600"
                              : "text-gray-400 group-hover:text-indigo-600",
                            "h-6 w-6 shrink-0"
                          )}
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  Your teams
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {teams.map((team) => (
                    <li key={team.name}>
                      <a
                        href={team.href}
                        className={classNames(
                          team.current
                            ? "bg-gray-50 text-indigo-600"
                            : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                        )}
                      >
                        <span
                          className={classNames(
                            team.current
                              ? "border-indigo-600 text-indigo-600"
                              : "border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600",
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium"
                          )}
                        >
                          {team.initial}
                        </span>
                        <span className="truncate">{team.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              <div
                id="edamam-badge"
                data-color="badge"
                className="mt-4 bg-green-300 height-[50px]"
              ></div>
              <li className="mt-auto">
                <Link
                  href={ROUTES.MEAL_PLANNER.SETTINGS.PROFILE}
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                >
                  <Cog6ToothIcon
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                  />
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default SideBar;
