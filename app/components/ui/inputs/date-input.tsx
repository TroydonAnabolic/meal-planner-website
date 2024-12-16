import { formatDate } from "@/util/date-util";
import React from "react";

interface DateInputProps {
  label: string;
  type: string;
  name: string;
  id: string;
  value: Date;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
  label,
  type,
  name,
  id,
  value,
  onChange,
  placeholder = "",
  required = false,
}) => {
  return (
    <div className="sm:col-span-3">
      <label htmlFor={id} className="block text-sm font-medium text-gray-800">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        value={formatDate(value)}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-2 block w-full rounded-md border border-gray-300 py-1.5 text-gray-800 shadow-sm focus:ring-2 focus:ring-cyan-500 sm:text-sm"
      />
    </div>
  );
};

export default DateInput;
