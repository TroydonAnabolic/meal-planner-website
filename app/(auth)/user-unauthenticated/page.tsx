import Link from "next/link";
import React from "react";

type Props = {};

const UserAuthenticated = (props: Props) => {
  return (
    <main className="flex min-h-screen w-full">
      {/* Left Section: Form Content */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
        <p className="text-gray-600 mt-4">
          You need to be logged in to access this page.
        </p>
        <Link
          href="/login"
          className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block"
        >
          Login
        </Link>
      </div>
    </main>
  );
};

export default UserAuthenticated;
