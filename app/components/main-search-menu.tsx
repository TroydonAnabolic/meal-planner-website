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
import { deleteImageFromS3, saveImageToS3 } from "@/lib/s3-client";

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
  const { data } = useSession();
  const [profilePic, setProfilePic] = useState<string>(
    "/avatar/default-profile-pic.svg"
  );
  const [loading, setLoading] = useState(false);

  // Handles image upload
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setLoading(true);
        const base64Image = reader.result as string;
        const uploadedUrl = await saveImageToS3(
          base64Image,
          "clients/profile-pic"
        );
        if (uploadedUrl) {
          await saveProfilePicToDatabase(uploadedUrl);
          setProfilePic(uploadedUrl);
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Saves the new profile picture URL to the database
  const saveProfilePicToDatabase = async (url: string) => {
    try {
      const response = await fetch("/api/client/save-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePic: url }),
      });
      if (!response.ok)
        throw new Error("Failed to save profile picture to database.");
    } catch (error) {
      console.error(error);
    }
  };

  // Handles image deletion
  const handleDeleteImage = async () => {
    try {
      setLoading(true);
      const success = await deleteImageFromS3(profilePic);
      if (success) {
        await saveProfilePicToDatabase(""); // Save default state
        setProfilePic("/avatar/default-profile-pic.svg");
      }
    } catch (error) {
      console.error("Error deleting profile picture:", error);
    } finally {
      setLoading(false);
    }
  };

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
                  src={profilePic}
                  className="h-8 w-8 bg-gray-50"
                  style={{ borderRadius: "50%" }}
                />
                <span className="hidden lg:flex lg:items-center">
                  <span
                    aria-hidden="true"
                    className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                  >
                    <p>{data?.user?.givenName}</p>
                  </span>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="ml-2 h-5 w-5 text-gray-400"
                  />
                </span>
              </MenuButton>
              <MenuItems className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5">
                <MenuItem>
                  {({ active }) => (
                    <label
                      htmlFor="upload-profile-pic"
                      className={`block px-3 py-1 text-sm leading-6 cursor-pointer ${
                        active ? "bg-gray-50" : ""
                      } text-gray-900`}
                    >
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="upload-profile-pic"
                      />
                    </label>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={handleDeleteImage}
                      className={`block w-full text-left px-3 py-1 text-sm leading-6 ${
                        active ? "bg-gray-50" : ""
                      } text-red-600`}
                    >
                      Delete Photo
                    </button>
                  )}
                </MenuItem>
                {userNavigation.map((item) => (
                  <MenuItem key={item.name}>
                    <Link
                      href={item.href}
                      className="block px-3 py-1 text-sm leading-6 text-gray-900"
                    >
                      {item.name}
                    </Link>
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
