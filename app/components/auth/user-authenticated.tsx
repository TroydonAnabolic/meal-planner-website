import Link from "next/link";
import React from "react";

type Props = {};

const UserAuthenticated = (props: Props) => {
  return (
    <div>
      <p className="text-gray-600 mt-4">
        You are already authenticated. You can go to your{" "}
        <Link
          href="/meal-planner/dashboard"
          className="text-indigo-600 hover:text-indigo-500"
        >
          Dashboard
        </Link>
        .
      </p>
    </div>
  );
};

export default UserAuthenticated;
