import React, { useState } from "react";

interface TextInputWithButtonProps {
  placeholder: string;
  buttonText: string;
  label: string;
  onButtonPress: (value: string, type: string) => void;
  type: string;
  className?: string;
}

const TextInputWithButton: React.FC<TextInputWithButtonProps> = ({
  placeholder,
  buttonText,
  label,
  onButtonPress,
  type,
  className,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleButtonClick = () => {
    if (inputValue.trim()) {
      onButtonPress(inputValue, type);
      setInputValue("");
    }
  };

  return (
    <div className="flex items-end">
      <div className="flex flex-col">
        <label htmlFor="input" className="mb-1 text-gray-700">
          {label}
        </label>
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={`block w-full rounded-md border border-gray-300 py-1.5 text-gray-800 shadow-sm focus:ring-2 focus:ring-cyan-500 sm:text-sm ${className}`}
        />
      </div>
      <button
        type="button"
        onClick={handleButtonClick}
        className="ml-2 rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus:ring-2 focus:ring-cyan-500"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default TextInputWithButton;
