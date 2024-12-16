// EmailInput.tsx
import React, { useState } from "react";
import { EnvelopeIcon } from "@heroicons/react/20/solid";

interface EmailInputProps {
  label?: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({
  label = "Email Address",
  name,
  value,
  onChange,
  placeholder = "you@example.com",
  required = false,
}) => {
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    validateEmail(email);
    onChange(e); // Pass the event to the parent handler
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-800">
        {label}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <EnvelopeIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={name}
          name={name}
          type="email"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          className={`block w-full rounded-md border-0 py-1.5 pl-10 text-gray-800 ring-1 ring-inset ${
            error ? "ring-red-500" : "ring-gray-300"
          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm`}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default EmailInput;
