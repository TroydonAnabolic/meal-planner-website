import { logout } from "@/actions/auth-actions";
import React from "react";

type Props = {
  item: {
    name: string;
  };
};

const LogoutButton = ({ item }: Props) => {
  return (
    <button
      onClick={() => logout()}
      className="block w-full text-left px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
    >
      {item.name}
    </button>
  );
};

export default LogoutButton;
