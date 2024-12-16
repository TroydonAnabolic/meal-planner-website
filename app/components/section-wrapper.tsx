// SectionWrapper.tsx
import React from "react";

interface SectionWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-800">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">{description}</p>
      </div>
      <div className="md:col-span-2">{children}</div>
    </div>
  );
};

export default SectionWrapper;
