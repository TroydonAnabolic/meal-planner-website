// app/components/ui/ActionPanelButton.tsx

import React from "react";

interface ActionPanelProps {
  title: string;
  description: React.ReactNode;
  buttonText: string;
  onClick: () => void;
  icon?: React.ReactNode; // Optional icon prop
  type?: "button" | "submit" | "reset"; // Optional type prop
  className?: string; // Optional className for custom styling
  disabled?: boolean;
}

const ActionPanelButton: React.FC<ActionPanelProps> = ({
  title,
  description,
  buttonText,
  onClick,
  icon,
  type = "button",
  className = "",
  disabled,
}) => {
  return (
    <div className={`bg-indigo-50 shadow-lg sm:rounded-lg w-full ${className}`}>
      <div className="px-6 py-6">
        <h3 className="text-xl font-semibold text-indigo-700">{title}</h3>
        <div className="mt-4">
          <div className="max-w-xl text-sm text-indigo-600">{description}</div>
          <div className="mt-6 flex justify-center">
            <button
              type={type}
              disabled={disabled}
              onClick={onClick}
              className="inline-flex items-center rounded-md bg-indigo-600 px-5 py-3 text-lg font-semibold text-white shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {icon && (
                <span className="mr-3">
                  {React.cloneElement(icon as React.ReactElement, {
                    className: "h-6 w-6",
                  })}
                </span>
              )}
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionPanelButton;
