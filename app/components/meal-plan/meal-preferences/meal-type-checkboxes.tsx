import { MealNumber, MealType } from "@/constants/constants-enums";

interface MealTypeCheckBoxesProps {
  selectedMealTypes: string[];
  onChange: (mealType: string) => void;
  layout?: "vertical" | "grid";
}

const MealTypeCheckBoxes: React.FC<MealTypeCheckBoxesProps> = ({
  selectedMealTypes,
  onChange,
  layout = "vertical",
}) => {
  const handleMealTypeChange = (mealType: string) => {
    onChange(mealType);
  };

  const containerClasses =
    layout === "grid"
      ? "mt-4 grid grid-cols-2 gap-4"
      : "mt-4 divide-y divide-gray-200 border-b border-t border-gray-200";

  return (
    <fieldset>
      <legend className="text-base font-semibold text-gray-900">
        Meal Types
      </legend>
      <div className={containerClasses}>
        {Object.values(MealNumber).map((mealType) => (
          <div
            key={mealType}
            className={
              layout === "grid"
                ? "flex items-center"
                : "relative flex items-start py-4"
            }
          >
            <div className="min-w-0 flex-1 text-sm py-2">
              <label
                htmlFor={`meal-${mealType}`}
                className="select-none font-medium text-gray-900"
              >
                {mealType}
              </label>
            </div>
            <div className="ml-3 flex h-6 items-center">
              <input
                id={`meal-${mealType}`}
                name={`meal-${mealType}`}
                type="checkbox"
                checked={selectedMealTypes.includes(mealType)}
                onChange={() => handleMealTypeChange(mealType)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default MealTypeCheckBoxes;
