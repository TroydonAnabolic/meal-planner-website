// app/components/ui/LabelDropdown.tsx

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import React from "react";

interface Option {
  label: string;
  value: string;
  onClick?: () => void;
}

interface DropdownProps {
  label: string;
  name: string;
  options: Option[];
  buttonLabel: string;
  value: string; // Added value prop
}

const LabelDropdown: React.FC<DropdownProps> = ({
  label,
  name,
  options,
  buttonLabel,
  value, // Destructured value
}) => {
  return (
    <div className="flex flex-col">
      {/* Dropdown Label */}
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      {/* Hidden Input */}
      <input type="hidden" name={name} value={value} />
      <Menu as="div" className="relative inline-block text-left w-full">
        <div>
          <MenuButton className="inline-flex w-full justify-between items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            {buttonLabel}
            <ChevronDownIcon
              aria-hidden="true"
              className="ml-2 h-5 w-5 text-gray-400"
            />
          </MenuButton>
        </div>

        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {options?.map((option) => (
              <MenuItem key={option.value}>
                {({ active }) => (
                  <button
                    onClick={option.onClick}
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } block w-full text-left px-4 py-2 text-sm`}
                  >
                    {option.label}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
};

export default LabelDropdown;
