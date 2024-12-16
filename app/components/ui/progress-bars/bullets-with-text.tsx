import { CheckCircleIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import React from "react";

interface Step {
  id: string; // Added id property
  name: string;
  description: string; // Added description property
  href: string;
  status: "complete" | "current" | "upcoming";
}

interface BulletsWithTextProps {
  steps: Step[];
  onStepChange: (stepId: string) => void; // Added onStepChange prop
}

const BulletsWithText: React.FC<BulletsWithTextProps> = ({
  steps,
  onStepChange,
}) => {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <nav aria-label="Progress" className="flex justify-center">
        <ol role="list" className="space-y-6">
          {steps.map((step) => (
            <li key={step.id}>
              {step.status === "complete" ? (
                <Link
                  href={step.href}
                  className="group"
                  onClick={(e) => {
                    e.preventDefault();
                    onStepChange(step.id);
                  }}
                >
                  <span className="flex items-start">
                    <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                      <CheckCircleIcon
                        aria-hidden="true"
                        className="h-full w-full text-indigo-600 group-hover:text-indigo-800"
                      />
                    </span>
                    <span className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                      {step.name}
                    </span>
                  </span>
                </Link>
              ) : step.status === "current" ? (
                <Link
                  href={step.href}
                  aria-current="step"
                  className="flex items-start"
                  onClick={(e) => {
                    e.preventDefault();
                    onStepChange(step.id);
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center"
                  >
                    <span className="absolute h-4 w-4 rounded-full bg-indigo-200" />
                    <span className="relative block h-2 w-2 rounded-full bg-indigo-600" />
                  </span>
                  <span className="ml-3 text-sm font-medium text-indigo-600">
                    {step.name}
                  </span>
                </Link>
              ) : (
                <Link
                  href={step.href}
                  className="group"
                  onClick={(e) => {
                    e.preventDefault();
                    onStepChange(step.id);
                  }}
                >
                  <div className="flex items-start">
                    <div
                      aria-hidden="true"
                      className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center"
                    >
                      <div className="h-2 w-2 rounded-full bg-gray-300 group-hover:bg-gray-400" />
                    </div>
                    <p className="ml-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                      {step.name}
                    </p>
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default BulletsWithText;
