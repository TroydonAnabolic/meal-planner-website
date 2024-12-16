// pages/confirmation.tsx
import { auth } from "@/auth";
import React from "react";
import Link from "next/link";
import UserAuthenticated from "@/app/components/auth/user-authenticated";

const ConfirmationPage: React.FC = async () => {
  const session = await auth();

  return (
    <main className="flex min-h-screen w-full">
      {/* Left Section: Form Content */}
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Registration Request Sent, Check Your Email to confirm your account
        </h2>
        {session ? (
          <UserAuthenticated />
        ) : (
          <p className="text-gray-600 mt-4">
            If you already have an account, please{" "}
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-500"
            >
              login
            </Link>
            .
          </p>
        )}
      </div>
    </main>
  );
};

export default ConfirmationPage;
