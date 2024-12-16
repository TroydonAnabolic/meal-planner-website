import React from "react";
import Label from "../label";
import Checkbox from "../checkbox";

interface CheckboxGroupProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onChange: (value: string) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  selectedOptions,
  onChange,
}) => {
  const handleChange = (option: string) => {
    onChange(option);
  };

  return (
    <div>
      <Label className="block text-sm font-medium leading-6 text-gray-800">
        {label}
      </Label>

      <div className="space-y-2 border border-gray-300 rounded p-4 h-64 overflow-y-auto ">
        <div className="grid grid-cols-2 gap-2">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={option}
                checked={selectedOptions.includes(option)}
                onCheckedChange={() => handleChange(option)}
              />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckboxGroup;
