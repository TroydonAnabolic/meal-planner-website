"use client";

import Link from "next/link";
import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import LogoutButton from "./logout-button";
import { useSession } from "next-auth/react";

const userNavigation = [
  { name: "Your Profile", href: "/meal-planner/settings/profile" },
  { name: "Settings", href: "/meal-planner/settings/general" },
  { name: "Sign Out", href: "#" },
];

const LoginLink: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === "authenticated" && session?.user) {
    return (
      <Menu as="div" className="relative">
        <MenuButton className="-m-1.5 flex items-center p-1.5">
          <span className="sr-only">Open user menu</span>
          <Image
            alt="profile-pic"
            width={30}
            height={30}
            src={
              session.user.profilePicUrl ||
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
              {session.user.givenName}
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
    );
  }

  return (
    <Link
      href="/login"
      className="text-sm font-semibold leading-6 text-gray-300 hover:text-gray-200 border border-gray-300 rounded-md px-3 py-1 hover:border-gray-200"
    >
      Log in <span aria-hidden="true">&rarr;</span>
    </Link>
  );
};

export default LoginLink;