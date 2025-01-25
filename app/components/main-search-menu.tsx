"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import React, { useState } from "react";
import Link from "next/link";
import LogoutButton from "./auth/logout-button";
import { useSession } from "next-auth/react";
import Image from "next/image";

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Meal History", href: "#" },
  { name: "Diet Preferences", href: "#" },
  { name: "Sign Out", href: "#" },
];

type MainSearchMenuProps = {
  setSidebarOpen: (value: boolean) => void;
};

const MainSearchMenu: React.FC<MainSearchMenuProps> = ({ setSidebarOpen }) => {
  const { data: session } = useSession();

  return (
    <div className="lg:pl-72">
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon aria-hidden="true" className="h-6 w-6" />
        </button>

        <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden" />

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form action="#" method="GET" className="relative flex flex-1">
            <label htmlFor="search-field" className="sr-only">
              Search
            </label>
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
            />
            <input
              id="search-field"
              name="search"
              type="search"
              placeholder="Search for meals, ingredients, or recipes..."
              className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            />
          </form>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="h-6 w-6" />
            </button>
            <div
              aria-hidden="true"
              className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
            />
            <Menu as="div" className="relative">
              <MenuButton className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                <Image
                  alt="profile-pic"
                  width={30}
                  height={30}
                  src={
                    session?.user.profilePicUrl ||
                    "/avatar/default-profile-pic.svg"
                  }
                  className="h-10 w-10"
                  style={{ borderRadius: "50%" }}
                />
                <span className="hidden lg:flex lg:items-center">
                  <span
                    aria-hidden="true"
                    className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                  >
                    <p>{session?.user?.givenName}</p>
                  </span>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="ml-2 h-5 w-5 text-gray-400"
                  />
                </span>
              </MenuButton>
              <MenuItems className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5">
                {userNavigation.map((item) => (
                  <MenuItem key={item.name}>
                    {item.name === "Sign Out" ? (
                      <LogoutButton item={item} />
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                      >
                        {item.name}
                      </Link>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSearchMenu;
