"use client";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface DropdownProps<T extends string> {
  label: string;
  options: T[];
  selected: T;
  onChange: (value: T) => void;
  name: string;
  placeholder?: string; // Added optional placeholder prop
  containerClassName?: string; // Added optional containerClassName prop
}

const SelectDropdown = <T extends string>({
  label,
  options,
  selected,
  onChange,
  name,
  placeholder,
  containerClassName,
}: DropdownProps<T>) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium leading-6 text-gray-900"
    >
      {label}
    </label>
    <div className={containerClassName ? containerClassName : "relative mt-2"}>
      {/* Listbox with a hidden input */}
      <input type="hidden" name={name} value={selected} />{" "}
      {/* Hidden input to handle formData */}
      <Listbox value={selected} onChange={onChange}>
        <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <span className="block truncate">{selected || placeholder}</span>{" "}
          {/* Handle placeholder */}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-400"
            />
          </span>
        </ListboxButton>
        <ListboxOptions className="z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {options.map((option) => (
            <ListboxOption
              key={option}
              value={option}
              className="cursor-default select-none relative py-2 pl-8 pr-4 text-gray-600"
            >
              <span className="block truncate">{option}</span>
              {selected === option && (
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  </div>
);

export default SelectDropdown;
