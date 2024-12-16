import React from "react";
import Label from "../../ui/label";

interface NutrientSliderProps {
  nutrient: string;
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}

const NutrientSlider: React.FC<NutrientSliderProps> = ({
  nutrient,
  min,
  max,
  onChange,
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value);
    onChange(newMin, max);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value);
    onChange(min, newMax);
  };

  return (
    <div className="space-y-2">
      <Label className="block text-sm font-medium leading-6 text-gray-800 py-6">
        {nutrient} Range
      </Label>
      <div className="flex space-x-4">
        <div>
          <Label htmlFor={`${nutrient}-min`}>Min</Label>
          <input
            title="Increase Quantity"
            type="number"
            id={`${nutrient}-min`}
            value={min}
            onChange={handleMinChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 text-gray-800"
          />
        </div>
        <div>
          <Label htmlFor={`${nutrient}-max`}>Max</Label>
          <input
            title="Increase Quantity"
            type="number"
            id={`${nutrient}-max`}
            value={max}
            onChange={handleMaxChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 text-gray-800"
          />
        </div>
      </div>
    </div>
  );
};

export default NutrientSlider;
