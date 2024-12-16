// app/components/ui/Labels.tsx

import React from "react";

interface LabelsProps {
  items: string[];
  onLabelClick: (item: string) => void;
}

const Labels: React.FC<LabelsProps> = ({ items, onLabelClick }) => {
  return (
    <div className="mt-2 flex flex-wrap max-w-xs max-h-20 overflow-y-auto">
      {items.map((item, index) => (
        <span
          key={index}
          onClick={() => onLabelClick(item)}
          className="mr-2 mb-2 cursor-pointer rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-300 transition-colors duration-200"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

export default Labels;
