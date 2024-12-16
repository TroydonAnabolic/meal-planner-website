"use client";

import { FC } from "react";
import { Field, Label, Switch } from "@headlessui/react";

interface ToggleInputProps {
  label: string;
  subLabel?: string;
  enabled: boolean;
  disableInput?: boolean;
  onChange: (() => void) | ((enabled: boolean) => void);
}

const ToggleInput: FC<ToggleInputProps> = ({
  label,
  subLabel,
  enabled,
  disableInput,
  onChange,
}) => {
  return (
    <Field className="flex items-center">
      <Switch
        checked={enabled}
        onChange={onChange}
        disabled={disableInput}
        className={`group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent ${
          enabled ? "bg-indigo-600" : "bg-gray-200"
        } transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </Switch>
      <Label as="span" className="ml-3 text-sm">
        <span className="font-medium text-gray-900">{label}</span>{" "}
        <span className="text-gray-500">{subLabel ?? ""}</span>
      </Label>
    </Field>
  );
};

export default ToggleInput;
