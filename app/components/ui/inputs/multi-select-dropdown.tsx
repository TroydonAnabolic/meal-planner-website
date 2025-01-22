// components/MultiSelectDropdownCheckbox.tsx

"use client";

import React, { useState, Fragment, useEffect } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
  Transition,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectDropdownCheckboxProps {
  title: string;
  options: Option[];
  selectedValues: string[];
  onSelect: (selected: string[]) => void;
  disabled?: boolean;
  readOnly?: boolean;
  requireSelection?: boolean;
}

const MultiSelectDropdownCheckbox: React.FC<
  MultiSelectDropdownCheckboxProps
> = ({
  title,
  options,
  selectedValues,
  onSelect,
  disabled = false,
  readOnly = false,
  requireSelection = false,
}) => {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase())
        );

  const handleChange = (selected: any) => {
    if (!readOnly && !disabled) {
      onSelect(Array.isArray(selected) ? selected : [selected]);
    }
  };

  return (
    <Combobox
      value={selectedValues}
      onChange={handleChange}
      multiple
      as="div"
      className="w-full"
    >
      <div className="relative mt-1">
        <Label className="block text-sm font-medium text-gray-700">
          {title}
        </Label>
        <div
          className="relative w-full cursor-default overflow-hidden rounded-md border border-gray-300 bg-white text-gray-500 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          title={
            selectedValues
              ? options
                  .filter((opt) => selectedValues.includes(opt.value))
                  .map((opt) => opt.label)
                  .join(", ")
              : "No values selected"
          }
        >
          <ComboboxInput
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            displayValue={() => {
              if (!selectedValues) return "No values selected"; // Handle undefined case
              const selectedLabels = options
                .filter((opt) => selectedValues.includes(opt.value))
                .map((opt) => opt.label);
              const preview = selectedLabels.slice(0, 3).join(", ");
              return selectedLabels.length > 3 ? `${preview}, ...` : preview;
            }}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Select ${title}`}
            disabled={disabled}
            readOnly={readOnly}
            required={requireSelection}
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </ComboboxButton>
        </div>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <ComboboxOption
                  key={option.value}
                  value={option.value}
                  as={Fragment}
                >
                  {({ active, selected }) => (
                    <div
                      className={`relative cursor-pointer select-none py-2 pl-3 pr-4 ${
                        active ? "bg-indigo-600 text-white" : "text-gray-900"
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          title="Select"
                          type="checkbox"
                          checked={
                            selectedValues
                              ? selectedValues?.includes(option.value)
                              : undefined
                          }
                          readOnly
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          disabled={disabled}
                          required={requireSelection}
                        />
                        <span className="ml-3 block truncate">
                          {option.label}
                        </span>
                      </div>
                    </div>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>
  );
};

export default MultiSelectDropdownCheckbox;
