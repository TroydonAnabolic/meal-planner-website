import React from "react";

interface TextInputProps {
  label: string;
  type: string;
  name: string;
  id: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  containerClassName?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  type,
  name,
  id,
  value,
  onChange,
  placeholder = "",
  required = false,
  containerClassName,
}) => {
  return (
    <div className={containerClassName || "sm:col-span-3"}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-800">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-2 block w-full rounded-md border border-gray-300 py-1.5 text-gray-800 shadow-sm focus:ring-2 focus:ring-cyan-500 sm:text-sm"
      />
    </div>
  );
};

export default TextInput;
