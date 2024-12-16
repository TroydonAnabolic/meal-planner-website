// components/SelectionItemForm.tsx

import { MealType } from "@/constants/constants-enums";
import { SelectionItem } from "@/models/interfaces/diet/meal-plan";
import React from "react";

interface SelectionItemFormProps {
  selectionItem: SelectionItem;
  index: number;
  onChange: (index: number, updatedSelectionItem: SelectionItem) => void;
}

const mealTypes = Object.values(MealType);

const SelectionItemForm: React.FC<SelectionItemFormProps> = ({
  selectionItem,
  index,
  onChange,
}) => {
  const handleAssignedChange = (mealType: string, value: string) => {
    const updatedSections = { ...selectionItem.sections };
    if (updatedSections[mealType]) {
      updatedSections[mealType].assigned = value;
    }
    onChange(index, { ...selectionItem, sections: updatedSections });
  };

  const handleLinkChange = (
    mealType: string,
    field: "title" | "href",
    value: string
  ) => {
    const updatedSections = { ...selectionItem.sections };
    if (updatedSections[mealType]) {
      updatedSections[mealType]._links.self[field] = value;
    }
    onChange(index, { ...selectionItem, sections: updatedSections });
  };

  return (
    <div className="p-4 border border-gray-200 rounded-md shadow-sm">
      <h4 className="text-lg font-medium mb-2">Selection {index + 1}</h4>
      {mealTypes.map((mealType) => (
        <div key={mealType} className="space-y-2 mb-4">
          <div className="flex items-center">
            <label className="w-24 text-gray-600 capitalize">{mealType}:</label>
            <input
              type="text"
              name={`selection[${index}].sections.${mealType}.assigned`}
              value={selectionItem.sections[mealType]?.assigned || ""}
              onChange={(e) => handleAssignedChange(mealType, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Assigned"
            />
          </div>
          <div className="flex items-center">
            <label className="w-24 text-gray-600 capitalize">
              {mealType} Title:
            </label>
            <input
              type="text"
              name={`selection[${index}].sections.${mealType}._links.self.title`}
              value={selectionItem.sections[mealType]?._links.self.title || ""}
              onChange={(e) =>
                handleLinkChange(mealType, "title", e.target.value)
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Link Title"
            />
          </div>
          <div className="flex items-center">
            <label className="w-24 text-gray-600 capitalize">
              {mealType} Href:
            </label>
            <input
              type="text"
              name={`selection[${index}].sections.${mealType}._links.self.href`}
              value={selectionItem.sections[mealType]?._links.self.href || ""}
              onChange={(e) =>
                handleLinkChange(mealType, "href", e.target.value)
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Link Href"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectionItemForm;
