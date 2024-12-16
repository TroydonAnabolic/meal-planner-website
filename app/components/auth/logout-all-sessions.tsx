"use client";
import { logoutAllUsers } from "@/actions/auth-actions";
import React from "react";
import { useFormState } from "react-dom";

type LogoutAllUsersProps = {
  session: any; // Adjust the type according to your session object
};

const LogoutAllUsers: React.FC<LogoutAllUsersProps> = ({ session }) => {
  const [formData, formAction, isPending] = useFormState(
    logoutAllUsers.bind(null, session),
    {
      errors: {},
    }
  );

  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-800">
          Log out other sessions
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-400">
          Please enter your password to confirm you would like to log out of
          your other sessions across all of your devices.
        </p>
      </div>
      <form action={formAction} className="md:col-span-2">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
          <div className="col-span-full">
            <label
              htmlFor="logout-password"
              className="block text-sm font-medium leading-6 text-gray-800"
            >
              Your password
            </label>
            <div className="mt-2">
              <input
                id="logout-password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="mt-2 block w-full rounded-md border border-gray-300 py-1.5 text-gray-800 shadow-sm focus:ring-2 focus:ring-cyan-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        {formData?.errors && (
          <ul id="form-errors" className="text-red-700">
            {Object.keys(formData.errors).map((error) => (
              <li key={error}>{formData.errors![error]}</li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Log out other sessions
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogoutAllUsers;
