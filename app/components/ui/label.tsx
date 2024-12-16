// Label.tsx
import React from "react";

type LabelProps = {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
};

const Label: React.FC<LabelProps> = ({ htmlFor, children, className = "" }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium text-gray-800 ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;
