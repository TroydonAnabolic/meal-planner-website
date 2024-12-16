"use client";
import { deleteUser } from "@/actions/auth-actions";
import React from "react";
import { useFormState } from "react-dom";

type DeleteUserProps = {
  session: any; // Adjust the type according to your session object
};

const DeleteUser: React.FC<DeleteUserProps> = ({ session }) => {
  const [formData, formAction, isPending] = useFormState(
    deleteUser.bind(null, session),
    {
      errors: {},
    }
  );

  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-800">
          Delete account
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-400">
          No longer want to use our service? You can delete your account here.
          This action is not reversible. All information related to this account
          will be deleted permanently.
        </p>
      </div>
      <form action={formAction} className="flex items-start md:col-span-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
        >
          Yes, delete my account
        </button>
      </form>
    </div>
  );
};

export default DeleteUser;
