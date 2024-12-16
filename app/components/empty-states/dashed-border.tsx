import Image from "next/image";
import React from "react";

interface EmptyStateDashedBordersProps {
  text?: string;
  children?: React.ReactNode;
}

const EmptyStateDashedBorders: React.FC<EmptyStateDashedBordersProps> = ({
  text,
  children,
}) => {
  return (
    <div className="relative w-full h-64 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center flex flex-col items-center justify-center">
      {children ? (
        children
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          className="w-16 h-16 text-gray-400"
        >
          <>
            <circle
              cx="20"
              cy="26"
              r="4"
              stroke="currentColor"
              strokeWidth={2}
              fill="currentColor"
            />
            <circle
              cx="32"
              cy="26"
              r="4"
              stroke="currentColor"
              strokeWidth={2}
              fill="currentColor"
            />
            <circle
              cx="44"
              cy="26"
              r="4"
              stroke="currentColor"
              strokeWidth={2}
              fill="currentColor"
            />
            <path
              d="M16 30 C16 35, 48 35, 48 30"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M32 30 V40"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        </svg>
      )}
      {text && (
        <span className="mt-4 block text-lg font-semibold text-gray-300">
          {text}
        </span>
      )}
    </div>
  );
};

export default EmptyStateDashedBorders;
